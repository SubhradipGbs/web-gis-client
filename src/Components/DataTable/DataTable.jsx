import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { Table } from "react-bootstrap";

const DataTable = ({ data, columns }) => {
  const memoizedData = React.useMemo(() => data, [data]);
  const memoizedColumns = React.useMemo(() => columns, [columns]);
  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  console.log(table.getHeaderGroups());

  return (
    <div>
      <Table responsive bordered size="sm" style={{ fontSize: "0.75rem" }}>
        <thead className="table-active">
          {table.getHeaderGroups().map((headergrp) => (
            <tr key={headergrp.id}>
              {headergrp.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ verticalAlign: "middle" }}
                  className="px-2"
                >
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
                <td key={cell.id} style={{whiteSpace:'nowrap'}}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
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
