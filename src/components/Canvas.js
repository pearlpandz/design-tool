import React, { useRef, useEffect } from "react";
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

const VideoElement = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onContextMenu,
  getElementById,
}) => {
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const trRef = useRef(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = shapeProps.src;
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.crossOrigin = "anonymous";
    video.addEventListener("loadedmetadata", () => {
      imageRef.current.width(video.videoWidth);
      imageRef.current.height(video.videoHeight);
      imageRef.current.getLayer().batchDraw();
    });
    video.addEventListener("timeupdate", () => {
      imageRef.current.getLayer().batchDraw();
    });
    videoRef.current = video;

    if (shapeProps.isPlaying) {
      video.play();
    } else {
      video.pause();
    }

    return () => {
      video.pause();
      video.removeEventListener("loadedmetadata", () => {});
      video.removeEventListener("timeupdate", () => {});
    };
  }, [shapeProps.src, shapeProps.isPlaying]);

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const dx = newX - shapeProps.x;
    const dy = newY - shapeProps.y;

    // Update content element's position
    onChange(shapeProps.id, { x: newX, y: newY });

    // If clipped, also move the mask element
    if (shapeProps.clipMaskId) {
      const maskElement = getElementById(shapeProps.clipMaskId);
      if (maskElement) {
        onChange(maskElement.id, {
          x: maskElement.x + dx,
          y: maskElement.y + dy,
        });
      }
    }
  };

  const handleTransformEnd = () => {
    const node = imageRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    const newX = node.x();
    const newY = node.y();
    const newWidth = Math.max(5, node.width() * scaleX);
    const newHeight = Math.max(5, node.height() * scaleY);

    // Update content element's size and position
    onChange(shapeProps.id, {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });

    // If clipped, also transform the mask element
    if (shapeProps.clipMaskId) {
      const maskElement = getElementById(shapeProps.clipMaskId);
      if (maskElement) {
        onChange(maskElement.id, {
          x: maskElement.x + (newX - shapeProps.x), // Adjust mask x by content's x change
          y: maskElement.y + (newY - shapeProps.y), // Adjust mask y by content's y change
          width: Math.max(5, maskElement.width * scaleX),
          height: Math.max(5, maskElement.height * scaleY),
        });
      }
    }
  };

  return (
    <>
      <KonvaImage
        image={videoRef.current}
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.width}
        height={shapeProps.height}
        draggable={isSelected} // Make draggable only if selected
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={onSelect}
        onTap={onSelect}
        onContextMenu={(e) => onContextMenu(e, shapeProps.id)}
        ref={imageRef}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const Shape = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onContextMenu,
  getElementById,
}) => {
  const shapeRef = useRef();
  const trRef = useRef();

  const [image] = useImage(shapeProps.src);

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleDragEnd = (e) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const dx = newX - shapeProps.x;
    const dy = newY - shapeProps.y;

    // Update content element's position
    onChange(shapeProps.id, { x: newX, y: newY });

    // If clipped, also move the mask element
    if (shapeProps.clipMaskId) {
      const maskElement = getElementById(shapeProps.clipMaskId);
      if (maskElement) {
        onChange(maskElement.id, {
          x: maskElement.x + dx,
          y: maskElement.y + dy,
        });
      }
    }
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    const newX = node.x();
    const newY = node.y();
    const newWidth = Math.max(5, node.width() * scaleX);
    const newHeight = Math.max(5, node.height() * scaleY);

    // Update content element's size and position
    onChange(shapeProps.id, {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    });

    // If clipped, also transform the mask element
    if (shapeProps.clipMaskId) {
      const maskElement = getElementById(shapeProps.clipMaskId);
      if (maskElement) {
        onChange(maskElement.id, {
          x: maskElement.x + (newX - shapeProps.x), // Adjust mask x by content's x change
          y: maskElement.y + (newY - shapeProps.y), // Adjust mask y by content's y change
          width: Math.max(5, maskElement.width * scaleX),
          height: Math.max(5, maskElement.height * scaleY),
        });
      }
    }
  };

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
    case "image":
    case "gif":
      KonvaShape = KonvaImage;
      break;
    case "polygon":
      KonvaShape = RegularPolygon;
      break;
    default:
      return null;
  }

  if (shapeProps.type === "video") {
    return (
      <VideoElement
        shapeProps={shapeProps}
        isSelected={isSelected}
        onSelect={onSelect}
        onChange={onChange}
        onContextMenu={onContextMenu}
        getElementById={getElementById}
      />
    );
  }

  const renderShape = () => (
    <KonvaShape
      onClick={(e) => onSelect(shapeProps, e)}
      onTap={(e) => onSelect(shapeProps, e)}
      onContextMenu={(e) => onContextMenu(e, shapeProps.id)}
      ref={shapeRef}
      {...shapeProps}
      image={
        shapeProps.type === "image" || shapeProps.type === "gif"
          ? image
          : undefined
      }
      draggable={isSelected} // Make draggable only if selected
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    />
  );

  if (shapeProps.clipMaskId) {
    const maskElement = getElementById(shapeProps.clipMaskId);
    if (!maskElement) return null;

    const clipFunc = (ctx) => {
      ctx.beginPath();
      if (maskElement.type === "rect" || maskElement.type === "square") {
        ctx.rect(
          maskElement.x,
          maskElement.y,
          maskElement.width,
          maskElement.height
        );
      } else if (maskElement.type === "circle") {
        ctx.arc(
          maskElement.x,
          maskElement.y,
          maskElement.radius || maskElement.width / 2,
          0,
          Math.PI * 2
        );
      } else if (maskElement.type === "polygon") {
        const points = maskElement.points;
        if (points && points.length >= 2) {
          ctx.moveTo(maskElement.x + points[0], maskElement.y + points[1]);
          for (let i = 2; i < points.length; i += 2) {
            ctx.lineTo(
              maskElement.x + points[i],
              maskElement.y + points[i + 1]
            );
          }
          ctx.closePath();
        }
      }
      ctx.clip();
    };

    return (
      <Group clipFunc={clipFunc}>
        {renderShape()}
        {isSelected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
      </Group>
    );
  }

  return (
    <>
      {renderShape()}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
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
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedElement(null, e);
    }
  };

  const getElementById = (id) => elements.find((el) => el.id === id);

  return (
    <Stage
      width={600}
      height={600}
      onClick={(e) => setSelectedElement(null, e)}
      onTap={(e) => setSelectedElement(null, e)}
      onContextMenu={(e) => {
        e.preventDefault();
        if (e.target !== e.target.getStage()) {
          onContextMenu(e, e.target.id());
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
        {elements.map((element) => {
          if (element.isClippingMask) return null;

          return (
            <Shape
              key={element.id}
              shapeProps={element}
              isSelected={
                element.id === (selectedElement && selectedElement.id)
              }
              onSelect={setSelectedElement}
              onChange={updateElement}
              onContextMenu={onContextMenu}
              getElementById={getElementById}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default Canvas;
