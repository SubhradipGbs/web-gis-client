// react
import React, { useState, useEffect, useRef } from "react";

// openlayers
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import { transform } from "ol/proj";
import { toStringXY } from "ol/coordinate";
import "ol/ol.css";

function MapWrapper(props) {
  return (
    <div className="w-100 h-100 border d-flex justify-content-center align-items-center">
      <h3>Map Area</h3>
    </div>
  );
}

export default MapWrapper;
