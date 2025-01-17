import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { Form, InputGroup, Table } from "react-bootstrap";
import "./datatable.css";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

const DataTable = ({ data, columns }) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 25,
  });
  const [globalFilter, setGlobalFilter] = useState("");

  console.log(data);

  // const memoizedData = React.useMemo(() => data, [data]);
  // const memoizedColumns = React.useMemo(() => columns, [columns]);

  const table = useReactTable({
    data,
    columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      pagination,
      globalFilter,
    },
    initialState: {
      pagination,
      globalFilter,
    },
  });

  return (
    <div className='data-table'>
      <div className='d-flex justify-content-between align-items-center'>
        <div className='search-box'>
          <input
            className='search-input'
            placeholder='Search...'
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <HiMiniMagnifyingGlass className='search-icon' />
        </div>
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
                  style={{ verticalAlign: "middle" }}
                  className='px-2'>
                  {header.column.columnDef.header}
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
