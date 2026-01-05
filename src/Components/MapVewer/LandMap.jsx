import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Stroke, Fill } from "ol/style";
import { TileImage } from "ol/source";

const LandMap = ({ land }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorLayerRef = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          source: new TileImage({
            url: "http://mt1.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}&s=Ga",
          }),
          visible: true,
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !land?.shape) return;

    if (vectorLayerRef.current) {
      mapInstance.current.removeLayer(vectorLayerRef.current);
    }

    const geoJsonObject = {
      type: "Feature",
      geometry: land.shape,
      properties: {
        plotno: land.plotno,
        owner: land.owner_name_or_raiayat,
      },
    };

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geoJsonObject, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "#1e88e5",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(30, 136, 229, 0.35)",
        }),
      }),
    });

    vectorLayerRef.current = vectorLayer;
    mapInstance.current.addLayer(vectorLayer);

    const extent = vectorSource.getExtent();
    mapInstance.current.getView().fit(extent, {
      padding: [40, 40, 40, 40],
      maxZoom: 20,
      duration: 600,
    });
  }, [land]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

export default LandMap;
