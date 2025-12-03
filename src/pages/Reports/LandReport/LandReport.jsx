import { useQuery } from "@tanstack/react-query";
import React, { lazy, Suspense, useMemo, useRef, useState } from "react";
import "./landreport.css";
import {
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaInfoCircle,
} from "react-icons/fa";
import { ListGroup, Modal, Overlay, Popover } from "react-bootstrap";
import apiClient from "../../../utils/apiClient";
const DataTable = lazy(() => import("../../../Components/DataTable/DataTable"));

const OverlayComp = ({ info }) => {
  const ref = useRef(null);
  const { row, getValue } = info;
  return (
    <>
      <span ref={ref}>{getValue()}</span>
      <Overlay show={row.getIsExpanded()} target={ref} placement="bottom">
        <Popover>
          <Popover.Body>
            <ListGroup>
              {row.original?.owner.map((item) => (
                <ListGroup.Item>{item.owner_name_or_raiayat}</ListGroup.Item>
              ))}
            </ListGroup>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
};

const LandReport = () => {
  const [openModal, setOpenModal] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState([]);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const targetRef = useRef(null);
  const [info, setInfo] = useState(null);

  const showInfo = (row) => {
    // setOwnerInfo(row.original.owner);
    // console.log(row.original);
    setInfo(row.original);
    setOpenModal((prev) => !prev);
  };

  const columns = [
    {
      id: "info",
      header: "Info",
      accessorKey: "sl_no",
      accessorFn: (row, index) => index + 1,
      sortable: true,
      cell: ({ row, getValue }) => (
        <span className="d-flex justify-content-center align-items-center">
          <button
            className="me-1 table-btn"
            onClick={() => {
              showInfo(row);
            }}
          >
            <FaInfoCircle color="#001F3D" opacity={0.8} />
          </button>
        </span>
      ),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      enableSorting: false,
      footer: () => null,
    },
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
      // cell: (info) => <OverlayComp info={info} />,
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
    {
      id: "expander",
      header: () => null,
      cell: ({ row, getValue }) => (
        <span className="d-flex justify-content-center align-items-center">
          {row.getCanExpand() && row.original?.owner.length > 1 ? (
            <button
              className="me-1 table-btn"
              onClick={row.getToggleExpandedHandler()}
            >
              {row.getIsExpanded() ? (
                <FaChevronCircleUp color="#001F3D" opacity={0.8} />
              ) : (
                <FaChevronCircleDown color="#001F3D" opacity={0.8} />
              )}
            </button>
          ) : null}
        </span>
      ),
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

  const {
    data: lands,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["landRecords"],
    queryFn: async () => {
      const response = await apiClient.get("/land/land-all");
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
    select: (data) => data.data,
  });

  const closeModal = () => {
    setOpenModal(false);
    setOwnerInfo([]);
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
    return (
      <div className="w-100 vh-100 d-flex justify-content-center align-items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <h5>Land Records</h5>
      <div>
        {/* <Modal show={openModal} onHide={() => setOpenModal(false)} centered>
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
        </Modal> */}
        {/* <Overlay target={targetRef.current} show={openModal} placement='bottom'>
          <Popover>
            <Popover.Body>
              <h1>Hello World</h1>
            </Popover.Body>
          </Popover>
        </Overlay> */}
      </div>
      <div>
        <Modal show={openModal} onHide={closeModal} centered>
          <Modal.Header
            closeButton
            className="text-light"
            style={{ backgroundColor: "#001F3D" }}
          >
            <div className="d-flex align-items-center gap-3">
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
                        if (
                          value === null ||
                          value === undefined ||
                          value === ""
                        )
                          return null;
                        return (
                          <tr key={key}>
                            <td className="text-start fw-semibold">
                              {infoObj[key]}
                            </td>
                            <td className="text-start">{value}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <div style={{ width: "100%" }}>
        <Suspense
          fallback={
            <div className="vh-100 w-100 d-flex justify-content-center align-items-center">
              <div className="loader"></div>
            </div>
          }
        >
          {isError ? (
            <div className="vh-100 w-100 d-flex justify-content-center align-items-center">
              <h4 className="text-danger">
                Error fetching data. Please try again later.
              </h4>
            </div>
          ) : (
            lands && (
              <DataTable
                data={lands}
                columns={columns}
                plotId="plot_id"
                areaId="total_area_in_acres"
                sumRequired
                // columnPinning={pinnedColumn}
              />
            )
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default LandReport;

const infoObj = {
  plot_id: "PLOT ID",
  mouza_name: "Mouza Name",
  category: "Category",
  lr_plot_no: "LR Plot No",
  rs_plot_no: "RS Plot No",
  total_area_in_acres: "Total Area in Acres",
  classification: "Classification",
  present_use: "Present Use",
  owner_name_or_raiayat: "Owner Name or Raiayat",
  lr_khatian_no: "LR Khatian No",
  owner_address_or_raiayat: "Owner Address or Raiayat",
  owner_share_in_plot: "Owner Share in Plot",
  area_owned_in_acres: "Area Owned in Acres",
  distance_from_nh_meters: "Distance from NH in Meters",
  distance_from_metalled_road_meters: "Distance from Metalled Road in Meters",
  patta: "Patta",
  bargadar_name: "Bargadar Name",
  barga_share_area_in_acres: "Barga Share Area in Acres",
  plotno: "Plot No",
};
