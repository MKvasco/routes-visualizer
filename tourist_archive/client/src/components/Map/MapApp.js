import React, { useState, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import "ol/ol.css";

const MapApp = () => {
  const [map, setMap] = useState();
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState([0, 0]);
  const mapElement = useRef();
  // const mapRef = useRef();
  // mapRef.current = map;

  useEffect(() => {
    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: center,
        zoom: zoom,
      }),
    });
    // setMap(initialMap);
  }, []);

  useEffect(() => {}, [center]);

  return <div ref={mapElement} className="map" />;
};

export default MapApp;
