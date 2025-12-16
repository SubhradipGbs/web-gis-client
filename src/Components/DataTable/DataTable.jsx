import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Dropdown, Overlay, Popover, Table } from "react-bootstrap";
import "./datatable.css";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import {
  FaChevronDown,
  FaDownload,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa6";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { RiFilterOffFill, RiFilterOffLine } from "react-icons/ri";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const DataTable = ({
  data,
  columns,
  areaId,
  plotId,
  sumRequired = false,
  columnPinning = {
    left: [],
    right: [],
  },
}) => {
  const [expanded, setExpanded] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnfilterd, setColumnFiltered] = useState([]);

  const memoizedData = React.useMemo(() => data, [data]);
  const memoizedColumns = React.useMemo(() => columns, []);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getSubRows: (row) => row.owner || [],
    globalFilterFn: "includesString",
    filterFns: {
      arrayIncludes: (row, columnId, filterValue) => {
        const cellValue = row.getValue(columnId);
        if (!filterValue || filterValue.length === 0) {
          return true;
        }
        return Array.isArray(filterValue) && filterValue.includes(cellValue);
      },
    },
    onColumnFiltersChange: setColumnFiltered,
    state: {
      pagination,
      expanded,
      globalFilter,
      columnFilters: columnfilterd,
      columnPinning: columnPinning,
    },
    onExpandedChange: setExpanded,
    initialState: {
      pagination,
      globalFilter,
      columnFilters: columns
        .filter((col) => col.initialFilterValue)
        .map((col) => ({ id: col.accessor, value: col.initialFilterValue })),
    },
    enableColumnPinning: true,
    debugTable: true,
  });

  const getCommonPinningStyles = (column) => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
      isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn =
      isPinned === "right" && column.getIsFirstColumn("right");

    return {
      boxShadow: isLastLeftPinnedColumn
        ? "-4px 0 4px -4px gray inset"
        : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
      left:
        isPinned === "left" ? `${column.getStart("left") - 1}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      opacity: isPinned ? 0.95 : 1,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
    };
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleSearchChange = debounce((value) => {
    setGlobalFilter(value);
  }, 300);

  const exportData = (type) => {
    const visibleColumns = table
      .getAllColumns()
      .filter((col) => col.getIsVisible());

    const columnHeaderMap = {};
    visibleColumns.forEach((col) => {
      if (col.columnDef.accessorKey) {
        columnHeaderMap[col.columnDef.accessorKey] = col.columnDef.header;
      }
    });

    const filteredData = table.getFilteredRowModel().rows.map((row, index) => {
      const originalRow = row.original;
      const updatedRow = {};

      visibleColumns.forEach((col) => {
        const accessorKey = col.columnDef.accessorKey;
        if (accessorKey) {
          updatedRow[columnHeaderMap[accessorKey]] = originalRow[accessorKey];
        }
      });

      updatedRow[columnHeaderMap["sl_no"] || "Sl No"] = index + 1;
      return updatedRow;
    });

    const footerRow = visibleColumns.reduce((row, col) => {
      const accessorKey = col.columnDef.accessorKey;

      if (accessorKey) {
        const footerValue =
          col.columnDef.footer && typeof col.columnDef.footer === "function"
            ? col.columnDef.footer({
                table,
              })
            : "";

        row[columnHeaderMap[accessorKey]] = footerValue;
      } else {
        row[columnHeaderMap[accessorKey]] = "";
      }

      return row;
    }, {});
    footerRow[columnHeaderMap["sl_no"] || "Sl No"] = "Total";

    const dataWithFooter = [...filteredData, footerRow];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataWithFooter);

    Object.keys(worksheet).forEach((key) => {
      if (key.startsWith("!")) return;
      const cell = worksheet[key];
      if (!isNaN(cell.v) && cell.t === "s") {
        cell.t = "n";
        cell.v = parseFloat(cell.v);
      }
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, "data");

    const fileType =
      type === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv;charset=utf-8;";
    const fileExtension = type === "excel" ? ".xlsx" : ".csv";

    let fileData;

    if (type === "excel") {
      fileData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    } else {
      const csvData = XLSX.write(workbook, { bookType: "csv", type: "string" });

      const bom = "\uFEFF";
      fileData = bom + csvData;
    }

    const blob = new Blob([fileData], { type: fileType });

    saveAs(blob, `table_data${fileExtension}`);
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    const visibleHeaders = table
      .getAllColumns()
      .filter((col) => col.getIsVisible());
    const headers = visibleHeaders.map((col) => {
      let obj = {
        header: col.columnDef.header,
        dataKey: col.columnDef.accessorKey,
      };
      return obj;
    });

    const dataRows = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);

    autoTable(doc, {
      columns: headers,
      body: dataRows,
    });
    doc.save("table_data.pdf");
  };

  const toggleFilterOpen = () => {
    setColumnFiltered([]);
  };

  return (
    <div className="data-table">
      <div className="d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start align-items-md-center mb-1">
        <div className="flex-grow-1 d-flex flex-row justify-content-between align-items-center gap-2 me-1">
          {/* {sumRequired && (
            <h6 className='fw-bold'>Total Area : {totalArea} acre</h6>
          )} */}
          <div className="search-box">
            <input
              className="search-input"
              placeholder="Search..."
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <HiMiniMagnifyingGlass className="search-icon" />
          </div>
          <button
            className="filterBtn"
            onClick={toggleFilterOpen}
            disabled={columnfilterd.length == 0}
          >
            <RiFilterOffFill size={16} /> Clear
          </button>
          <div className="d-block d-md-none">
            <Dropdown>
              <Dropdown.Toggle className='page-button d-flex align-items-center gap-2 py-2'>
                <FaDownload />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => exportData("excel")}>
                  Excel
                </Dropdown.Item>
                <Dropdown.Item onClick={() => exportData("csv")}>
                  CSV
                </Dropdown.Item>
                {/* <Dropdown.Item onClick={() => exportPdf()}>PDF</Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          {table.getCoreRowModel().rows.length > 0 && (
            <div className="pagination my-2">
              <div style={{ width: "100px" }}>
                <select
                  className="form-select form-select-sm"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {[25, 50, 100, 200].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-none md:d-block">Page: </div>
              <strong className="d-none d-md-block">
                {table.getState().pagination.pageIndex + 1}/{" "}
                {table.getPageCount().toLocaleString()}
              </strong>
              <button
                className="page-button"
                onClick={() => {
                  table.firstPage();
                }}
                disabled={!table.getCanPreviousPage()}
              >
                First
              </button>
              <button
                className="page-button"
                disabled={!table.getCanPreviousPage()}
                onClick={() => {
                  table.previousPage();
                }}
              >
                Prev
              </button>
              <button className="btn btn-sm">
                {table.getState().pagination.pageIndex + 1}
              </button>
              <button
                className="page-button"
                disabled={!table.getCanNextPage()}
                onClick={() => {
                  table.nextPage();
                }}
              >
                Next
              </button>
              <button
                className="page-button"
                disabled={!table.getCanNextPage()}
                onClick={() => {
                  table.lastPage();
                }}
              >
                Last
              </button>
            </div>
          )}
          <div className="d-none d-md-block">
            <Dropdown>
              <Dropdown.Toggle className="page-button d-flex align-items-center gap-2 py-2">
                <FaDownload />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => exportData("excel")}>
                  Excel
                </Dropdown.Item>
                <Dropdown.Item onClick={() => exportData("csv")}>
                  CSV
                </Dropdown.Item>
                {/* <Dropdown.Item onClick={() => exportPdf()}>PDF</Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="table-container">
        <Table striped bordered size="sm" style={{ fontSize: "0.85rem" }}>
          <thead className="table-active">
            {table.getHeaderGroups().map((headergrp) => (
              <tr key={headergrp.id}>
                {headergrp.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles(header.column),
                      verticalAlign: `${
                        header.column.getCanFilter() ? "middle" : "top"
                      }`,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      backgroundColor: "#E5E5E5",
                    }}
                    className="px-2 cursor-pointer table-active"
                  >
                    <span
                      className="d-flex justify-content-between align-items-center gap-2 mb-1"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.column.columnDef.header}
                      <span
                      // className='d-flex gap-2 align-items-center flex-grow-1'
                      >
                        {header.column.getCanSort() &&
                          !header.column.getIsSorted() && (
                            <FaSort size={12} opacity={0.7} />
                          )}
                        {header.column.getIsSorted() == "asc" && (
                          <FaSortUp size={12} opacity={0.7} />
                        )}
                        {header.column.getIsSorted() == "desc" && (
                          <FaSortDown size={12} opacity={0.7} />
                        )}
                      </span>
                      {/* <span>
                      {header.column.getCanFilter() && (
                        <span
                          style={{
                            cursor: "pointer",
                            alignSelf: "flex-end",
                            marginLeft: "2rem",
                          }}>
                          <FaFilter
                            size={12}
                            onClick={(e) => {
                              e.stopPropagation();
                              header.column.setFilterValue("");
                            }}
                            opacity={0.5}
                          />
                        </span>
                      )}
                    </span> */}
                    </span>
                    {header.column.getCanFilter() && (
                      <Filter column={header.column} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <tr style={{ position: "relative" }}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        whiteSpace: "nowrap",
                        ...getCommonPinningStyles(cell.column),
                        height: "100%",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() &&
                  row.original.owner.map((item) => (
                    <tr
                      key={item.lr_khatian_no}
                      style={{ backgroundColor: "#9DC08B !important" }}
                    >
                      <td
                        colSpan={1}
                        style={{ backgroundColor: "#9DC08B" }}
                      ></td>
                      <td
                        colSpan={9}
                        style={{ backgroundColor: "#9DC08B" }}
                      ></td>
                      <td colSpan={1} style={{ backgroundColor: "#9DC08B" }}>
                        {item.owner_name_or_raiayat}
                      </td>
                      <td
                        colSpan={1}
                        style={{ backgroundColor: "#9DC08B" }}
                      ></td>
                      <td colSpan={1} style={{ backgroundColor: "#9DC08B" }}>
                        {item.lr_khatian_no}
                      </td>
                      <td colSpan={1} style={{ backgroundColor: "#9DC08B" }}>
                        {item.owner_address_or_raiayat}
                      </td>
                      <td colSpan={1} style={{ backgroundColor: "#9DC08B" }}>
                        {item.owner_share_in_plot}
                      </td>
                      <td
                        colSpan={row.getVisibleCells().length - 14}
                        style={{ backgroundColor: "#9DC08B" }}
                      ></td>
                    </tr>
                  ))}
              </Fragment>
            ))}
            {!data.length ||
              (table.getFilteredRowModel().rows.length == 0 && (
                <tr>
                  <td className="p-2 text-left" colSpan={columns.length}>
                    No records found
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            {!!table.getFooterGroups() &&
              table.getFooterGroups().map((footerGrp) => (
                <tr key={footerGrp.id} className="table-active">
                  {footerGrp.headers.map((header) => (
                    <td className="fw-bold" key={header.id}>
                      {flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tfoot>
        </Table>
      </div>

      {table.getCoreRowModel().rows.length > 0 && (
        <div className="pagination justify-content-start justify-content-md-end my-2">
          <div style={{ width: "100px" }}>
            <select
              className="form-select select-sm"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[25, 50, 100, 200].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="d-none d-md-block">Page: </div>
          <strong className="d-none d-md-block">
            {table.getState().pagination.pageIndex + 1}/{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
          <button
            className="page-button"
            onClick={() => {
              table.firstPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </button>
          <button
            className="page-button"
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.previousPage();
            }}
          >
            Prev
          </button>
          <button className="btn btn-sm">
            {table.getState().pagination.pageIndex + 1}
          </button>
          <button
            className="page-button"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              table.nextPage();
            }}
          >
            Next
          </button>
          <button
            className="page-button"
            disabled={!table.getCanNextPage()}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              table.lastPage();
            }}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
};

function flexRender(Component, props) {
  if (typeof Component === "function") {
    return <Component {...props} />;
  }
  if (typeof Component === "string") {
    return Component;
  }
  return null;
}

export default DataTable;

function Filter({ column }) {
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      filterVariant === "range"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant]
  );
  const checkBoxValues = useMemo(
    () =>
      Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 5000),
    [column.getFacetedUniqueValues()]
  );

  const [showDropdown, setShowDropdown] = React.useState(false);

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <select
      style={{ minWidth: "100%" }}
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString() || ""}
    >
      <option value="">All</option>
      {sortedUniqueValues.map((value) => (
        <option value={value} key={value}>
          {value || "NIL"}
        </option>
      ))}
    </select>
  ) : filterVariant === "checkbox" ? (
    <div style={{ position: "relative" }}>
      <button
        className="dropdownBtn"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        Choose an option
        <FaChevronDown />
      </button>
      {showDropdown && (
        <div className="dropdownFilter w-100 shadow p-1">
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontSize: "0.7rem",
              verticalAlign: "middle",
            }}
          >
            <input
              className="me-1"
              type="checkbox"
              checked={
                columnFilterValue?.length == sortedUniqueValues?.length || false
              }
              onChange={(e) => {
                const isChecked = e.target.checked;
                column.setFilterValue((prev) =>
                  isChecked ? [...sortedUniqueValues] : undefined
                );
              }}
            />
            Select All
          </label>
          {sortedUniqueValues.map((value) => (
            <label
              key={value}
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "0.7rem",
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              <input
                className="me-1"
                type="checkbox"
                checked={columnFilterValue?.includes(value) || false}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  column.setFilterValue((prev) =>
                    isChecked
                      ? [...(prev || []), value]
                      : prev?.filter((v) => v !== value) || []
                  );
                }}
              />
              {value || "NIL"}
            </label>
          ))}
        </div>
      )}
    </div>
  ) : (
    <>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      style={{ minWidth: "100%" }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
