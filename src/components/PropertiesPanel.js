import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";

const fontFamilies = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Lucida Console",
  "Impact",
  "Comic Sans MS",
];

const ColorPickerInput = ({ color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation(); // Stop event propagation
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  return (
    <div className="color-picker-input">
      <div className="color-swatch" onClick={handleClick}>
        <div style={{ backgroundColor: color }} className="color" />
      </div>
      {displayColorPicker ? (
        <div className="color-picker-popover">
          <div className="color-picker-cover" onClick={handleClose} />
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      ) : null}
    </div>
  );
};

const PropertiesPanel = ({
  selectedElement,
  updateElement,
  canvasBackgroundColor,
  setCanvasBackgroundColor,
}) => {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      updateElement(selectedElement.id, {
        [name]: e?.target?.valueAsNumber ?? Number(value),
      });
    } else {
      updateElement(selectedElement.id, { [name]: value });
    }
  };

  const handleColorChange = (color, name) => {
    updateElement(selectedElement.id, { [name]: color });
  };

  return (
    <div className="properties-panel">
      {/* <h3>Canvas Properties</h3>
      <label>Background Color:</label>
      <ColorPickerInput
        color={canvasBackgroundColor}
        onChange={setCanvasBackgroundColor}
      /> */}

      {selectedElement && (
        <>
          <h3>Element Properties</h3>
          <label>X:</label>
          <input
            type="number"
            name="x"
            value={selectedElement.x}
            onChange={handleChange}
          />
          <label>Y:</label>
          <input
            type="number"
            name="y"
            value={selectedElement.y}
            onChange={handleChange}
          />

          <label>Opacity:</label>
          <input
            type="number"
            name="opacity"
            min="0"
            max="1"
            step="0.01"
            value={selectedElement.opacity}
            onChange={handleChange}
          />

          <label>Slug:</label>
          <input
            type="text"
            name="slug"
            value={selectedElement.slug || ""}
            onChange={handleChange}
          />

          {selectedElement.type !== "group" && (
            <>
              <label>Width:</label>
              <input
                type="number"
                name="width"
                value={selectedElement.width}
                onChange={handleChange}
              />
              <label>Height:</label>
              <input
                type="number"
                name="height"
                value={selectedElement.height}
                onChange={handleChange}
              />
              {(selectedElement.type === "rect" ||
                selectedElement.type === "square") && (
                <>
                  <label>Corner Radius Top Left:</label>
                  <input
                    type="number"
                    name="cornerRadiusTopLeft"
                    value={selectedElement.cornerRadiusTopLeft || 0}
                    onChange={handleChange}
                  />
                  <label>Corner Radius Top Right:</label>
                  <input
                    type="number"
                    name="cornerRadiusTopRight"
                    value={selectedElement.cornerRadiusTopRight || 0}
                    onChange={handleChange}
                  />
                  <label>Corner Radius Bottom Left:</label>
                  <input
                    type="number"
                    name="cornerRadiusBottomLeft"
                    value={selectedElement.cornerRadiusBottomLeft || 0}
                    onChange={handleChange}
                  />
                  <label>Corner Radius Bottom Right:</label>
                  <input
                    type="number"
                    name="cornerRadiusBottomRight"
                    value={selectedElement.cornerRadiusBottomRight || 0}
                    onChange={handleChange}
                  />
                </>
              )}
            </>
          )}

          {selectedElement.type === "text" && (
            <>
              <label>Text Content:</label>
              <textarea
                name="text"
                value={selectedElement.text}
                onChange={handleChange}
              />

              <label>Font Size:</label>
              <input
                type="number"
                name="fontSize"
                value={selectedElement.fontSize}
                onChange={handleChange}
              />

              <label>Font Family:</label>
              <select
                name="fontFamily"
                value={selectedElement.fontFamily}
                onChange={handleChange}
              >
                {fontFamilies.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>

              <label>Line Height:</label>
              <input
                type="number"
                name="lineHeight"
                value={selectedElement.lineHeight}
                onChange={handleChange}
              />

              <label>Padding:</label>
              <input
                type="number"
                name="padding"
                value={selectedElement.padding}
                onChange={handleChange}
              />

              <label>Color:</label>
              <ColorPickerInput
                color={selectedElement.color}
                onChange={(color) => handleColorChange(color, "color")}
              />

              <label>
                <input
                  type="checkbox"
                  name="bold"
                  checked={selectedElement.fontWeight === "bold"}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      fontWeight: e.target.checked ? "bold" : "normal",
                    })
                  }
                />
                Bold
              </label>
              <label>
                <input
                  type="checkbox"
                  name="italic"
                  checked={selectedElement.fontStyle === "italic"}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      fontStyle: e.target.checked ? "italic" : "normal",
                    })
                  }
                />
                Italic
              </label>
              <label>
                <input
                  type="checkbox"
                  name="underline"
                  checked={selectedElement.textDecoration.includes("underline")}
                  onChange={(e) => {
                    const newTextDecoration = e.target.checked
                      ? [...selectedElement.textDecoration, "underline"]
                      : selectedElement.textDecoration.filter(
                          (dec) => dec !== "underline"
                        );
                    updateElement(selectedElement.id, {
                      textDecoration: newTextDecoration,
                    });
                  }}
                />
                Underline
              </label>
              <label>
                <input
                  type="checkbox"
                  name="line-through"
                  checked={selectedElement.textDecoration.includes(
                    "line-through"
                  )}
                  onChange={(e) => {
                    const newTextDecoration = e.target.checked
                      ? [...selectedElement.textDecoration, "line-through"]
                      : selectedElement.textDecoration.filter(
                          (dec) => dec !== "line-through"
                        );
                    updateElement(selectedElement.id, {
                      textDecoration: newTextDecoration,
                    });
                  }}
                />
                Line-through
              </label>
              <label>Alignment:</label>
              <select
                name="textAlign"
                value={selectedElement.textAlign}
                onChange={handleChange}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </>
          )}

          {(selectedElement.type === "image" ||
            selectedElement.type === "gif" ||
            selectedElement.type === "video") && (
            <>
              <label>Source URL:</label>
              <input
                type="text"
                name="src"
                value={selectedElement.src}
                onChange={handleChange}
              />
            </>
          )}

          {selectedElement.type === "video" && (
            <>
              <label>
                <input
                  type="checkbox"
                  name="isPlaying"
                  checked={selectedElement.isPlaying}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      isPlaying: e.target.checked,
                    })
                  }
                />
                Play Video
              </label>
            </>
          )}

          {selectedElement.type === "polygon" && (
            <>
              <label>Sides:</label>
              <input
                type="number"
                name="sides"
                value={selectedElement.sides}
                onChange={handleChange}
              />
              <label>Radius:</label>
              <input
                type="number"
                name="radius"
                value={selectedElement.radius}
                onChange={handleChange}
              />
            </>
          )}

          {selectedElement.type !== "image" &&
            selectedElement.type !== "gif" &&
            selectedElement.type !== "video" && (
              <>
                <label>Fill Color:</label>
                <ColorPickerInput
                  color={selectedElement.fill}
                  onChange={(color) => handleColorChange(color, "fill")}
                />
              </>
            )}

          <label>Stroke Color:</label>
          <ColorPickerInput
            color={selectedElement.stroke}
            onChange={(color) => handleColorChange(color, "stroke")}
          />

          <label>Stroke Width:</label>
          <input
            type="number"
            name="strokeWidth"
            value={selectedElement.strokeWidth}
            onChange={handleChange}
          />
        </>
      )}
    </div>
  );
};

export default PropertiesPanel;
