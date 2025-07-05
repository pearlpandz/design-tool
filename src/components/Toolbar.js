import { FaRegSquare, FaRegCircle, FaRegFolder, FaRegStar } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FiMinus } from "react-icons/fi";
import {
  IoImageOutline,
  IoLayersOutline,
  IoSaveOutline,
  IoTextOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { GiFilmStrip } from "react-icons/gi";
import { LiaDrawPolygonSolid } from "react-icons/lia";
import { TbCircleDashed } from "react-icons/tb";

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
        <LuRectangleHorizontal />
      </button>
      <button onClick={() => addElement("square")} title="Add Square">
        <FaRegSquare />
      </button>
      <button onClick={() => addElement("circle")} title="Add Circle">
        <FaRegCircle />
      </button>
      <button onClick={() => addElement("line")} title="Add Line">
        <FiMinus />
      </button>
      <button onClick={() => addElement("polygon")} title="Add Polygon">
        <LiaDrawPolygonSolid />
      </button>
      <button onClick={() => addElement("star")} title="Add Star">
        <FaRegStar />
      </button>
      <button onClick={() => addElement("arc")} title="Add Arc">
        <TbCircleDashed />
      </button>
      <button onClick={() => addElement("text")} title="Add Text">
        <IoTextOutline />
      </button>
      <button onClick={() => addElement("image")} title="Add Image">
        <IoImageOutline />
      </button>
      <button onClick={() => addElement("gif")} title="Add GIF">
        <GiFilmStrip />
      </button>
      <button onClick={() => addElement("video")} title="Add Video">
        <IoVideocamOutline />
      </button>
      <button onClick={exportCanvas} title="Download PNG">
        <MdFileDownload />
      </button>
      <button onClick={saveTemplate} title="Save Template">
        <IoSaveOutline />
      </button>
      <button onClick={loadTemplate} title="Load Template">
        <FaRegFolder />
      </button>
      <button onClick={toggleLayersPanel} title="Toggle Layers Panel">
        <IoLayersOutline />
      </button>
    </div>
  );
};

export default Toolbar;
