import React, { useState } from "react";
import MapWrapper from "./MapWrapper";
import TileLayer from "./TileLayer";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";

const MapApp = () => {
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(3);

  return (
    <div>
      <MapWrapper center={fromLonLat(center)} zoom={zoom}>
        <TileLayer source={new OSM()} zIndex={0} />
      </MapWrapper>
    </div>
  );
};

export default MapApp;
