import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { MdDragHandle } from "react-icons/md";

const getLayerIcon = (type) => {
  switch (type) {
    case "rect":
      return "⬛";
    case "square":
      return "🟦";
    case "circle":
      return "🔵";
    case "line":
      return "➖";
    case "text":
      return "🅰️";
    case "image":
      return "🖼️";
    case "gif":
      return "🎞️";
    case "video":
      return "🎥";
    case "polygon":
      return "🔺";
    case "group":
      return "📁";
    default:
      return "❓";
  }
};

const Layer = ({ element, index, children, updateElement, ...props }) => {
  return (
    <Draggable key={element.id} draggableId={element.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            // Add z-index to the dragging item to ensure it's on top
            zIndex: snapshot.isDragging ? 9999 : "auto",
          }}
        >
          <li
            onClick={(e) => props.setSelectedElement(element, e)}
            onContextMenu={(e) => props.onContextMenu(e, element.id)}
            className={`
              layer-item
              ${
                props.selectedElement?.id === element.id ? "selected-layer" : ""
              }
              ${
                props.selectedElementsForClipping.includes(element.id)
                  ? "multi-selected-layer"
                  : ""
              }
              ${snapshot.isDragging ? "dragging" : ""}
            `}
          >
            <span className="drag-handle" {...provided.dragHandleProps}>
              <MdDragHandle />
            </span>
            {element.type === "group" && (
              <span
                className="collapse-toggle"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent selecting the group when toggling
                  updateElement(element.id, {
                    isCollapsed: !element.isCollapsed,
                  });
                }}
              >
                {element.isCollapsed ? <FaCaretRight /> : <FaCaretDown />}
              </span>
            )}
            <span className="layer-icon">{getLayerIcon(element.type)}</span>
            {element.type} - {element.slug || element.id.substring(0, 4)}
            {element.isClippingMask && (
              <span className="clip-indicator"> (Mask)</span>
            )}
          </li>
          {children && !element.isCollapsed && (
            <Droppable droppableId={element.id} type="group-child">
              {(provided) => (
                <ul
                  className="nested-layers"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {children}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );
};

const LayersPanel = ({
  elements,
  onReorderElements,
  updateElement,
  ...props
}) => {
  const onDragEnd = (result) => {
    onReorderElements(result);
  };

  const renderLayer = (element, index) => {
    if (element.type === "group") {
      const children = elements.filter((e) => e.groupId === element.id);
      return (
        <Layer
          key={element.id}
          element={element}
          index={index}
          updateElement={updateElement}
          {...props}
        >
          {children.map((child, childIndex) => (
            <Layer
              key={child.id}
              element={child}
              index={childIndex}
              updateElement={updateElement}
              {...props}
            />
          ))}
        </Layer>
      );
    }

    if (!element.groupId) {
      return (
        <Layer key={element.id} element={element} index={index} {...props} />
      );
    }

    return null;
  };

  const topLevelElements = elements.filter((el) => !el.groupId);

  return (
    <div className="layers-panel">
      <h3>Layers</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="root" type="top-level">
          {(provided) => (
            <ul
              className="layers-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {topLevelElements.map((element, index) =>
                renderLayer(element, index)
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default LayersPanel;
