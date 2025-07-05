import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import PropertiesPanel from "./components/PropertiesPanel";
import LayersPanel from "./components/LayersPanel";
import ContextMenu from "./components/ContextMenu";
import "./App.css";

function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [showLayersPanel, setShowLayersPanel] = useState(true);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("#ffffff");
  const stageRef = useRef();

  const [contextMenu, setContextMenu] = useState(null);
  const [selectedElementsForClipping, setSelectedElementsForClipping] =
    useState([]);

  const addElement = (type) => {
    const baseProps = {
      id: uuidv4(),
      type,
      x: 50,
      y: 50,
      stroke: "#000000",
      strokeWidth: 2,
    };

    let newElement;
    if (type === "text") {
      newElement = {
        ...baseProps,
        text: "New Text",
        fill: "#333333",
        strokeWidth: 0, // for text stroke not required
        width: undefined,
        height: undefined,
        fontSize: 20,
        fontFamily: "Arial",
        fontStyle: "normal",
        textDecoration: "",
      };
    } else if (type === "image") {
      newElement = {
        ...baseProps,
        src: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f",
        width: 150,
        height: 150,
      };
    } else if (type === "gif") {
      newElement = {
        ...baseProps,
        src: "https://media.giphy.com/media/3o7bu3hilQ0Q0Q0Q0/giphy.gif",
        width: 150,
        height: 150,
      };
    } else if (type === "video") {
      newElement = {
        ...baseProps,
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        width: 320,
        height: 180,
        isPlaying: false,
      };
    } else if (type === "line") {
      newElement = {
        ...baseProps,
        points: [0, 0, 100, 0],
        fill: "#aabbcc",
        width: 100,
        height: 0,
      };
    } else if (type === "square") {
      newElement = { ...baseProps, fill: "#aabbcc", width: 100, height: 100 };
    } else if (type === "polygon") {
      newElement = { ...baseProps, fill: "#aabbcc", sides: 3, radius: 100 };
    } else {
      newElement = { ...baseProps, fill: "#aabbcc", width: 100, height: 100 };
    }
    setElements([...elements, newElement]);
  };

  const updateElement = (id, properties) => {
    setElements(
      elements.map((el) => {
        if (el.id === id) {
          const updatedEl = { ...el, ...properties };
          if (
            updatedEl.type === "line" &&
            (properties.width !== undefined || properties.height !== undefined)
          ) {
            updatedEl.points = [0, 0, updatedEl.width, updatedEl.height];
          } else if (
            updatedEl.type === "square" &&
            properties.width !== undefined
          ) {
            updatedEl.height = updatedEl.width;
          }
          return updatedEl;
        }
        return el;
      })
    );
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement((prev) => ({ ...prev, ...properties }));
    }
  };

  const deleteElement = (idToDelete) => {
    setElements(elements.filter((el) => el.id !== idToDelete));
    if (selectedElement && selectedElement.id === idToDelete) {
      setSelectedElement(null);
    }
    setContextMenu(null);
  };

  const duplicateElement = (idToDuplicate) => {
    const elementToDuplicate = elements.find((el) => el.id === idToDuplicate);
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: uuidv4(),
        x: elementToDuplicate.x + 10,
        y: elementToDuplicate.y + 10,
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement);
    }
    setContextMenu(null);
  };

  const applyClippingMask = () => {
    if (selectedElementsForClipping.length !== 2) return;

    const [id1, id2] = selectedElementsForClipping;
    const el1 = elements.find((e) => e.id === id1);
    const el2 = elements.find((e) => e.id === id2);

    const shape =
      el1.type !== "image" && el1.type !== "gif" && el1.type !== "video"
        ? el1
        : el2;
    const content = el1 === shape ? el2 : el1;

    if (!shape || !content) return;

    const groupId = uuidv4();
    const newGroup = {
      id: groupId,
      type: "group",
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
    };

    const updatedElements = elements.map((el) => {
      if (el.id === shape.id) {
        return {
          ...el,
          groupId: groupId,
          isClippingMask: true,
          // x: el.x - newGroup.x,
          // y: el.y - newGroup.y,
        };
      }
      if (el.id === content.id) {
        return {
          ...el,
          groupId: groupId,
          // x: el.x - newGroup.x,
          // y: el.y - newGroup.y,
        };
      }
      return el;
    });

    setElements([...updatedElements, newGroup]);
    setSelectedElementsForClipping([]);
    setContextMenu(null);
  };

  const releaseClippingMask = (elementId) => {
    const element = elements.find((el) => el.id === elementId);
    if (!element || !element.groupId) return;

    const groupId = element.groupId;
    const group = elements.find((el) => el.id === groupId);

    const updatedElements = elements
      .map((el) => {
        if (el.groupId === groupId) {
          const { groupId, isClippingMask, ...rest } = el;
          return { ...rest, x: el.x + group.x, y: el.y + group.y };
        }
        return el;
      })
      .filter((el) => el.id !== groupId);

    setElements(updatedElements);
    setContextMenu(null);
  };

  const handleContextMenu = (e, elementId) => {
    let event = e;
    if (e?.evt) {
      event = e?.evt;
    }
    event.preventDefault();
    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      elementId: elementId,
    });
  };

  const handleCanvasClick = () => {
    setContextMenu(null);
  };

  const handleSelectElement = (element, event) => {
    if (!element) {
      setSelectedElement(null);
      setSelectedElementsForClipping([]);
      return;
    }

    const isMultiSelect =
      event && (event.ctrlKey || event.metaKey || event.shiftKey);

    if (isMultiSelect) {
      setSelectedElementsForClipping((prev) => {
        if (prev.includes(element.id)) {
          // Deselect if already selected
          return prev.filter((id) => id !== element.id);
        } else {
          // Select if not already selected
          return [...prev, element.id];
        }
      });
    } else {
      // Single select: clear all previous and select current
      setSelectedElementsForClipping([element.id]);
    }
    setSelectedElement(element); // Always set the last clicked as the primary selected element
  };

  const onReorderElements = (startIndex, endIndex) => {
    const reorderedElements = Array.from(elements);
    const [removed] = reorderedElements.splice(startIndex, 1);
    reorderedElements.splice(endIndex, 0, removed);

    setElements(reorderedElements);
  };

  const exportCanvas = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "poster.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveTemplate = () => {
    const template = JSON.stringify(elements);
    prompt("Copy this template JSON:", template);
  };

  const loadTemplate = () => {
    const template = prompt("Paste template JSON here:");
    try {
      const parsedTemplate = JSON.parse(template);
      setElements(parsedTemplate);
      setSelectedElement(null);
    } catch (e) {
      alert("Invalid JSON template!");
    }
  };

  const toggleLayersPanel = () => {
    setShowLayersPanel(!showLayersPanel);
  };

  return (
    <div className="App" onClick={handleCanvasClick}>
      <div className="main-container">
        <Toolbar
          addElement={addElement}
          exportCanvas={exportCanvas}
          saveTemplate={saveTemplate}
          loadTemplate={loadTemplate}
          toggleLayersPanel={toggleLayersPanel}
        />
        {showLayersPanel && (
          <LayersPanel
            elements={elements}
            selectedElement={selectedElement}
            setSelectedElement={handleSelectElement}
            onContextMenu={handleContextMenu}
            selectedElementsForClipping={selectedElementsForClipping}
            onReorderElements={onReorderElements}
            updateElement={updateElement}
          />
        )}
        <Canvas
          elements={elements}
          selectedElement={selectedElement}
          setSelectedElement={handleSelectElement}
          updateElement={updateElement}
          stageRef={stageRef}
          onContextMenu={handleContextMenu}
          canvasBackgroundColor={canvasBackgroundColor}
        />
        <PropertiesPanel
          selectedElement={selectedElement}
          updateElement={updateElement}
          canvasBackgroundColor={canvasBackgroundColor}
          setCanvasBackgroundColor={setCanvasBackgroundColor}
        />
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          elementId={contextMenu.elementId}
          onDelete={() => deleteElement(contextMenu.elementId)}
          onDuplicate={() => duplicateElement(contextMenu.elementId)}
          onApplyClippingMask={applyClippingMask}
          onReleaseClippingMask={() =>
            releaseClippingMask(contextMenu.elementId)
          }
          canApplyClippingMask={selectedElementsForClipping.length === 2}
          isElementClipped={
            !!elements.find((el) => el.id === contextMenu.elementId)?.groupId
          }
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default App;