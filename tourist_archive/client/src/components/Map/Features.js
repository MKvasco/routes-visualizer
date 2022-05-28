import React, { useEffect, useState, useContext } from "react";
import Draw from "ol/interaction/Draw";
import MapContext from "./Map/MapContext";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";

const Features = () => {
  const [interactionAdded, setInteractionAdded] = useState(false);
  const { map } = useContext(MapContext);

  const source = new VectorSource({ wrapX: false });

  const vector = new VectorLayer({
    source: source,
  });

  let draw; // global so we can remove it later

  function addInteraction() {
    draw = new Draw({
      source: source,
      type: "Polygon",
    });
    map.addInteraction(draw);
    setInteractionAdded(true);
  }

  return <button onClick={addInteraction}>Add draw</button>;
};

export default Features;
