import React, { useRef, useEffect, forwardRef } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Text,
  Transformer,
  Image as KonvaImage,
  RegularPolygon,
  Group,
} from "react-konva";
import useImage from "use-image";

const GeneralShape = forwardRef((props, ref) => {
  const { shapeProps, onSelect, onContextMenu } = props;
  let KonvaShape;
  switch (shapeProps.type) {
    case "rect":
    case "square":
      KonvaShape = Rect;
      break;
    case "circle":
      KonvaShape = Circle;
      break;
    case "line":
      KonvaShape = Line;
      break;
    case "text":
      KonvaShape = Text;
      break;
    case "polygon":
      KonvaShape = RegularPolygon;
      break;
    default:
      return null;
  }
  return (
    <KonvaShape
      ref={ref}
      {...shapeProps}
      onClick={(e) => {
        onSelect(shapeProps, e);
        e.cancelBubble = true;
      }}
      onTap={(e) => {
        onSelect(shapeProps, e);
        e.cancelBubble = true;
      }}
      onContextMenu={(e) => onContextMenu(e, shapeProps.id)}
    />
  );
});

const ImageBasedShape = forwardRef((props, ref) => {
  const { shapeProps, onSelect, onContextMenu } = props;
  const [image] = useImage(shapeProps.src, "anonymous");
  const videoRef = useRef(null);

  useEffect(() => {
    if (shapeProps.type === "video") {
      const video = document.createElement("video");
      video.src = shapeProps.src;
      video.loop = true;
      video.muted = true;
      video.autoplay = true;
      video.crossOrigin = "anonymous";
      video.addEventListener("timeupdate", () => {
        if (ref && ref.current) {
          ref.current.getLayer().batchDraw();
        }
      });
      videoRef.current = video;
    }
  }, [shapeProps.src, shapeProps.type, ref]);

  return (
    <KonvaImage
      ref={ref}
      {...shapeProps}
      image={shapeProps.type === "video" ? videoRef.current : image}
      onClick={(e) => {
        onSelect(shapeProps, e);
        e.cancelBubble = true;
      }}
      onTap={(e) => {
        onSelect(shapeProps, e);
        e.cancelBubble = true;
      }}
      onContextMenu={(e) => onContextMenu(e, shapeProps.id)}
    />
  );
});

const Shape = forwardRef((props, ref) => {
  const { shapeProps } = props;
  if (
    shapeProps.type === "image" ||
    shapeProps.type === "gif" ||
    shapeProps.type === "video"
  ) {
    return <ImageBasedShape ref={ref} {...props} />;
  }
  return <GeneralShape ref={ref} {...props} />;
});

const ElementRenderer = ({
  element,
  elements,
  isSelected,
  onSelect,
  onChange,
  onContextMenu,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const maskRef = useRef();

  useEffect(() => {
    if (
      element.type === "group" &&
      isSelected &&
      trRef.current &&
      maskRef.current
    ) {
      trRef.current.nodes([maskRef.current]);
      trRef.current.getLayer().batchDraw();
    } else if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, element.type]);

  const handleDragEnd = (e) => {
    onChange(element.id, { x: e.target.x(), y: e.target.y() });
  };

  const handleTransformEnd = () => {
    if (element.type === "group") {
      const node = shapeRef.current;
      if (!node) return;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);

      // Scale all children (including mask)
      const groupChildren = elements.filter((el) => el.groupId === element.id);
      groupChildren.forEach((child) => {
        let newProps = { ...child };
        newProps.x = (child.x - element.x) * scaleX + element.x;
        newProps.y = (child.y - element.y) * scaleY + element.y;
        if (child.width) newProps.width = child.width * scaleX;
        if (child.height) newProps.height = child.height * scaleY;
        if (child.radius)
          newProps.radius = child.radius * Math.max(scaleX, scaleY);
        // For polygons, scale radius
        if (child.type === "polygon" && child.radius) {
          newProps.radius = child.radius * Math.max(scaleX, scaleY);
        }
        // For lines, scale points
        if (child.type === "line" && Array.isArray(child.points)) {
          newProps.points = child.points.map((val, idx) =>
            idx % 2 === 0
              ? (val - element.x) * scaleX + element.x
              : (val - element.y) * scaleY + element.y
          );
        }
        onChange(child.id, newProps);
      });
      // Force group re-render to update mask for clipping
      onChange(element.id, {
        x: node.x(),
        y: node.y(),
        _version: Date.now(), // dummy property to force re-render
      });
      return;
    }
    const node = shapeRef.current;
    if (!node) return;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    onChange(element.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, (element.width || node.width()) * scaleX),
      height: Math.max(5, (element.height || node.height()) * scaleY),
    });
  };

  if (element.type === "group") {
    const groupChildren = elements.filter((el) => el.groupId === element.id);
    // Always get the latest mask from elements (not from groupChildren)
    const mask = elements.find(
      (el) => el.groupId === element.id && el.isClippingMask
    );

    if (!mask) return null;

    const clipFunc = (ctx) => {
      ctx.beginPath();
      if (mask.type === "rect" || mask.type === "square") {
        ctx.rect(mask.x, mask.y, mask.width, mask.height);
      } else if (mask.type === "circle") {
        ctx.arc(mask.x, mask.y, mask.radius, 0, Math.PI * 2);
      } else if (mask.type === "polygon") {
        const sides = mask.sides;
        const radius = mask.radius;
        const centerX = mask.x;
        const centerY = mask.y;
        ctx.moveTo(
          centerX + radius * Math.cos(0),
          centerY + radius * Math.sin(0)
        );
        for (let i = 1; i <= sides; i++) {
          const angle = (i * 2 * Math.PI) / sides;
          ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
          );
        }
        ctx.closePath();
      }
      ctx.clip();
    };

    return (
      <>
        <Group
          ref={shapeRef}
          {...element}
          draggable={isSelected}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          onClick={(e) => {
            onSelect(element, e);
            e.cancelBubble = true;
          }}
          onTap={(e) => {
            onSelect(element, e);
            e.cancelBubble = true;
          }}
          onContextMenu={(e) => onContextMenu(e, element.id)}
          clipFunc={clipFunc}
        >
          {groupChildren.map((child) => (
            <Shape
              key={child.id}
              ref={child.isClippingMask ? maskRef : undefined}
              shapeProps={child}
              onSelect={() => onSelect(element)}
              onContextMenu={onContextMenu}
            />
          ))}
        </Group>
        {isSelected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) return oldBox;
              return newBox;
            }}
            nodes={maskRef.current ? [maskRef.current] : []}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Shape
        ref={shapeRef}
        shapeProps={{
          ...element,
          draggable: isSelected,
          onDragEnd: handleDragEnd,
          onTransformEnd: handleTransformEnd,
        }}
        onSelect={onSelect}
        onContextMenu={onContextMenu}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

const Canvas = ({
  elements,
  selectedElement,
  setSelectedElement,
  updateElement,
  stageRef,
  onContextMenu,
  canvasBackgroundColor,
}) => {
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedElement(null);
    }
  };

  const topLevelElements = elements.filter((el) => !el.groupId);

  return (
    <Stage
      width={600}
      height={600}
      onClick={handleStageClick}
      onTap={handleStageClick}
      onContextMenu={(e) => {
        let event = e;
        if (e?.evt) {
          event = e?.evt;
        }
        event.preventDefault();
        if (e.target !== e.target.getStage()) {
          onContextMenu(e, e.target.attrs.id);
        }
      }}
      ref={stageRef}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={600}
          height={600}
          fill={canvasBackgroundColor}
        />
        {topLevelElements.map((element) => (
          <ElementRenderer
            key={element.id}
            element={element}
            elements={elements}
            isSelected={selectedElement && selectedElement.id === element.id}
            onSelect={setSelectedElement}
            onChange={updateElement}
            onContextMenu={onContextMenu}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
