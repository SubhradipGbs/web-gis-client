import { useQuery } from "@tanstack/react-query";
import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Pagination, Table } from "react-bootstrap";
import "./landreport.css";
// import DataTable from "../../../Components/DataTable/DataTable";
import axios from "axios";
const DataTable = lazy(() => import("../../../Components/DataTable/DataTable"));

const LandReport = () => {
  const columns = useMemo(
    () => [
      {
        id: "sl_no",
        header: "Sl No.",
        accessorKey: "sl_no",
        accessorFn: (row, index) => index + 1,
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: false,
        enableColumnFilter:false,
      },
      {
        id: "plot_id",
        header: "Plot Id",
        accessorKey: "plot_id",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
        enableColumnFilter:false,
      },
      {
        id: "mouza",
        header: "Mouza",
        accessorKey: "mouza_name",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
      },
      {
        id: "category",
        header: "Category",
        accessorKey: "category",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
      },
      {
        id: "lr_plot_no",
        header: "Lr Plot No.",
        accessorKey: "lr_plot_no",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
        enableColumnFilter:false,
      },
      {
        id: "rs_plot_no",
        header: "Rs Plot No.",
        accessorKey: "rs_plot_no",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
        enableColumnFilter:false,
      },
      {
        id: "total_area_in_acres",
        header: "Total area (acres)",
        accessorKey: "total_area_in_acres",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
        enableColumnFilter:false,
      },
      {
        id: "classification",
        header: "Classification",
        accessorKey: "classification",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
        enableColumnFilter:true,
      },
      {
        id: "present_use",
        header: "Present Use",
        accessorKey: "present_use",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
        enableColumnFilter:false,
      },
      {
        id: "owner_name_or_raiayat",
        header: "Owner Name/Raiayat",
        accessorKey: "owner_name_or_raiayat",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
        enableColumnFilter:false,
      },
      {
        id: "lr_khatian_no",
        header: "Lr Khatian No.",
        accessorKey: "lr_khatian_no",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
        enableColumnFilter:false,
      },
      {
        id: "owner_address_or_raiayat",
        header: "Owner Address/Raiayat",
        accessorKey: "owner_address_or_raiayat",
        sortable: true,
        cell: (info) => info.getValue(),
        enableGlobalFilter: true,
        enableColumnFilter:false,
      },
    ],
    []
  );
  const { data: lands, isLoading } = useQuery({
    queryKey: ["landRecords"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/land-all");
      return response.data;
    },
    // staleTime: 2 * 60 * 1000,
    select: (data) => data.data,
  });

  let active = 1;
  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <h5>Land Records</h5>
      <div style={{ width: "100%" }}>
        <Suspense fallback={<h5>Loading Table...</h5>}>
          <DataTable data={lands} columns={columns} />
        </Suspense>
      </div>
    </div>
  );
};

export default LandReport;
