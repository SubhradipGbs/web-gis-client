import { useQuery } from "@tanstack/react-query";
import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import "./landreport.css";
// import DataTable from "../../../Components/DataTable/DataTable";
import { FaInfoCircle } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import apiClient from "../../../utils/apiClient";
const DataTable = lazy(() => import("../../../Components/DataTable/DataTable"));

const MasterLand = () => {
  const [info, setInfo] = useState([]);
  const [show, setShow] = useState(false);

  const showInfo = (row) => {
    setInfo(row.original);
    console.log(row.original);
    setShow(true);
  }

  const handleClose = () => setShow(false);

  const columns = [
    {
      id: "info",
      header: "Info",
      accessorKey: "sl_no",
      accessorFn: (row, index) => index + 1,
      sortable: true,
      cell: ({ row, getValue }) => (
        <span className='d-flex justify-content-center align-items-center'>
          <button
            className='me-1 table-btn'
            onClick={() => {
              showInfo(row);
            }}>
            <FaInfoCircle color='#001F3D' opacity={0.8} />
          </button>
        </span>
      ),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      enableSorting: false,
      footer: () => null,
    },
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

  const { data: lands, isLoading, isError } = useQuery({
    queryKey: ["master_land_records"],
    queryFn: async () => {
      const response = await apiClient.get(
        "/land/land-master"
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
      <div>
        <Modal show={show} onHide={handleClose} centered size="lg" scrollable>
          <Modal.Header
            closeButton
            className='text-light'
            style={{ backgroundColor: "#001F3D" }}>
            <div className='d-flex align-items-center gap-3'>
              <FaInfoCircle size={30} />
              <h3>Land Information</h3>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div>
              {info && (
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Field</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(info).map(([key, value]) => {
                        console.log(key);
                        if (key === "owner") return null;
                        if (key === "sl_no") return null;
                        if (value === null || value === undefined || value === "") return null;
                        return (
                          <tr key={key}>
                            <td className="text-start fw-semibold">{infoObj[key]}</td>
                            <td className="text-start">{value}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
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
          {
            isError ? (
              <div className='vh-100 w-100 d-flex justify-content-center align-items-center'>
                <h4 className='text-danger'>Error fetching data. Please try again later.</h4>
              </div>
            ) : (
              <DataTable data={lands} columns={columns} sumRequired={false} />
            )
          }
        </Suspense>
      </div>
    </div>
  );
};

export default MasterLand;

const infoObj = {
  area_used_for: "Area Used For",
  cabinet_approved_but_not_purchased: "Cabinet Approved but not Purchased (acre)",
  canp_status: "Cabinet Approved Status",
  category: "Category",
  category_area_acre: "Category Area (acre)",
  classification: "Classification",
  distance_from_metalled_road_m: "Distance from Metalled Road (m)",
  distance_from_nh_m: "Distance from NH (m)",
  lr_plot_no: "LR Plot No.",
  mouza: "Mouza",
  percent_purchased: "Purchased Percentage",
  plot_id: "Plot Id",
  present_use: "Present Use",
  purchased_area_acre: "Purchased Area (acre)",
  purchased_status: "Purchased Status",
  rs_plot_no: "RS Plot No.",
  share: "Share",
  sl_no: "Sl No.",
  total_area_acre: "Total Area (acre)",
  total_area_vested_rayati_forest_acre: "Total Area Vested/Rayati/Forest (acre)",
  patta: "Patta",
  name_of_bargadar: "Name of Bargadar",
  bargad_share_area_acre: "Bargadar Share Area (acre)",
}