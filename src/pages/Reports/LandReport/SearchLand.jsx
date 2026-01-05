import React, { useState } from "react";
import { blocks, districts } from "../../../utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/apiClient";
import LandMap from "../../../Components/MapVewer/LandMap";
import "./landreport.css";

const SearchLand = () => {
  const [district, setDistrict] = useState("");
  const [blockList, setBlockList] = useState([]);
  const [block, setBlock] = useState("");
  const [mouza, setMouza] = useState("");
  const [khatian, setkhatian] = useState("");
  const [plot, setplot] = useState("");
  const [landRecords, setLandRecords] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [searchOption, setSearchOption] = useState("khatian");

  const selectDist = (e) => {
    const distCode = e.target.value;
    const blocksByDist = blocks.filter((bl) => bl.distId == distCode);
    setBlockList(blocksByDist);
    setDistrict(distCode);
    setBlock("");
    setMouza("");
  };

  const selectBlock = (e) => {
    setBlock(e.target.value);
    refetch();
  };

  const selectMouza = (e) => {
    setMouza(e.target.value);
  };

  const getlandInfo = async ({ kh, mo }) => {
    if (searchOption === "plot") {
      return apiClient.post("/land/land-by-plot", {
        plot_no: kh,
        mouza_name: mo,
      });
    }
    return apiClient.post("/land/land-by-khatian", {
      khatian_no: kh,
      mouza_name: mo,
    });
  };

  const {
    data: mouzalist,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["mouza_list"],
    queryFn: async () => {
      const res = await apiClient.get("/land/get-mouza");
      return res.data.data;
    },
    enabled: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: getlandInfo,
    onSuccess: (res) => {
      setLandRecords(res.data.data || []);
      setSelectedLand(null);
    },
  });

  const viewLandInfo = () => {
    if (!mouza) return;
    if (searchOption === "khatian" && khatian) {
      mutate({ kh: khatian, mo: mouza });
    }
    if (searchOption === "plot" && plot) {
      mutate({ kh: plot, mo: mouza });
    }
  };

  return (
    <div className="search-land-page">
      <div className="page-title">
        <h5>Search Land Records</h5>
      </div>

      <div className="form-section">
        <div className="card border-primary">
          <div className="card-header bg-primary text-white fw-bold">
            KHATIAN & PLOT INFORMATION
          </div>

          <div className="card-body">
            <div className="row">
              {/* LEFT */}
              <div className="col-md-6 border-end row">
                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-bold">District *</label>
                  <select
                    className="form-select"
                    style={{ maxWidth: "100%" }}
                    onChange={selectDist}
                  >
                    <option value="">---Selection---</option>
                    {districts.map((dist) => (
                      <option key={dist.id} value={dist.code}>
                        {dist.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Block *</label>
                  <select
                    className="form-select"
                    style={{ maxWidth: "100%" }}
                    disabled={!district}
                    onChange={selectBlock}
                  >
                    <option value="">---Selection---</option>
                    {blockList.map((bl) => (
                      <option key={bl.id} value={bl.code}>
                        {bl.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6 mb-3 mb-md-0">
                  <label className="form-label fw-bold">Mouza *</label>
                  <select
                    className="form-select"
                    style={{ maxWidth: "100%" }}
                    disabled={!block}
                    onChange={selectMouza}
                  >
                    <option value="">---Selection---</option>
                    {isFetching && <option>Loading...</option>}
                    {mouzalist?.map((m) => (
                      <option key={m.objectid} value={m.mouza_name}>
                        {m.mouza_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* RIGHT */}
              <div className="col-md-6 ps-4">
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="khatian"
                      checked={searchOption === "khatian"}
                      onChange={(e) => setSearchOption(e.target.value)}
                    />
                    <label className="form-check-label">
                      Search By Khatian
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="plot"
                      checked={searchOption === "plot"}
                      onChange={(e) => setSearchOption(e.target.value)}
                    />
                    <label className="form-check-label">Search By Plot</label>
                  </div>
                </div>

                {searchOption === "khatian" && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Khatian No *</label>
                    <input
                      type="text"
                      className="form-control"
                      disabled={!mouza}
                      onChange={(e) => setkhatian(e.target.value)}
                    />
                  </div>
                )}

                {searchOption === "plot" && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Plot No *</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      disabled={!mouza}
                      onChange={(e) => setplot(e.target.value)}
                    />
                  </div>
                )}

                <div className="text-center mt-4">
                  <button
                    className="btn btn-info text-white px-4"
                    onClick={viewLandInfo}
                  >
                    VIEW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="result-section mt-2">
        <div className="row h-100 g-2">
          <div className="col-12 col-md-6 h-100 order-2 order-md-1">
            <div className="table-wrapper pb-5">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Sl</th>
                    <th>Plot</th>
                    <th>Khatian</th>
                    <th>Owner</th>
                    <th>Area</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {landRecords.map((land, i) => (
                    <tr key={land.plot_id}>
                      <td>{i + 1}</td>
                      <td>{land.plotno}</td>
                      <td>{land.lr_khatian_no}</td>
                      <td>{land.owner_name_or_raiayat}</td>
                      <td>{land.area_owned_in_acres}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedLand(land)}
                        >
                          View Map
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isPending && <p className="text-center">Loading...</p>}
            </div>
          </div>

          <div className="col-12 col-md-6 h-100 order-1 order-md-2">
            <div className="map-wrapper">
              {selectedLand ? (
                <LandMap land={selectedLand} />
              ) : (
                <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                  Select a record to view map
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchLand;
