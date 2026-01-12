import React, { useEffect, useRef } from "react";
import "../styles/Canvas.css";
import { brushHandlers } from "./brushes";

const Canvas = React.forwardRef(
  (
    {
      width = 800,
      height = 600,
      color,
      brushSize,
      brushType = "default",
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
    };

    const handleMouseUp = () => {
      isDrawingRef.current = false;
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
