import { useQuery } from "@tanstack/react-query";
import React, { lazy, Suspense, useMemo, useState } from "react";
import "./landreport.css";
// import DataTable from "../../../Components/DataTable/DataTable";
import axios from "axios";
const DataTable = lazy(() => import("../../../Components/DataTable/DataTable"));

const LandReport = () => {
  const columns = [
    {
      id: "sl_no",
      header: "Sl No.",
      accessorKey: "sl_no",
      accessorFn: (row, index) => index + 1,
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      footer: () => null,
    },
    {
      id: "plot_id",
      header: "Plot Id",
      accessorKey: "plot_id",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      footer: () => null,
    },
    {
      id: "mouza",
      header: "Mouza",
      accessorKey: "mouza_name",
      sortable: true,
      cell: (info) => info.getValue(),
      meta: {
        filterVariant: "select",
      },
      enableGlobalFilter: true,
      footer: () => null,
    },
    {
      id: "category",
      header: "Category",
      accessorKey: "category",
      sortable: true,
      accessorFn: (row) =>
        row.category == "RECORD NOT FOUND" ? "" : row.category,
      cell: (info) => info.getValue(),
      meta: {
        filterVariant: "select",
      },
      enableGlobalFilter: true,
      footer: () => null,
    },
    {
      id: "lr_plot_no",
      header: "LR Plot No.",
      accessorKey: "lr_plot_no",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "rs_plot_no",
      header: "RS Plot No.",
      accessorKey: "rs_plot_no",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "total_area_in_acres",
      header: "Total Area (acre)",
      accessorKey: "total_area_in_acres",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: (info) => {
        const total = info.table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) =>
              sum + (parseFloat(row.original.total_area_in_acres) || 0),
            0
          );
        return total.toFixed(4);
      },
    },
    {
      id: "classification",
      header: "Classification",
      accessorKey: "classification",
      sortable: true,
      meta: {
        filterVariant: "select",
      },
      accessorFn: (row) => row.classification || "",
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "present_use",
      header: "Present Use",
      accessorKey: "present_use",
      sortable: true,
      cell: (info) => info.getValue(),
      meta: {
        filterVariant: "select",
      },
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "owner_name_or_raiayat",
      header: "Owner Name/Raiayat",
      accessorKey: "owner_name_or_raiayat",
      sortable: true,
      cell: (info) => info.getValue(),
      meta: {
        filterVariant: "select",
      },
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "lr_khatian_no",
      header: "LR Khatian No.",
      accessorKey: "lr_khatian_no",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      footer: () => null,
    },
    {
      id: "owner_address_or_raiayat",
      header: "Owner Address/Raiayat",
      accessorKey: "owner_address_or_raiayat",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      footer: () => null,
    },
    {
      id: "owner_share_in_plot",
      header: "Owner Share in Plot",
      accessorKey: "owner_share_in_plot",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      footer: () => null,
    },
    {
      id: "area_owned_in_acres",
      header: "Area Owned (acre)",
      accessorKey: "area_owned_in_acres",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: (info) => {
        const total = info.table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) =>
              sum + (parseFloat(row.original.area_owned_in_acres) || 0),
            0
          );
        return total.toFixed(4);
      },
    },
    {
      id: "distance_from_nh_meters",
      header: "Distance from NH(m)",
      accessorKey: "distance_from_nh_meters",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      footer: () => null,
    },
    {
      id: "distance_from_metalled_road_meters",
      header: "Distance from Metalled Read(m)",
      accessorKey: "distance_from_metalled_road_meters",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: false,
      footer: () => null,
    },
  ];

  const { data: lands, isLoading } = useQuery({
    queryKey: ["landRecords"],
    queryFn: async () => {
      const response = await axios.get(
        "http://192.168.0.112:3000/land/land-all"
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    select: (data) => data.data,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        width: "100%",
      }}>
      <h5>Land Records</h5>
      <div style={{ width: "100%" }}>
        <Suspense
          fallback={
            <div className='vh-100 w-100 d-flex justify-content-center align-items-center'>
              <div className='loader'></div>
            </div>
          }>
          <DataTable
            data={lands}
            columns={columns}
            plotId='plot_id'
            areaId='total_area_in_acres'
            sumRequired
          />
        </Suspense>
      </div>
    </div>
  );
};

export default LandReport;
