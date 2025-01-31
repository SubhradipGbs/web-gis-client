import { useQuery } from "@tanstack/react-query";
import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import "./landreport.css";
// import DataTable from "../../../Components/DataTable/DataTable";
import axios from "axios";
const DataTable = lazy(() => import("../../../Components/DataTable/DataTable"));

const MasterLand = () => {
  const [landData, setLandData] = useState([]);

  const columns = [
    {
      id: "master_sl_no",
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
      id: "master_plot_id",
      header: "Plot Id",
      accessorKey: "plot_id",
      sortable: true,
      cell: (info) => info.getValue(),
      accessorFn: (row) => row.plot_id.toString(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "master_mouza",
      header: "Mouza",
      accessorKey: "mouza",
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "select",
      },
      footer: () => null,
    },
    {
      id: "master_category",
      header: "Category",
      accessorKey: "category",
      accessorFn: (row) => {
        return row.category || "";
      },
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
      id: "master_lr_plot_no",
      header: "LR Plot No.",
      accessorKey: "lr_plot_no",
      accessorFn: (row) => {
        return row.lr_plot_no.toString() || "";
      },
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "master_rs_plot_no",
      header: "RS Plot No.",
      accessorKey: "rs_plot_no",
      accessorFn: (row) => {
        return row.rs_plot_no.toString() || "";
      },
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "master_total_area_in_acres",
      header: "Total Area (acres)",
      accessorKey: "total_area_acre",
      accessorFn: (row) => {
        return row.total_area_acre || "";
      },
      // meta: {
      //   filterVariant: "range",
      // },
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "master_classification",
      header: "Classification",
      accessorKey: "classification",
      accessorFn: (row) => {
        return row.classification || "";
      },
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
      id: "master_present_use",
      header: "Present Use",
      accessorKey: "present_use",
      accessorFn: (row) => {
        return row.present_use || "";
      },
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
      id: "master_share",
      header: "Share",
      accessorKey: "share",
      accessorFn: (row) => {
        return row.share || "";
      },
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "master_category_area_acre",
      header: "Category Area (acre)",
      accessorKey: "category_area_acre",
      accessorFn: (row) => {
        return parseFloat(row.category_area_acre) || "";
      },
      sortable: true,
      isSummable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: (info) => {
        const total = info.table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) =>
              sum + (parseFloat(row.original.category_area_acre) || 0),
            0
          );
        return total.toFixed(4);
      },
    },
    // {
    //   id: "master_total_area_vested_rayati_forest_acre",
    //   header: "Total Area Vested/Rayati/Forest (acre)",
    //   accessorKey: "total_area_vested_rayati_forest_acre",
    //   accessorFn: (row) => {
    //     return row.total_area_vested_rayati_forest_acre || "";
    //   },
    //   sortable: true,
    //   cell: (info) => info.getValue(),
    //   enableGlobalFilter: true,
    //   enableColumnFilter: true,
    // },
    {
      id: "master_purchased_area_acre",
      header: "Purchased Area (acre)",
      accessorKey: "purchased_area_acre",
      accessorFn: (row) => {
        return parseFloat(row.purchased_area_acre) || "";
      },
      isSummable: true,
      sortable: true,
      cell: (info) => info.getValue(),
      meta: {
        filterVariant: "checkbox",
      },
      enableGlobalFilter: true,
      enableColumnFilter: true,
      filterFn: "arrayIncludes",
      footer: (info) => {
        const total = info.table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) =>
              sum + (parseFloat(row.original.purchased_area_acre) || 0),
            0
          );
        return total.toFixed(4);
      },
    },
    {
      id: "master_purchased_status",
      header: "Purchased Status",
      accessorKey: "purchased_status",
      accessorFn: (row) => {
        return row.purchased_status || "";
      },
      meta: {
        filterVariant: "checkbox",
      },
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      filterFn: "arrayIncludes",
      footer: () => null,
    },
    {
      id: "master_percent_purchased",
      header: "Purchased Percentage",
      accessorKey: "percent_purchased",
      accessorFn: (row) => {
        return row.percent_purchased || "";
      },
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "master_cabinet_approved_but_not_purchased",
      header: "Cabinet Approved but Not Purchased (acre)",
      accessorKey: "cabinet_approved_but_not_purchased",
      accessorFn: (row) => {
        return row.cabinet_approved_but_not_purchased || "";
      },
      isSummable: true,
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: (info) => {
        const total = info.table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) =>
              sum +
              (parseFloat(row.original.cabinet_approved_but_not_purchased) ||
                0),
            0
          );
        return total.toFixed(4);
      },
    },
    {
      id: "master_canp_status",
      header: "Cabinet Approved Status",
      accessorKey: "canp_status",
      accessorFn: (row) => {
        return row.canp_status == "CANP" ? "Checked and verified" : "";
      },
      meta: {
        filterVariant: "select",
      },
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "master_area_used_for",
      header: "Area Used For",
      accessorKey: "area_used_for",
      accessorFn: (row) => {
        return row.area_used_for || "";
      },
      meta: {
        filterVariant: "select",
      },
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "master_distance_from_nh_m",
      header: "Distance From NH(m)",
      accessorKey: "distance_from_nh_m",
      accessorFn: (row) => {
        return row.distance_from_nh_m || "";
      },
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    {
      id: "master_distance_from_metalled_road_m",
      header: "Distance From Metalled Road(m)",
      accessorKey: "distance_from_metalled_road_m",
      accessorFn: (row) => {
        return row.distance_from_metalled_road_m || "";
      },
      sortable: true,
      cell: (info) => info.getValue(),
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
  ];

  const { data: lands, isLoading } = useQuery({
    queryKey: ["master_land_records"],
    queryFn: async () => {
      const response = await axios.get(
        "http://192.168.0.112:3000/land/land-master"
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
      <h5>Master Land Records:</h5>
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          overflowY: "scroll",
        }}>
        <Suspense
          fallback={
            <div className='vh-100 w-100 d-flex justify-content-center align-items-center'>
              <div className='loader'></div>
            </div>
          }>
          <DataTable data={lands} columns={columns} sumRequired={false} />
        </Suspense>
      </div>
    </div>
  );
};

export default MasterLand;
