import React from 'react';

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

const LayersPanel = ({ elements, selectedElement, setSelectedElement, onContextMenu, selectedElementsForClipping }) => {
  return (
    <div className="layers-panel">
      <h3>Layers</h3>
      <ul>
        {elements.map((element) => (
          <li
            key={element.id}
            onClick={(e) => setSelectedElement(element, e)} // Pass event object
            onContextMenu={(e) => onContextMenu(e, element.id)}
            className={`
              ${selectedElement && selectedElement.id === element.id ? 'selected-layer' : ''}
              ${selectedElementsForClipping.includes(element.id) ? 'multi-selected-layer' : ''} /* New class for multi-selection */
              ${element.clipMaskId ? 'clipped-content' : ''}
              ${element.isClippingMask ? 'clipping-mask' : ''}
            `}
          >
            <span className="layer-icon">{getLayerIcon(element.type)}</span>
            {element.type} - {element.id.substring(0, 4)}
            {element.clipMaskId && <span className="clip-indicator"> (Clipped by {element.clipMaskId.substring(0, 4)})</span>}
            {element.isClippingMask && <span className="clip-indicator"> (Mask)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LayersPanel;