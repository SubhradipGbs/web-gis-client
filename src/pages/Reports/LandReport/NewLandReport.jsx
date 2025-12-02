import { useQuery } from "@tanstack/react-query";
import React, { lazy, Suspense, useMemo, useState } from "react";
import "./landreport.css";
import axios from "axios";
import { FaInfoCircle } from "react-icons/fa";
import { Modal } from "react-bootstrap";
const DataTable = lazy(() => import("../../../Components/DataTable/DataTable"));

const NewLandReport = () => {
  const [openModal, setOpenModal] = useState(false);
  const [ownerInfo, setInfo] = useState([]);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);

  const showInfo = (row) => {
    setInfo(row.original.owner);
    setOpenModal((prev) => !prev);
  };

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
    // {
    //   id: "rs_plot_no",
    //   header: "RS Plot No.",
    //   accessorKey: "rs_plot_no",
    //   sortable: true,
    //   cell: (info) => info.getValue(),
    //   enableGlobalFilter: true,
    //   enableColumnFilter: true,
    //   footer: () => null,
    // },
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
      accessorKey: "owner_names",
      sortable: true,
      cell: (info) => info.getValue(),
      meta: {
        filterVariant: "select",
      },
      enableGlobalFilter: true,
      enableColumnFilter: true,
      footer: () => null,
    },
    // {
    //   id: "info",
    //   header: () => null,
    //   cell: ({ row, getValue }) => (
    //     <span className='d-flex justify-content-center align-items-center'>
    //       {row.original?.owner.length > 1 ? (
    //         <button
    //           className='me-1 table-btn'
    //           onClick={() => {
    //             showInfo(row);
    //           }}>
    //           <FaInfoCircle color='#001F3D' opacity={0.8} />
    //         </button>
    //       ) : null}
    //     </span>
    //   ),
    // },
    // {
    //   id: "expander",
    //   header: () => null,
    //   cell: ({ row, getValue }) => (
    //     <span className='d-flex justify-content-center align-items-center'>
    //       {row.getCanExpand() && row.original?.owner.length > 1 ? (
    //         <button
    //           className='me-1 table-btn'
    //           onClick={row.getToggleExpandedHandler()}>
    //           {row.getIsExpanded() ? (
    //             <FaChevronCircleUp color='#001F3D' opacity={0.8} />
    //           ) : (
    //             <FaChevronCircleDown color='#001F3D' opacity={0.8} />
    //           )}
    //         </button>
    //       ) : null}
    //     </span>
    //   ),
    // },
    //
    // {
    //   id: "area_owned_in_acres",
    //   header: "Area Owned (acre)",
    //   accessorKey: "area_owned_in_acres",
    //   sortable: true,
    //   cell: (info) => info.getValue(),
    //   enableGlobalFilter: true,
    //   enableColumnFilter: true,
    //   footer: (info) => {
    //     const total = info.table
    //       .getFilteredRowModel()
    //       .rows.reduce(
    //         (sum, row) =>
    //           sum + (parseFloat(row.original.area_owned_in_acres) || 0),
    //         0
    //       );
    //     return total.toFixed(4);
    //   },
    // },
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
    queryKey: ["newlandRecords"],
    queryFn: async () => {
      const response = await axios.get(
        "/api/land/land-new"
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    select: (data) => data.data,
  });

  const closeModal = () => {
    setOpenModal(false);
    setInfo([]);
    setSelectedFeatureIndex(0);
  };

  const pinnedColumn = {
    left: ["plot_id"],
    right: [],
  };

  const ownerHeading = {
    plot_id: "Plot Id",
    owner_name_or_raiayat: "Owner Name/Raiayat",
    lr_khatian_no: "LR Khatian No.",
    owner_address_or_raiayat: "Owner Address/Raiayat",
    owner_share_in_plot: "Owner Share in Plot",
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        width: "100%",
      }}>
      <h5>Land Records</h5>
      <div>
        <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
          <Modal.Header
            className='text-light'
            style={{ backgroundColor: "#001F3D" }}>
            <div className='d-flex align-items-center gap-3'>
              <FaInfoCircle size={30} />
              <h3>Owner Information</h3>
            </div>
          </Modal.Header>
          <Modal.Body>
            {ownerInfo.length > 0 ? (
              <>
                <div
                  className='feature-records-nav'
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}>
                  <span
                    className='feature-records-count'
                    style={{ fontSize: "0.9rem", color: "#555" }}>
                    Record {selectedFeatureIndex + 1} of {ownerInfo.length}
                  </span>
                  <div>
                    <button
                      className='page-btn'
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFeatureIndex((prev) =>
                          Math.max(0, prev - 1)
                        );
                      }}
                      disabled={selectedFeatureIndex === 0}
                      style={{
                        marginRight: "8px",
                      }}>
                      Previous
                    </button>
                    <button
                      className='page-btn'
                      onClick={() =>
                        setSelectedFeatureIndex((prev) =>
                          Math.min(ownerInfo.length - 1, prev + 1)
                        )
                      }
                      disabled={selectedFeatureIndex === ownerInfo.length - 1}>
                      Next
                    </button>
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table
                    className='records-table'
                    style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "10px",
                            color: "#007bff",
                            fontSize: "1rem",
                            fontWeight: "600",
                          }}>
                          Field
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "10px",
                            color: "#007bff",
                            fontSize: "1rem",
                            fontWeight: "600",
                          }}>
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(ownerInfo[selectedFeatureIndex]).map(
                        ([key, value]) => (
                          <tr
                            key={key}
                            style={{ borderBottom: "1px solid #eee" }}>
                            <td
                              style={{
                                fontWeight: "500",
                                padding: "8px 10px",
                                color: "#333",
                                textAlign: "left",
                              }}>
                              {ownerHeading[key]}
                            </td>
                            <td
                              style={{
                                textAlign: "left",
                                padding: "8px 10px",
                                color: "#333",
                              }}>
                              {value}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p style={{ color: "#777", textAlign: "center" }}>
                No data available for this location.
              </p>
            )}
            <button
              className='close-button'
              onClick={closeModal}
              style={{
                backgroundColor: "#ff4d4d",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontSize: "1rem",
                cursor: "pointer",
                marginTop: "20px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}>
              Close
            </button>
          </Modal.Body>
        </Modal>
      </div>
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
            columnPinning={pinnedColumn}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default NewLandReport;
