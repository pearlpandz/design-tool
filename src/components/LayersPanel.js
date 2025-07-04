import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const getLayerIcon = (type) => {
  switch (type) {
    case 'rect':
      return '⬛';
    case 'square':
      return '🟦';
    case 'circle':
      return '🔵';
    case 'line':
      return '➖';
    case 'text':
      return '🅰️';
    case 'image':
      return '🖼️';
    case 'gif':
      return '🎞️';
    case 'video':
      return '🎥';
    case 'polygon':
      return '🔺';
    default:
      return '❓';
  }
};

const LayersPanel = ({ elements, selectedElement, setSelectedElement, onContextMenu, selectedElementsForClipping, onReorderElements }) => {
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    onReorderElements(result.source.index, result.destination.index);
  };

  return (
    <div className="layers-panel">
      <h3>Layers</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="layers">
          {(provided) => (
            <ul
              className="layers-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {elements.map((element, index) => (
                <Draggable key={element.id} draggableId={element.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      onClick={(e) => setSelectedElement(element, e)}
                      onContextMenu={(e) => onContextMenu(e, element.id)}
                      className={`
                        ${selectedElement && selectedElement.id === element.id ? 'selected-layer' : ''}
                        ${selectedElementsForClipping.includes(element.id) ? 'multi-selected-layer' : ''}
                        ${element.clipMaskId ? 'clipped-content' : ''}
                        ${element.isClippingMask ? 'clipping-mask' : ''}
                        ${snapshot.isDragging ? 'dragging' : ''}
                      `}
                    >
                      <span className="drag-handle" {...provided.dragHandleProps}>☰</span>
                      <span className="layer-icon">{getLayerIcon(element.type)}</span>
                      {element.type} - {element.id.substring(0, 4)}
                      {element.clipMaskId && <span className="clip-indicator"> (Clipped by {element.clipMaskId.substring(0, 4)})</span>}
                      {element.isClippingMask && <span className="clip-indicator"> (Mask)</span>}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default LayersPanel;
