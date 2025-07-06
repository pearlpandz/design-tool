/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef } from "react";
import { Circle, Line } from "react-konva";

export default function Pen({
  points,
  activatePoints,
  isSelected,
  onPointDrag,
  onChange,
  isClosed,
  currentTool,
  onAddPoint,
  ...rest
}) {
  const shapeRef = useRef();
  const {
    x = 0,
    y = 0,
    scaleX = 1,
    scaleY = 1,
    bgColor,
    strokeColor,
    strokeWidth,
    opacity = 100,
    ...otherRest
  } = rest;
  const konvaOpacity = opacity / 100;

  const mappedPoints = useMemo(() => {
    if (!points) return [];
    const mappedPoints = [];
    for (let i = 0; i < points.length; i += 2) {
      mappedPoints.push({
        x: points[i] * scaleX + x,
        y: points[i + 1] * scaleY + y,
      });
    }
    return mappedPoints;
  }, [points, x, y, scaleX, scaleY]);

  const hoverRef = useRef(null);

  // useEffect(() => {
  //   document.body.style.cursor = "default";
  // }, [activatePoints]);

  const handleDragEnd = (e) => {
    const { onClick, draggable, ...element } = rest;
    onChange({ ...element, x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = (e) => {
    let node = e.target;
    const newWidth = node.width() * node.scaleX();
    const newHeight = node.height() * node.scaleY();

    const { onClick, draggable, ...element } = rest;
    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    });
  };
  return (
    <>
      <Line
        ref={shapeRef}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        points={points}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        fill={bgColor}
        opacity={konvaOpacity}
        onClick={(e) => {
          console.log("Pen.js: Line onClick - currentTool:", currentTool);
          console.log("Pen.js: Line onClick - onAddPoint:", onAddPoint);
          if (e.evt.button === 0) {
            if (currentTool === "pen") {
              const pointerPosition = e.target.getStage().getPointerPosition();
              onAddPoint(pointerPosition);
            } else {
              rest.onSelect(e.evt.shiftKey || e.evt.ctrlKey);
            }
          }
        }}
        onTap={(e) => {
          console.log("Pen.js: Line onTap - currentTool:", currentTool);
          console.log("Pen.js: Line onTap - onAddPoint:", onAddPoint);
          if (e.evt.button === 0) {
            if (currentTool === "pen") {
              const pointerPosition = e.target.getStage().getPointerPosition();
              onAddPoint(pointerPosition);
            } else {
              rest.onSelect(e.evt.shiftKey || e.evt.ctrlKey);
            }
          }
        }}
        closed={isClosed}
        {...otherRest}
      />
      {mappedPoints.map((point, index) => {
        return (
          <Circle
            x={point.x}
            y={point.y}
            radius={5}
            fill="white"
            stroke="#8986E3"
            strokeWidth={1}
            draggable
            onMouseOver={(e) => {
              e.target.setAttr("fill", "#eee");
              document.body.style.cursor = "pointer";
              hoverRef?.current?.setAttrs({
                x: e.target.x(),
                y: e.target.y(),
                visible: true,
              });
            }}
            onMouseOut={(e) => {
              e.target.setAttr("fill", "white");
              document.body.style.cursor = "default";
              hoverRef?.current?.setAttrs({
                visible: false,
              });
            }}
            onDragMove={(e) => {
              const x = e.target.x();
              const y = e.target.y();

              const newPoints = [...(points || [])];
              newPoints[index * 2] = x;
              newPoints[index * 2 + 1] = y;
              onPointDrag(newPoints);

              hoverRef?.current?.setAttrs({
                x,
                y,
                visible: true,
              });
            }}
          />
        );
      })}
    </>
  );
}
