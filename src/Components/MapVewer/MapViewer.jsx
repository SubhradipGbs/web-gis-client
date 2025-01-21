import React, { useEffect, useRef, useState } from "react";
import { Map } from "ol";
import "ol/ol.css";
import { View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM, TileWMS, TileImage } from "ol/source";
import {
  ScaleLine,
  Zoom,
  ZoomSlider,
  OverviewMap,
  Control,
  MousePosition,
} from "ol/control";
import LayerSwitcher from "ol-layerswitcher";
import { defaults as defaultControls } from "ol/control";
import { fromLonLat } from "ol/proj";
import "ol-layerswitcher/dist/ol-layerswitcher.css";
import { Group } from "ol/layer";
import Modal from "react-modal";
import { createStringXY } from "ol/coordinate";

class FeatureInfoControl extends Control {
  constructor(options) {
    const button = document.createElement("button");
    button.innerHTML = `
     <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4c6ef5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0d6efd;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="12" cy="12" r="10" stroke="url(#grad1)" stroke-width="2" fill="none" />
  <line x1="12" y1="16" x2="12" y2="12" stroke="url(#grad1)" stroke-width="2"/>
  <line x1="12" y1="8" x2="12.01" y2="8" stroke="url(#grad1)" stroke-width="2"/>
  <circle cx="12" cy="12" r="2" fill="white" />
</svg>
    `;
    button.className = "feature-info-button";

    const element = document.createElement("div");
    element.className = "feature-info-control ol-unselectable ol-control";
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener("click", () => {
      options.onClick();
    });
  }
}

const MapView = () => {
  const mapElement = useRef(null);
  const urlGeoServer = "http://localhost:8080/geoserver/WBPDCL/wms";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuresData, setFeaturesData] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [isFeatureInfoActive, setIsFeatureInfoActive] = useState(false);
  const mapRef = useRef(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
            .map-header {
                background-color: #1e40af;
                color: white;
                padding: 1rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                position: relative;
                z-index: 1000;
            }

            .header-title {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }

            .feature-info-control {
                top: 95px;
                left: .5em;
                background: none;
            }

            .ol-zoom {
                top: 150px !important;
            }

            .ol-zoomslider {
                top: 220px !important;
            }

            .ol-mouse-position {
                top: auto;
                bottom: 8px;
                left: 8px;
                right: auto;
                background: rgba(255,255,255,0.8);
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                font-family: monospace;
            }

            .ol-layerswitcher {
                top: 0.5em !important;
                left: 0.5em !important;
                right: auto !important;
                background-color: white !important;
                border-radius: 8px !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            }

            .ol-layerswitcher button {
                background-color: white !important;
                border: 1px solid #e2e8f0 !important;
                border-radius: 8px !important;
                width: 40px !important;
                height: 40px !important;
            }

            .ol-layerswitcher-buttons {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .ol-layerswitcher.ol-control.ol-collapsed {
                background: none !important;
            }

            .ol-layerswitcher.ol-control.ol-collapsed button {
                background-color: white !important;
            }

            .ol-layerswitcher > button {
                float: none !important;
                margin: 0 !important;
            }

            .ol-layerswitcher.ol-collapsed > button {
                margin: 0 !important;
            }

            .feature-info-button {
                background-color: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                cursor: pointer;
                padding: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                transition: all 0.2s ease;
            }

            .feature-info-button:hover {
                background-color: #f8fafc;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }

            .feature-info-button.active {
                background-color: #3b82f6;
                color: white;
                border-color: #2563eb;
            }

            .feature-records-nav {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
                padding: 8px;
                background-color: #f8fafc;
                border-radius: 6px;
            }

            .feature-records-count {
                color: #4b5563;
                font-size: 14px;
            }

            .records-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }

            .records-table th,
            .records-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #e5e7eb;
            }

            .records-table th {
                background-color: #f1f5f9;
                font-weight: 600;
                color: #1f2937;
            }

            .records-table tr:hover {
                background-color: #f9fafb;
            }

            .pagination-button {
                padding: 8px 16px;
                background-color: #3b82f6;
                color: white;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.2s;
            }

            .pagination-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .pagination-button:hover:not(:disabled) {
                background-color: #2563eb;
            }

            .modal-header {
                background-color: #1D4ED8;
                color: white;
                padding: 16px;
                border-radius: 6px 6px 0 0;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .modal-header-icon {
                font-size: 1.5rem;
                color: white;
            }

            .modal-title {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: white;
                letter-spacing: -0.025em;
            }

            .modal-subtitle {
                margin: 4px 0 0 0;
                font-size: 0.875rem;
                color: #d1d5db;
            }

            button.close-button {
                margin-top: 20px;
                padding: 10px 20px;
                background-color: #3b82f6;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.2s;
            }

            button.close-button:hover {
                background-color: #2563eb;
            }
        `;
    document.head.appendChild(style);

    const osmLayer = new TileLayer({
      source: new OSM(),
      title: "OSM Base Layer",
      visible: true,
    });

    const googleLayerSatellite = new TileLayer({
      title: "Google Satellite",
      source: new TileImage({
        url: "http://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga",
      }),
      visible: false,
      opacity: 0.6,
    });

    const googleLayerRoadNames = new TileLayer({
      title: "Google Road Names",
      source: new TileImage({
        url: "http://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}",
      }),
      visible: false,
      opacity: 0.6,
    });

    const googleLayerRoadmap = new TileLayer({
      title: "Google Road Map",
      source: new TileImage({
        url: "http://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      }),
      visible: false,
      opacity: 0.6,
    });

    const googleLayerHybrid = new TileLayer({
      title: "Google Satellite & Roads",
      source: new TileImage({
        url: "http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
      }),
      visible: false,
      opacity: 0.6,
    });

    const googleLayerTerrain = new TileLayer({
      title: "Google Terrain",
      source: new TileImage({
        url: "http://mt0.google.com/vt/lyrs=t&x={x}&y={y}&z={z}",
      }),
      visible: false,
      opacity: 0.6,
    });

    const googleLayerHybrid2 = new TileLayer({
      title: "Google Terrain & Roads",
      source: new TileImage({
        url: "http://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
      }),
      visible: false,
      opacity: 0.6,
    });

    const basemapGroup = new Group({
      title: "Basemap",
      layers: [
        googleLayerHybrid,
        googleLayerTerrain,
        googleLayerRoadmap,
        googleLayerRoadNames,
        googleLayerSatellite,
        googleLayerHybrid2,
        osmLayer,
      ],
    });

    const wmsLayer = new TileLayer({
      title: "Land Records (WMS)",
      name: "WBPDCL:vw_land_records",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_land_records",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      crossOrigin: "anonymous",
      opacity: 1,
      visible: true,
    });

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(6),
      projection: "EPSG:4326",
      className: "ol-mouse-position",
      undefinedHTML: "&nbsp;",
    });

    const map = new Map({
      target: mapElement.current,
      layers: [basemapGroup, wmsLayer],
      view: new View({
        center: fromLonLat([87.602577, 24.057537]),
        zoom: 12,
      }),
      controls: defaultControls().extend([
        new ScaleLine({ bar: true, text: true, minWidth: 125 }),
        new Zoom(),
        new ZoomSlider(),
        new OverviewMap(),
        new LayerSwitcher({
          startActive: true,
          groupSelectStyle: "group",
          reverse: true,
          activationMode: "click",
          collapseTipLabel: "Hide layers",
          tipLabel: "Show layers",
        }),
        new FeatureInfoControl({
          onClick: () => {
            setIsFeatureInfoActive((prev) => !prev);
          },
        }),
        mousePositionControl,
      ]),
    });

    mapRef.current = map;

    const handleMapClick = (event) => {
      if (!isFeatureInfoActive) return;

      const clickedCoordinate = event.coordinate;
      const resolution = map.getView().getResolution();
      const projection = map.getView().getProjection();
      const wmsSource = wmsLayer.getSource();

      const url = wmsSource.getFeatureInfoUrl(
        clickedCoordinate,
        resolution,
        projection,
        {
          INFO_FORMAT: "application/json",
          FEATURE_COUNT: 10,
        }
      );

      if (url) {
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data && data.features && data.features.length > 0) {
              setCoordinates(clickedCoordinate);
              setFeaturesData(data.features.map((f) => f.properties));
              setSelectedFeatureIndex(0);
              setIsModalOpen(true);
            }
          })
          .catch((error) => console.error("Error fetching WMS info:", error));
      }
    };

    map.on("click", handleMapClick);

    return () => {
      map.setTarget(null);
      document.head.removeChild(style);
    };
  }, [isFeatureInfoActive]);

  useEffect(() => {
    const button = document.querySelector(".feature-info-button");
    if (button) {
      if (isFeatureInfoActive) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    }
  }, [isFeatureInfoActive]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFeaturesData([]);
    setSelectedFeatureIndex(0);
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="w-100 h-100">
      <div
        ref={mapElement}
        className="h-100 w-100"
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Plot Information"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "8px",
            padding: "24px",
            border: "none",
            boxShadow:
              "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
            maxWidth: "900px",
            width: "90%",
          },
        }}
      >
        <div className="modal-header">
          <div className="modal-header-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div>
            <h2 className="modal-title">Plot Information</h2>
            <p className="modal-subtitle">
              View and navigate through the plot records
            </p>
          </div>
        </div>

        {featuresData.length > 0 ? (
          <>
            <div className="feature-records-nav">
              <span className="feature-records-count">
                Record {selectedFeatureIndex + 1} of {featuresData.length}
              </span>
              <button
                className="pagination-button"
                onClick={() =>
                  setSelectedFeatureIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={selectedFeatureIndex === 0}
              >
                Previous
              </button>
              <button
                className="pagination-button"
                onClick={() =>
                  setSelectedFeatureIndex((prev) =>
                    Math.min(featuresData.length - 1, prev + 1)
                  )
                }
                disabled={selectedFeatureIndex === featuresData.length - 1}
              >
                Next
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="records-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(featuresData[selectedFeatureIndex]).map(
                    ([key, value]) => (
                      <tr key={key}>
                        <td style={{ fontWeight: "500" }}>
                          {formatFieldName(key)}
                        </td>
                        <td>{value}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>No data available for this location.</p>
        )}

        <button className="close-button" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default MapView;
