import React, { useEffect, useRef } from "react";
import "../styles/Canvas.css";
import { brushHandlers } from "./brushes";

const Canvas = React.forwardRef(
  (
    {
      width,
      height,
      color,
      brushSize,
      brushType = "default",
      onSaveState,
      historyImage,
    },
    forwardedRef
  ) => {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const lastPositionRef = useRef({ x: 0, y: 0 });
    const lastTimeRef = useRef(0);

    useEffect(() => {
      if (forwardedRef) {
        forwardedRef.current = canvasRef.current;
      }
    }, [forwardedRef]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = "black";
      context.lineWidth = 5;
    }, [width, height]);

    useEffect(() => {
      if (historyImage) {
        const context = canvasRef.current.getContext("2d");
        const img = new Image();
        img.src = historyImage;
        img.onload = () => {
          context.clearRect(0, 0, width, height);
          context.drawImage(img, 0, 0);
        };
      }
    }, [historyImage, width, height]);

    const drawShape = (context, start, end, type, color) => {
      context.beginPath();
      context.strokeStyle = color;
      context.fillStyle = color;
      const width = end.x - end.x;
      const height = (end.y = end.y);

      if (type === "rectangle") {
        context.strokeRect(start.x, start.y, width, height);
      } else if (type === "circle") {
        const radius = Math.sqrt(width * width + height * height);
        context.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        context.stroke();
      }
    };

    const handleMouseDown = (e) => {
      const currentPosition = {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      };
      lastPositionRef.current = currentPosition;
      isDrawingRef.current = true;
    };

    const handleMouseMove = (e) => {
      if (!isDrawingRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      const currentPosition = {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
      };

      if (brushType === "rectangle" || brushType === "circle") {
        context.clearRect(0, 0, width, height);

        if (historyImage) {
          const img = new Image();
          img.src = historyImage;
          context.drawImage(img, 0, 0);
        }
        drawShape(
          context,
          lastPositionRef.current,
          currentPosition,
          brushType,
          color
        );
      } else {
        const brushHandler = brushHandlers[brushType] || brushHandlers.default;

        brushHandler(context, {
          start: lastPositionRef.current,
          end: currentPosition,
          color,
          size: brushSize,
          lastTime: lastTimeRef.current,
        });

        lastPositionRef.current = currentPosition;
        lastTimeRef.current = Date.now();
        //   context.beginPath();
        //   context.moveTo(lastPositionRef.current.x, lastPositionRef.current.y);
        //   context.lineTo(currentPosition.x, currentPosition.y);
        //   context.stroke();

        //   lastPositionRef.current = currentPosition;
      }
    };

    const handleMouseUp = () => {
      isDrawingRef.current = false;
      if (onSaveState) {
        onSaveState(canvasRef.current.toDataURL());
      }
    };

    return (
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="canvas"
      ></canvas>
    );
  }
);

export default Canvas;
