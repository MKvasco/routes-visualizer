import React, { useState, useEffect, useRef } from "react";
import { Map, View, Feature } from "ol";
import { LineString, MultiLineString } from "ol/geom";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import "ol/ol.css";

const MapApp = (props) => {
  const [map, setMap] = useState();
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState([0, 0]);
  const [view, setView] = useState();
  const [routesFeature, setRoutesFeature] = useState(new Feature());
  const [routes, setRoutes] = useState(new MultiLineString([[]]));
  const [featuresLayer, setFeaturesLayer] = useState();
  const mapElement = useRef();

  useEffect(() => {
    const initFeaturesLayer = new VectorLayer({
      source: new VectorSource({
        features: [routesFeature],
      }),
    });

    const initView = new View({
      center: center,
      zoom: zoom,
    });

    const initMap = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        initFeaturesLayer,
      ],
      view: initView,
      controls: [],
    });

    setMap(initMap);
    setView(initView);
    setFeaturesLayer(initFeaturesLayer);
  }, []);

  useEffect(() => {
    if (props.showRoute) {
      let feature = new Feature();
      let coordinates = [];
      props.showRoute.geometry.coordinates.forEach((coordinate) => {
        coordinates.push(fromLonLat(coordinate));
      });
      let color = "#fffff";
      let width = 5;

      feature.setId(props.showRoute.id);
      feature.setGeometry(new LineString(coordinates));
      feature.setStyle(
        new Style({
          stroke: new Stroke({
            color: color,
            width: width,
          }),
        })
      );
      featuresLayer.getSource().removeFeature(routesFeature);
      featuresLayer.getSource().addFeature(feature);
      view.fit(feature.getGeometry(), { padding: [100, 100, 100, 100] });
    }
  }, [props.showRoute]);

  useEffect(() => {
    if (props.hideRoute) {
      view.setCenter(center);
      view.setZoom(zoom);
      let feature = featuresLayer
        .getSource()
        .getFeatureById(props.hideRoute.id);
      featuresLayer.getSource().addFeature(routesFeature);
      if (routesFeature.getGeometry())
        view.fit(routesFeature.getGeometry(), {
          padding: [100, 100, 100, 100],
        });
      featuresLayer.getSource().removeFeature(feature);
    }
  }, [props.hideRoute]);

  useEffect(() => {
    //TODO: make each route unique color ( read from db )
    if (props.addRoute) {
      let coordinates = [];
      props.addRoute.geometry.coordinates.forEach((coordinate) => {
        coordinates.push(fromLonLat(coordinate));
      });
      let route = new LineString(coordinates);
      let color = "#fffff";
      let width = 5;
      routes.appendLineString(route);
      routesFeature.setGeometry(routes);
      routesFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: color,
            width: width,
          }),
        })
      );
      view.fit(routesFeature.getGeometry(), { padding: [100, 100, 100, 100] });
    }
  }, [props.addRoute]);
  useEffect(() => {
    // Remove linestring from multilinestring
  }, [props.removeRoute]);

  return <div ref={mapElement} className="map" />;
};

export default MapApp;
