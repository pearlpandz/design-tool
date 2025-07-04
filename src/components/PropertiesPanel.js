import React from "react";
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

const PropertiesPanel = ({
  selectedElement,
  updateElement,
  canvasBackgroundColor,
  setCanvasBackgroundColor,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateElement(selectedElement.id, { [name]: value });
  };

  const handleColorChange = (color, name) => {
    updateElement(selectedElement.id, { [name]: color });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "bold") {
      updateElement(selectedElement.id, {
        fontStyle: checked ? "bold" : "normal",
      });
    } else if (name === "italic") {
      updateElement(selectedElement.id, {
        fontStyle: checked ? "italic" : "normal",
      });
    } else if (name === "underline") {
      updateElement(selectedElement.id, {
        textDecoration: checked ? "underline" : "",
      });
    } else if (name === "line-through") {
      updateElement(selectedElement.id, {
        textDecoration: checked ? "line-through" : "",
      });
    }
  };

  return (
    <div className="properties-panel">
      <h3>Canvas Properties</h3>
      <label>Background Color:</label>
      <HexColorPicker
        color={canvasBackgroundColor}
        onChange={setCanvasBackgroundColor}
      />

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

          {selectedElement.type !== "text" && (
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

              <label>
                <input
                  type="checkbox"
                  name="bold"
                  checked={
                    selectedElement.fontStyle &&
                    selectedElement.fontStyle.includes("bold")
                  }
                  onChange={handleCheckboxChange}
                />
                Bold
              </label>
              <label>
                <input
                  type="checkbox"
                  name="italic"
                  checked={
                    selectedElement.fontStyle &&
                    selectedElement.fontStyle.includes("italic")
                  }
                  onChange={handleCheckboxChange}
                />
                Italic
              </label>
              <label>
                <input
                  type="checkbox"
                  name="underline"
                  checked={
                    selectedElement.textDecoration &&
                    selectedElement.textDecoration.includes("underline")
                  }
                  onChange={handleCheckboxChange}
                />
                Underline
              </label>
              <label>
                <input
                  type="checkbox"
                  name="line-through"
                  checked={
                    selectedElement.textDecoration &&
                    selectedElement.textDecoration.includes("line-through")
                  }
                  onChange={handleCheckboxChange}
                />
                Line-through
              </label>
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
                <HexColorPicker
                  color={selectedElement.fill}
                  onChange={(color) => handleColorChange(color, "fill")}
                />
              </>
            )}

          <label>Stroke Color:</label>
          <HexColorPicker
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
