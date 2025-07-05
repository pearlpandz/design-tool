
import React from "react";
import { RegularPolygon } from "react-konva";

const Star = (props) => {
  return (
    <RegularPolygon
      {...props}
      sides={props.numPoints}
      innerRadius={props.innerRadius}
      outerRadius={props.outerRadius}
    />
  );
};

export default Star;
