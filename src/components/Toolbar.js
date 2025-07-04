import React from "react";
import {
  FaSquare,
  FaCircle,
  FaMinus,
  FaTextHeight,
  FaImage,
  FaDownload,
  FaSave,
  FaFolderOpen,
  FaLayerGroup,
  FaSquareFull,
  FaDrawPolygon,
  FaVideo,
} from "react-icons/fa";
import { MdGif } from "react-icons/md";
const Toolbar = ({
  addElement,
  exportCanvas,
  saveTemplate,
  loadTemplate,
  toggleLayersPanel,
}) => {
  return (
    <div className="toolbar">
      <button onClick={() => addElement("rect")} title="Add Rectangle">
        <FaSquare />
      </button>
      <button onClick={() => addElement("square")} title="Add Square">
        <FaSquareFull />
      </button>
      <button onClick={() => addElement("circle")} title="Add Circle">
        <FaCircle />
      </button>
      <button onClick={() => addElement("line")} title="Add Line">
        <FaMinus />
      </button>
      <button onClick={() => addElement("polygon")} title="Add Polygon">
        <FaDrawPolygon />
      </button>
      <button onClick={() => addElement("text")} title="Add Text">
        <FaTextHeight />
      </button>
      <button onClick={() => addElement("image")} title="Add Image">
        <FaImage />
      </button>
      <button onClick={() => addElement("gif")} title="Add GIF">
        <MdGif />
      </button>
      <button onClick={() => addElement("video")} title="Add Video">
        <FaVideo />
      </button>
      <button onClick={exportCanvas} title="Download PNG">
        <FaDownload />
      </button>
      <button onClick={saveTemplate} title="Save Template">
        <FaSave />
      </button>
      <button onClick={loadTemplate} title="Load Template">
        <FaFolderOpen />
      </button>
      <button onClick={toggleLayersPanel} title="Toggle Layers Panel">
        <FaLayerGroup />
      </button>
    </div>
  );
};

export default Toolbar;
