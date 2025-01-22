import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import { Table } from "react-bootstrap";
import "./datatable.css";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

const DataTable = ({ data, columns }) => {
  const [totalArea, setTotalArea] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnfilterd, setColumnFiltered] = useState([]);

  const memoizedData = React.useMemo(() => data, [data]);
  const memoizedColumns = React.useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    onColumnFiltersChange: setColumnFiltered,
    state: {
      pagination,
      globalFilter,
      columnFilters: columnfilterd,
    },
    initialState: {
      pagination,
      globalFilter,
      columnFilters: columns
        .filter((col) => col.initialFilterValue)
        .map((col) => ({ id: col.accessor, value: col.initialFilterValue })),
    },
  });

  useEffect(() => {
    const uniqueIds = new Set();
    const sum = table.getFilteredRowModel().rows.reduce((total, row) => {
      if (!uniqueIds.has(row.getValue("plot_id"))) {
        uniqueIds.add(row.getValue("plot_id"));
        return total + parseFloat(row.getValue("total_area_in_acres"));
      }
      return total;
    }, 0);
    setTotalArea(sum.toFixed(2));
    console.log(sum);
  }, [data, table.getFilteredRowModel().rows]);

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

  return (
    <div className='data-table'>
      <div className='w-100 d-flex gap-3 justify-content-between align-items-center my-2'>
        <div className='d-flex gap-3 align-items-center'>
          {table
            .getHeaderGroups()
            .map((headergrp) =>
              headergrp.headers.map(
                (header) =>
                  header.column.getCanFilter() && (
                    <Filter column={header.column} key={header.id} />
                  )
              )
            )}
        </div>
        <div>
          <h6>Total area: {totalArea} acre</h6>
        </div>
      </div>

      <div className='d-flex flex-column flex-md-row justify-content-start justify-content-md-between align-items-start align-items-md-center'>
        <div className='search-box'>
          <input
            className='search-input'
            placeholder='Search...'
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <HiMiniMagnifyingGlass className='search-icon' />
        </div>
        {table.getCoreRowModel().rows.length > 0 && (
          <div className='pagination my-2'>
            <div style={{ width: "100px" }}>
              <select
                className='form-select form-select-sm'
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}>
                {[25, 50, 100, 200].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className='d-none d-md-block'>Page: </div>
            <strong>
              {table.getState().pagination.pageIndex + 1}/{" "}
              {table.getPageCount().toLocaleString()}
            </strong>
            <button
              className='page-button'
              onClick={() => {
                table.firstPage();
              }}
              disabled={!table.getCanPreviousPage()}>
              First
            </button>
            <button
              className='page-button'
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                table.previousPage();
              }}>
              Prev
            </button>
            <button className='btn btn-sm'>
              {table.getState().pagination.pageIndex + 1}
            </button>
            <button
              className='page-button'
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.nextPage();
              }}>
              Next
            </button>
            <button
              className='page-button'
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.lastPage();
              }}>
              Last
            </button>
          </div>
        )}
      </div>

      <Table responsive bordered size='sm' style={{ fontSize: "0.85rem" }}>
        <thead className='table-active'>
          {table.getHeaderGroups().map((headergrp) => (
            <tr key={headergrp.id}>
              {headergrp.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    verticalAlign: "middle",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                  }}
                  className='px-2 cursor-pointer'
                  onClick={header.column.getToggleSortingHandler()}>
                  <span className='d-flex justify-content-between align-items-center'>
                    <span>{header.column.columnDef.header}</span>
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
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ whiteSpace: "nowrap" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {!data.length && (
            <tr>
              <td colSpan={columns.length}>No records found</td>
            </tr>
          )}
        </tbody>
      </Table>
      {table.getCoreRowModel().rows.length > 0 && (
        <div className='pagination my-2'>
          <div style={{ width: "100px" }}>
            <select
              className='form-select select-sm'
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}>
              {[25, 50, 100, 200].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className='d-none d-md-block'>Page: </div>
          <strong>
            {table.getState().pagination.pageIndex + 1}/{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
          <button
            className='page-button'
            onClick={() => {
              table.firstPage();
            }}
            disabled={!table.getCanPreviousPage()}>
            First
          </button>
          <button
            className='page-button'
            disabled={!table.getCanPreviousPage()}
            onClick={() => {
              table.previousPage();
            }}>
            Prev
          </button>
          <button className='btn btn-sm'>
            {table.getState().pagination.pageIndex + 1}
          </button>
          <button
            className='page-button'
            disabled={!table.getCanNextPage()}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              table.nextPage();
            }}>
            Next
          </button>
          <button
            className='page-button'
            disabled={!table.getCanNextPage()}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              table.lastPage();
            }}>
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

const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = useMemo(
    () =>
      Array.from(column.getFacetedUniqueValues().keys()).sort().slice(0, 5000),
    [column.getFacetedUniqueValues()]
  );
  return (
    <div>
      <label className='fw-bold mb-1 ms-1 fs-6'>
        {column?.columnDef?.header}:
      </label>
      <select
        className='form-select form-select-sm'
        onChange={(e) => column.setFilterValue(e.target.value)}
        value={columnFilterValue?.toString()}>
        <option value=''>All</option>
        {sortedUniqueValues.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
};
