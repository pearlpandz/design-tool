
import React from 'react';

const ContextMenu = ({ x, y, elementId, onDelete, onDuplicate, onApplyClippingMask, onReleaseClippingMask, canApplyClippingMask, isElementClipped, onClose }) => {
  return (
    <div
      className="context-menu"
      style={{ top: y, left: x }}
      onMouseLeave={onClose} // Close when mouse leaves the menu
    >
      <div className="context-menu-item" onClick={onDuplicate}>
        Duplicate
      </div>
      <div className="context-menu-item" onClick={onDelete}>
        Delete
      </div>
      {canApplyClippingMask && (
        <div className="context-menu-item" onClick={onApplyClippingMask}>
          Apply Clipping Mask
        </div>
      )}
      {isElementClipped && (
        <div className="context-menu-item" onClick={onReleaseClippingMask}>
          Release Clipping Mask
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
