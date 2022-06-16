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
  const [multiLineFeature, setMultiLineFeature] = useState(false);
  const [actualRouteFeature, setActualRouteFeature] = useState(false);
  const [tmpFeatures, setTmpFeatures] = useState([]);
  const [routes, setRoutes] = useState();
  const [featuresLayer, setFeaturesLayer] = useState();
  const mapElement = useRef();

  useEffect(() => {
    const initFeaturesLayer = new VectorLayer({
      source: new VectorSource({
        features: [],
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
      // Create feature to show
      let feature = new Feature();
      let coordinates = [];
      props.showRoute.geometry.coordinates.forEach((coordinate) => {
        coordinates.push(fromLonLat(coordinate));
      });

      const color = props.showRoute.properties.route_color;
      const width = props.showRoute.properties.route_width;

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

      if (!actualRouteFeature) {
        // Save previous features before removing from map
        setTmpFeatures(featuresLayer.getSource().getFeatures());

        // Remove features from map
        featuresLayer
          .getSource()
          .getFeatures()
          .forEach((feature) => {
            featuresLayer.getSource().removeFeature(feature);
          });

        // Remove multiLine Feature
        if (multiLineFeature)
          featuresLayer.getSource().removeFeature(multiLineFeature);
      }

      // Updating actual route when updating values in modal
      if (actualRouteFeature) {
        featuresLayer.getSource().removeFeature(actualRouteFeature);
      }
      setActualRouteFeature(feature);

      // Add current feature to map
      featuresLayer.getSource().addFeature(feature);
      view.fit(feature.getGeometry(), { padding: [100, 100, 100, 100] });
    }
  }, [props.showRoute]);

  useEffect(() => {
    if (props.hideRoute) {
      // Centering and zooming to previous values
      view.setCenter(center);
      view.setZoom(zoom);

      // Deleting feature from detail modal
      featuresLayer.getSource().removeFeature(actualRouteFeature);
      setActualRouteFeature(false);

      // Adding back features from before
      tmpFeatures.forEach((feature) => {
        if (feature.id_ == actualRouteFeature.id_) {
          featuresLayer.getSource().addFeature(actualRouteFeature);
        } else {
          featuresLayer.getSource().addFeature(feature);
        }
      });
      console.log(featuresLayer.getSource().getFeatures());

      // Adding back multiLine feature and fittint to view
      if (multiLineFeature) {
        featuresLayer.getSource().addFeature(multiLineFeature);
        if (
          multiLineFeature.getGeometry() &&
          multiLineFeature.getGeometry().flatCoordinates.length > 0
        ) {
          view.fit(multiLineFeature.getGeometry(), {
            padding: [100, 100, 100, 100],
          });
        }
      }
    }
  }, [props.hideRoute]);

  useEffect(() => {
    if (props.addRoute) {
      let feature = new Feature();
      let coordinates = [];
      props.addRoute.geometry.coordinates.forEach((coordinate) => {
        coordinates.push(fromLonLat(coordinate));
      });

      const color = props.addRoute.properties.route_color;
      const width = props.addRoute.properties.route_width;

      feature.setId(props.addRoute.id);
      feature.setGeometry(new LineString(coordinates));
      feature.setStyle(
        new Style({
          zIndex: featuresLayer.getSource().getFeatures().length,
          stroke: new Stroke({
            color: color,
            width: width,
          }),
        })
      );
      featuresLayer.getSource().addFeature(feature);
    }
  }, [props.addRoute]);

  useEffect(() => {
    if (props.removeRoute) {
      let feature = featuresLayer
        .getSource()
        .getFeatureById(props.removeRoute.id);
      featuresLayer.getSource().removeFeature(feature);
    }
  }, [props.removeRoute]);

  useEffect(() => {
    if (props.zoomRoute) {
      let feature = featuresLayer
        .getSource()
        .getFeatureById(props.zoomRoute.id);

      if (feature)
        view.fit(feature.getGeometry(), {
          padding: [100, 100, 100, 100],
        });
    }
  }, [props.zoomRoute]);

  useEffect(() => {
    if (props.addFileRoutes) {
      setTmpFeatures(featuresLayer.getSource().getFeatures());
      featuresLayer.getSource().clear();
      const multiLineStringToZoom = new MultiLineString([[]]);
      props.addFileRoutes.features.forEach((route) => {
        let feature = new Feature();
        let coordinates = [];
        route.geometry.coordinates.forEach((coordinate) => {
          coordinates.push(fromLonLat(coordinate));
        });
        const color = route.properties.route_color;
        const width = route.properties.route_width;

        const lineString = new LineString(coordinates);
        multiLineStringToZoom.appendLineString(lineString);

        feature.setId(route.id);
        feature.setGeometry(lineString);
        feature.setStyle(
          new Style({
            zIndex: featuresLayer.getSource().getFeatures().length,
            stroke: new Stroke({
              color: color,
              width: width,
            }),
          })
        );
        featuresLayer.getSource().addFeature(feature);
      });
      view.fit(multiLineStringToZoom, { padding: [200, 200, 200, 200] });
    }
  }, [props.addFileRoutes]);

  useEffect(() => {
    if (props.removeFileRoutes) {
      view.setZoom(zoom);
      view.setCenter(center);
      featuresLayer.getSource().clear();
      featuresLayer.getSource().addFeatures(tmpFeatures);
    }
  }, [props.removeFileRoutes]);

  useEffect(() => {
    /*
 if (props.addRoutes) {
      let lineStrings = [];

      props.addRoutes.forEach((route) => {
        let coordinates = [];
        route.geometry.coordinates.forEach((coordinate) => {
          coordinates.push(fromLonLat(coordinate));
        });
        lineStrings.push(new LineString(coordinates));
      });

      routesFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: "#fffff",
            width: 5,
          }),
        })
      );

      setRoutes(new MultiLineString(lineStrings));
    }
    props.showRoutes
    */
  }, []);

  useEffect(() => {
    if (routes && multiLineFeature) {
      multiLineFeature.setGeometry(routes);
      if (
        multiLineFeature.getGeometry() &&
        multiLineFeature.getGeometry().flatCoordinates.length > 0
      ) {
        view.fit(multiLineFeature.getGeometry(), {
          padding: [100, 100, 100, 100],
        });
      } else {
        view.setCenter(center);
        view.setZoom(zoom);
      }
    }
  }, [routes]);

  return <div ref={mapElement} className="map" />;
};

export default MapApp;
