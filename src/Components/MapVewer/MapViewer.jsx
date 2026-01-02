import React, { useEffect, useRef, useState } from "react";
import { Map } from "ol";
import "ol/ol.css";
import "./map.css";
import { View } from "ol";
import { Tile as TileLayer } from "ol/layer";
import { OSM, TileWMS, TileImage } from "ol/source";
import Image from "ol/layer/Image"; // Correct import for OpenLayers v6+
import ImageWMS from "ol/source/ImageWMS";
import {
  ScaleLine,
  Zoom,
  ZoomSlider,
  OverviewMap,
  Control,
  MousePosition,
  FullScreen,
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
     <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
  const urlGeoServer = `${import.meta.env.VITE_GEOSERVER_URL}/wms`;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuresData, setFeaturesData] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [isFeatureInfoActive, setIsFeatureInfoActive] = useState(false);
  const mapRef = useRef(null);
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const [currentFeatureLayer, setCurrentFeatureLayer] = useState("");
  const [droneImgLoading, setDroneImgLoading] = useState(true);

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
                left: auto;
                right: 8px;
                background: rgba(255,255,255,0.8);
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                font-family: monospace;
            }

            .ol-layerswitcher {
                position: absolute;
                top: 1em;
                left: 1em !important;
                background-color: rgba(255, 255, 255, 0.95);
                border-radius: 12px;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
                padding: 15px;
                max-height: calc(100% - 2em);
                overflow-y: auto;
                width: 300px;
                font-family: 'Segoe UI', -apple-system, sans-serif;
                transition: all 0.3s ease;
            }

              /* Custom scrollbar */
              .ol-layerswitcher::-webkit-scrollbar {
                  width: 8px;
              }

              .ol-layerswitcher::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 4px;
              }

              .ol-layerswitcher::-webkit-scrollbar-thumb {
                  background: #94a3b8;
                  border-radius: 4px;
              }

              .ol-layerswitcher::-webkit-scrollbar-thumb:hover {
                  background: #64748b;
              }

              /* Group Styling */
              .ol-layerswitcher .group {
                  margin-bottom: 15px;
                  background: white;
                  border-radius: 8px;
                  overflow: hidden;
              }

              /* Group Labels with Gradients and Icons */
              .ol-layerswitcher .group-label {
                  position: relative;
                  padding: 12px 16px 12px 45px; /* Extra padding for icon */
                  margin: 0;
                  font-weight: 600;
                  font-size: 14px;
                  color: white;
                  cursor: pointer;
                  border: none;
                  width: 100%;
                  text-align: left;
                  background-position: 12px center;
                  background-repeat: no-repeat;
                  background-size: 20px 20px;
              }
              

              /* Specific group backgrounds and icons */
              .ol-layerswitcher .group:nth-child(1) .group-label {
                  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>');
              }

              .ol-layerswitcher .group:nth-child(2) .group-label {
                  background: linear-gradient(135deg, #10b981, #047857);
                  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4z"/></svg>');
              }

              .ol-layerswitcher .group:nth-child(3) .group-label {
                  background: linear-gradient(135deg, #f59e0b, #b45309);
                  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>');
              }

              .ol-layerswitcher .group:nth-child(4) .group-label {
                  background: linear-gradient(135deg, #ec4899, #be185d);
                  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 18h22L14 6zM5 16l1.52-2.03L8.04 16H5z"/></svg>');
              }

              /* Layer Items */
              .ol-layerswitcher .layerDiv {
                  padding: 10px 16px;
                  margin: 5px;
                  background-color: #f8fafc;
                  border-radius: 6px;
                  transition: all 0.2s ease;
                  display: flex;
                  align-items: center;
              }

              .ol-layerswitcher .layerDiv:hover {
                  background-color: #f1f5f9;
                  transform: translateX(5px);
              }

              /* Checkbox styling */
              .ol-layerswitcher .layerDiv input[type="checkbox"] {
                  appearance: none;
                  width: 18px;
                  height: 18px;
                  border: 2px solid #cbd5e1;
                  border-radius: 4px;
                  margin-right: 10px;
                  cursor: pointer;
                  position: relative;
                  top:0.4em;
                  transition: all 0.2s ease;
              }
              .layer-switcher li input{
                top:0.4em;
              } 

              .ol-layerswitcher .layerDiv input[type="checkbox"]:checked {
                  background-color: #3b82f6;
                  border-color: #2563eb;
              }

              .ol-layerswitcher .layerDiv input[type="checkbox"]:checked::after {
                  content: '';
                  position: absolute;
                  left: 5px;
                  top: 2px;
                  width: 5px;
                  height: 9px;
                  border: solid white;
                  border-width: 0 2px 2px 0;
                  transform: rotate(45deg);
              }

              /* Layer labels */
              .ol-layerswitcher .layerDiv label {
                  color: #1e293b;
                  font-size: 13px;
                  cursor: pointer;
                  flex-grow: 1;
                  margin-left: 8px;
              }

              /* Hover effects */
              .ol-layerswitcher .layerDiv:hover label {
                  color: #0f172a;
              }

              /* Panel header */
              .ol-layerswitcher .panel {
                  padding: 0;
                  margin: 0;
                  border: none;
              }

              /* Animation for group expansion/collapse */
              .ol-layerswitcher .group {
                  transition: all 0.3s ease;
              }

              .ol-layerswitcher .group.ol-layer-hidden {
                  max-height: 45px;
                  overflow: hidden;
              }


            .layer-panel {
                width: 250px;
                background-color: #1e40af;
                padding: 1rem;
                box-shadow: 2px 0 5px rgba(0,0,0,0.1);
                overflow-y: auto;
            }

            .layer-title {
                font-weight: bold;
                margin-bottom: 0.5rem;
            }

            .layer-item {
                display: flex;
                align-items: center;
                margin: 0.5rem 0;
            }

            .layer-checkbox {
                margin-right: 0.5rem;
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
                width: 70px;
                height: 70px;
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
                .map:-webkit-full-screen {
                height: 100%;
                margin: 0;
            }
            .map:fullscreen {
                height: 100%;
            }
            .map .ol-rotate {
                top: 3em;
            }
  .ol-scale-combined {
        background: rgba(255, 255, 255, 0.8);
        border-radius: 4px;
        bottom: 8px;
        left: 8px;
        padding: 2px;
        position: absolute;
    }

    .ol-custom-overviewmap {
        left: 8px;
        bottom: 40px !important;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 4px;
        padding: 2px;
    }

    .ol-custom-overviewmap .ol-overviewmap-map {
        border: none;
        width: 150px;
        height: 150px;
    }

    .ol-custom-overviewmap canvas {
        border: 1px solid #ccc;
    }

    .ol-scale-line {
        background: rgba(255, 255, 255, 0.8);
        border-radius: 4px;
        bottom: 8px;
        left: 8px;
        padding: 2px;
        position: absolute;
    }

    .ol-scale-line-inner {
        border: 1px solid #000;
        border-top: none;
        color: #000;
        font-size: 10px;
        text-align: center;
        margin: 1px;
        padding: 0px 2px;
    }
        .ol-control button {
            background-color: white;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            padding: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .ol-control .feature-info-button {
            width: 30px;
            height: 30px;
            padding: 0;
            margin: 0;
        }
`;
    document.head.appendChild(style);

    const osmLayer = new TileLayer({
      source: new OSM(),
      title: "OSM Base Layer",
      visible: false,
    });

    const googleLayerSatellite = new TileLayer({
      title: "Google Satellite",
      source: new TileImage({
        url: "http://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga",
      }),
      visible: true,
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

    // const drone_image = new Image({
    //     title: "DroneImage",
    //     source: new ImageWMS({
    //         url: urlGeoServer,
    //         params: {
    //             LAYERS: "WBPDCL:droneimage",
    //             'FORMAT': 'image/png',
    //         },
    //         projection: 'EPSG:32645',
    //         maxResolution: 0.175,
    //         tileSize: 256
    //     }),
    //     visible: true
    // });

    const drone_image = new Image({
      title: "DroneImage",
      source: new ImageWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:drone_image",
          FORMAT: "image/png",
          TILED: true,
          NO_CACHE: true,
        },
        projection: "EPSG:32645",
        maxResolution: 0.175,
        tileSize: 256,
      }),
      visible: true,
    });

    const droneSource = drone_image.getSource();
    let counter = 0;

    droneSource.on("imageloadstart", () => {
      counter++;
      setDroneImgLoading(true);
    });

    droneSource.on("imageloadend", () => {
      counter--;
      if (counter === 0) setDroneImgLoading(false);
    });

    droneSource.on("imageloaderror", () => {
      counter--;
      if (counter === 0) setDroneImgLoading(false);
    });

    const basemapGroup = new Group({
      title: "Basemap",
      layers: [
        // googleLayerHybrid,
        // googleLayerTerrain,
        googleLayerRoadmap,
        googleLayerRoadNames,
        googleLayerSatellite,
        // googleLayerHybrid2,
        osmLayer,
        drone_image,
      ],
    });

    const balsalt_l = new TileLayer({
      title: "Basalt-326.76 Acres",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:basalt_l",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const balsalt_s = new TileLayer({
      title: "12 Acres 1st Phase Basalt mining area",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:basalt_s",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const vw_basalt_vested = new TileLayer({
      title: "Basalt-Vested Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_basalt_vested",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const vw_basalt_rayati = new TileLayer({
      title: "Basalt-Rayati Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_basalt_rayati",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const vw_basalt_partlypurchased = new TileLayer({
      title: "Basalt-Partly Purchased Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_basalt_partlypurchased",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const vw_basalt_fullpurchased = new TileLayer({
      title: "Basalt-Fully Purchased Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_basalt_fullpurchased",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    // const vw_basalt_ntapprove = new TileLayer({
    //   title: "Basalt-Cabinate Approved but Not Purchased",
    //   source: new TileWMS({
    //     url: urlGeoServer,
    //     params: {
    //       LAYERS: "WBPDCL:vw_basalt_ntapprove",
    //       TILED: true,
    //     },
    //     serverType: "geoserver",
    //   }),
    //   visible: false,
    //   opacity: 0.6,
    // });

    const vw_ba_partlypurchased = new TileLayer({
      title: "Basalt-Partly Purchased Portion",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_ba_partlypurchased",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const vw_borehole_basalt = new TileLayer({
      title: "Borehole's",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_borehole_basalt",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const BasaltGroup = new Group({
      title: "Basalt Boundary",
      layers: [
        // vw_basalt_ntapprove,
        vw_basalt_rayati,
        vw_basalt_vested,
        vw_basalt_partlypurchased,
        vw_ba_partlypurchased,
        vw_basalt_fullpurchased,
        vw_borehole_basalt,
        balsalt_s,
        balsalt_l,
      ],
    });

    const coalLayer = new TileLayer({
      title: "Coal Blocks",
      name: "WBPDCL:vw_land_records",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:COAL_BLOCK_BOUNDARY",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      crossOrigin: "anonymous",
      opacity: 1,
      visible: true,
    });

    const vw_coal_vested = new TileLayer({
      title: "Coal-Vested Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_coal_vested",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const vw_coal_rayati = new TileLayer({
      title: "Coal-Rayati Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_coal_rayati",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const vw_coal_partlypurchased = new TileLayer({
      title: "Coal-Partly Purchased Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_coal_partlypurchased",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const vw_coal_fullpurchased = new TileLayer({
      title: "Coal-Fully Purchased Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_coal_fullpurchased",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    // const vw_coal_ntapprove = new TileLayer({
    //   title: "Coal-Cabinate Approved but Not Purchased",
    //   source: new TileWMS({
    //     url: urlGeoServer,
    //     params: {
    //       LAYERS: "WBPDCL:vw_coal_ntapprove",
    //       TILED: true,
    //     },
    //     serverType: "geoserver",
    //   }),
    //   visible: false,
    //   opacity: 0.6,
    // });

    //vw_cl_partlypurchase

    const vw_cl_partlypurchase = new TileLayer({
      title: "Coal-Partly Purchased Portion",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_cl_partlypurchase",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const vw_borehole_coal = new TileLayer({
      title: "Borehole's",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_borehole_coal",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const CoalGroup = new Group({
      title: "Coal Boundary",
      layers: [
        // vw_coal_ntapprove,
        vw_coal_rayati,
        vw_coal_vested,
        vw_coal_partlypurchased,
        vw_cl_partlypurchase,
        vw_coal_fullpurchased,
        vw_borehole_coal,
        coalLayer,
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

    const mouzaWMS = new TileLayer({
      title: "Mouza Boundary",
      name: "WBPDCL:vw_land_records",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:mouzaboundary",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      crossOrigin: "anonymous",
      opacity: 1,
      visible: true,
    });

    const vestedLand = new TileLayer({
      title: "Vested Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_vested_land",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const rayatiLand = new TileLayer({
      title: "Rayati Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_rayati_land",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const forestLand = new TileLayer({
      title: "Forest Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_forest_land",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const otherLand = new TileLayer({
      title: "Others Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:vw_others_land",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const partlypurchasedLand = new TileLayer({
      title: "Partly Purchased Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:partly_purchased_plots",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const fullypurchasedLand = new TileLayer({
      title: "Fully Purchased Land",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:fully_purchased_plots",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    // const notapprove = new TileLayer({
    //   title: "Cabinate Approved but Not Purchased",
    //   source: new TileWMS({
    //     url: urlGeoServer,
    //     params: {
    //       LAYERS: "WBPDCL:vw_purchase_ntapprove",
    //       TILED: true,
    //     },
    //     serverType: "geoserver",
    //   }),
    //   visible: false,
    //   opacity: 0.6,
    // });

    const vw_borehole = new TileLayer({
      title: "Borehole's",
      source: new TileWMS({
        url: urlGeoServer,
        params: {
          LAYERS: "WBPDCL:borehole_locations",
          TILED: true,
        },
        serverType: "geoserver",
      }),
      visible: false,
      opacity: 0.6,
    });

    const landGroup = new Group({
      title: "Land Categories",
      layers: [
        // notapprove,
        // rayatiLand,
        // vestedLand,
        forestLand,
        otherLand,
        // partlypurchasedLand,
        // fullypurchasedLand,
        // vw_borehole,
      ],
    });

    document.addEventListener("DOMContentLoaded", function () {
      const layerSwitcherButton = document.createElement("button");
      layerSwitcherButton.classList.add("layer-switcher-btn");
      layerSwitcherButton.setAttribute("title", "Toggle OSM Base Layer");
      layerSwitcherButton.innerHTML = '<i class="icon-osm"></i>'; // Example icon, you can use a library like FontAwesome
      layerSwitcherButton.addEventListener("click", function () {
        osmLayer.setVisible(!osmLayer.getVisible());
        layerSwitcherButton.classList.toggle("active", osmLayer.getVisible());
        layerSwitcherButton.classList.toggle(
          "inactive",
          !osmLayer.getVisible()
        );
      });

      const layerSwitcherContainer =
        document.querySelector(".ol-layerswitcher");

      if (layerSwitcherContainer) {
        layerSwitcherContainer.appendChild(layerSwitcherButton);
      } else {
        console.error("Layer switcher container not found!");
      }
    });

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(6),
      projection: "EPSG:4326",
      className: "ol-mouse-position",
      undefinedHTML: "&nbsp;",
    });

    const map = new Map({
      target: mapElement.current,
      // layers: [],
      layers: [
        basemapGroup,
        // mouzaWMS,
        wmsLayer,
        BasaltGroup,
        CoalGroup,
        landGroup,
      ],
      view: new View({
        center: fromLonLat([87.598285, 24.059653]),
        zoom: window.innerWidth > 768 ? 14 : 13,
        constrainRotation: true,
      }),
      controls: defaultControls().extend([
        new ScaleLine({ bar: true, text: true, minWidth: 125 }),
        // new ScaleLine({
        //     bar: true,
        //     text: true,
        //     minWidth: 125,
        //     className: 'ol-scale-line ol-scale-combined'  // Custom class for styling
        // }),
        new Zoom(),
        new ZoomSlider(),
        // new OverviewMap({
        //   className: "ol-overviewmap ol-custom-overviewmap",
        //   layers: [
        //     new TileLayer({
        //       source: new OSM(),
        //     }),
        //   ],
        //   collapsed: false,
        //   collapsible: false,
        // }),
        new FullScreen(),
        new LayerSwitcher({
          startActive: window.innerWidth > 768,
          groupSelectStyle: "children",
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
      // const wmsSource = wmsLayer.getSource();

      // const url = wmsSource.getFeatureInfoUrl(
      //     clickedCoordinate,
      //     resolution,
      //     projection,
      //     {
      //         'INFO_FORMAT': 'application/json',
      //         'FEATURE_COUNT': 10
      //     }
      // );

      const activeLayers = [
        // Basemap Group
        // { layer: osmLayer, layerName: 'OSM Base Layer', condition: osmLayer.getVisible() },
        // { layer: googleLayerSatellite, layerName: 'Google Satellite', condition: googleLayerSatellite.getVisible() },
        // { layer: googleLayerRoadNames, layerName: 'Google Road Names', condition: googleLayerRoadNames.getVisible() },
        // { layer: googleLayerRoadmap, layerName: 'Google Road Map', condition: googleLayerRoadmap.getVisible() },
        // { layer: drone_image, layerName: 'Drone Image', condition: drone_image.getVisible() },

        // Basalt Group
        // { layer: balsalt_l, layerName: 'Basalt-326.76 Acres', condition: balsalt_l.getVisible() },
        {
          layer: vw_basalt_vested,
          layerName: "Basalt-Vested Land",
          condition: vw_basalt_vested.getVisible(),
        },

        {
          layer: vw_basalt_partlypurchased,
          layerName: "Basalt-Partly Purchased Land",
          condition: vw_basalt_partlypurchased.getVisible(),
        },
        {
          layer: vw_basalt_fullpurchased,
          layerName: "Basalt-Fully Purchased Land",
          condition: vw_basalt_fullpurchased.getVisible(),
        },
        // {
        //   layer: vw_basalt_ntapprove,
        //   layerName: "Basalt-Cabinate Approved but Not Purchased",
        //   condition: vw_basalt_ntapprove.getVisible(),
        // },
        {
          layer: vw_ba_partlypurchased,
          layerName: "Basalt-Partly Purchased Land",
          condition: vw_ba_partlypurchased.getVisible(),
        },
        // Coal Group
        // { layer: coalLayer, layerName: 'Coal Blocks', condition: coalLayer.getVisible() },
        {
          layer: vw_coal_vested,
          layerName: "Coal-Vested Land",
          condition: vw_coal_vested.getVisible(),
        },
        {
          layer: vw_coal_rayati,
          layerName: "Coal-Rayati Land",
          condition: vw_coal_rayati.getVisible(),
        },
        {
          layer: vw_coal_partlypurchased,
          layerName: "Coal-Partly Purchased Land",
          condition: vw_coal_partlypurchased.getVisible(),
        },
        {
          layer: vw_coal_fullpurchased,
          layerName: "Coal-Fully Purchased Land",
          condition: vw_coal_fullpurchased.getVisible(),
        },
        // {
        //   layer: vw_coal_ntapprove,
        //   layerName: "Coal-Cabinate Approved but Not Purchased",
        //   condition: vw_coal_ntapprove.getVisible(),
        // },
        {
          layer: vw_cl_partlypurchase,
          layerName: "Coal-Partly Purchased Land",
          condition: vw_cl_partlypurchase.getVisible(),
        },
        // Land Categories Group
        {
          layer: wmsLayer,
          layerName: "Land Records",
          condition: wmsLayer.getVisible(),
        },
        {
          layer: vw_borehole,
          layerName: "Borehole Points",
          condition: vw_borehole.getVisible(),
        },
        {
          layer: mouzaWMS,
          layerName: "Mouza Boundary",
          condition: mouzaWMS.getVisible(),
        },
        {
          layer: vestedLand,
          layerName: "Vested Land",
          condition: vestedLand.getVisible(),
        },
        {
          layer: rayatiLand,
          layerName: "Rayati Land",
          condition: rayatiLand.getVisible(),
        },
        {
          layer: forestLand,
          layerName: "Forest Land",
          condition: forestLand.getVisible(),
        },
        {
          layer: otherLand,
          layerName: "Others Land",
          condition: otherLand.getVisible(),
        },
        {
          layer: partlypurchasedLand,
          layerName: "Partly Purchased Land",
          condition: partlypurchasedLand.getVisible(),
        },
        {
          layer: fullypurchasedLand,
          layerName: "Fully Purchased Land",
          condition: fullypurchasedLand.getVisible(),
        },
        {
          layer: vw_borehole_basalt,
          layerName: "Borehole's",
          condition: vw_borehole_basalt.getVisible(),
        },
        {
          layer: vw_borehole_coal,
          layerName: "Borehole's",
          condition: vw_borehole_coal.getVisible(),
        },
        {
          layer: vw_basalt_rayati,
          layerName: "Basalt-Rayati Land",
          condition: vw_basalt_rayati.getVisible(),
        },

        // {
        //   layer: notapprove,
        //   layerName: "Cabinet Approved but Not Purchased",
        //   condition: notapprove.getVisible(),
        // },
      ].filter((layerInfo) => layerInfo.condition);

      const fetchLayerFeatureInfo = async (layerInfo) => {
        const wmsSource = layerInfo.layer.getSource();
        const url = await wmsSource.getFeatureInfoUrl(
          clickedCoordinate,
          resolution,
          projection,
          {
            INFO_FORMAT: "application/json",
            FEATURE_COUNT: 10,
          }
        );

        if (url) {
          return fetch(url)
            .then((response) => response.json())
            .then((data) => {
              if (data && data.features && data.features.length > 0) {
                return {
                  layerName: layerInfo.layerName,
                  features: data.features.map((f) => f.properties),
                };
              }
              return null;
            })
            .catch((error) => {
              console.error(
                `Error fetching WMS info for ${layerInfo.layerName}:`,
                error
              );
              return null;
            });
        }
        return Promise.resolve(null);
      };

      Promise.all(activeLayers.map(fetchLayerFeatureInfo)).then((results) => {
        // Filter out null results and find the first layer with features
        const validResults = results.filter((result) => result !== null);
        if (validResults.length > 0) {
          const firstResult = validResults[0];
          setCoordinates(clickedCoordinate);
          setFeaturesData(firstResult.features);
          setCurrentFeatureLayer(firstResult.layerName);
          setSelectedFeatureIndex(0);
          setIsModalOpen(true);
        }
      });
    };

    drone_image.onload = () => {
      console.log("Drone image layer loaded successfully.");
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
    if (fieldName == "plotno") {
      return "Plot No";
    }
    if (fieldName == "lr_plot_no") {
      return "LR Plot No";
    }
    if (fieldName == "rs_plot_no") {
      return "RS Plot No";
    }
    if (fieldName == "lr_khatian_no") {
      return "Khatian No";
    }
    if (fieldName == "purch_area") {
      return "Purchase Area";
    }
    if (fieldName == "distance_from_nh_meters") {
      return "Distance from NH (Meters)";
    }
    if (fieldName == "distance_from_metalled_road_meters") {
      return "Distance from Metalled Road (Meters)";
    }
    return fieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div>
      {droneImgLoading && (
        <div className="droneimageloader">
          <div className="spinner"></div>
          Loading drone image...
        </div>
      )}
      <div
        ref={mapElement}
        style={{
          width: "100%",
          height: "calc(100vh - 64px)",
        }}
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Plot Information"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Softer overlay for a modern look
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
            borderRadius: "10px",
            padding: "20px",
            border: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            maxWidth: "800px",
            width: "90%",
            backgroundColor: "#fff", // White background for content
          },
        }}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div className="modal-header-icon" style={{ marginRight: "10px" }}>
            <div className="modal-header-icon" style={{ marginRight: "10px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9C5 13.53 12 21 12 21C12 21 19 13.53 19 9C19 5.13 15.87 2 12 2Z" />
                <circle cx="12" cy="9" r="2" fill="#007bff" />
              </svg>
            </div>
          </div>
          <div>
            <h2
              className="modal-title"
              style={{ color: "white", fontSize: "1.5rem", margin: 0 }}
            >
              Plot Information
            </h2>
            <p
              className="modal-subtitle"
              style={{ color: "white", fontSize: "0.9rem" }}
            >
              View and navigate through the plot records
            </p>
          </div>
        </div>

        {featuresData.length > 0 ? (
          <>
            <div
              className="feature-records-nav"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <span
                className="feature-records-count"
                style={{ fontSize: "0.9rem", color: "#555" }}
              >
                Record {selectedFeatureIndex + 1} of {featuresData.length}
              </span>
              <div>
                <button
                  className="pagination-button"
                  onClick={() =>
                    setSelectedFeatureIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={selectedFeatureIndex === 0}
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    fontSize: "0.9rem",
                    cursor:
                      selectedFeatureIndex === 0 ? "not-allowed" : "pointer",
                    marginRight: "8px",
                  }}
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
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "5px",
                    fontSize: "0.9rem",
                    cursor:
                      selectedFeatureIndex === featuresData.length - 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                className="records-table"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        color: "#007bff",
                        fontSize: "1rem",
                        fontWeight: "600",
                      }}
                    >
                      Field
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        color: "#007bff",
                        fontSize: "1rem",
                        fontWeight: "600",
                      }}
                    >
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(featuresData[selectedFeatureIndex]).map(
                    ([key, value]) => {
                      if (value === null || value === undefined || value === "") {
                        value = "N/A";
                      }
                      if( key === 'total_area' || key=== 'in_coal' || key=== 'in_basalt'){
                        return null;
                      }
                      return (
                        <tr
                          key={key}
                          style={{ borderBottom: "1px solid #eee" }}
                        >
                          <td
                            style={{
                              fontWeight: "500",
                              padding: "8px 10px",
                              color: "#333",
                            }}
                          >
                            {formatFieldName(key)}
                          </td>
                          <td style={{ padding: "8px 10px", color: "#333" }}>
                            {value}
                          </td>
                        </tr>
                      );
                    }
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
          className="close-button"
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
          }}
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default MapView;
