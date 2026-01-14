import React, { useEffect, useRef } from "react";
import "../styles/Canvas.css";
import { brushHandlers } from "./brushes";

const Canvas = React.forwardRef(
  (
    {
      color,
      brushSize,
      brushType = "default",
      onSaveState,
      historyImage,
      width,
      height,
      zoom = 1,
      isEraser, // <--- Added prop
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


    const drawWatermark = (ctx) => {
      ctx.save();
      // Setup Text
      ctx.font = "bold 30px Arial";
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Rotate around center
      ctx.translate(width / 2, height / 2);
      ctx.rotate(-Math.PI / 4); // -45 degrees
      ctx.translate(-width / 2, -height / 2);

      // Grid loop to cover the canvas (including rotation buffer)
      const diagonal = Math.sqrt(width * width + height * height);
      const spacingX = 150; // Horizontal space between words
      const spacingY = 100; // Vertical space between lines

      // Loop over a large area to ensure coverage after rotation
      for (let x = -diagonal; x < width + diagonal; x += spacingX) {
        for (let y = -diagonal; y < height + diagonal; y += spacingY) {
          ctx.fillText("PAINT", x, y);
        }
      }

      ctx.restore();
    };

    // 1. Generate Watermark Background (Css Layer)
    useEffect(() => {
      const canvas = canvasRef.current;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext("2d");

      // Fill White Base for Background
      tempCtx.fillStyle = "#ffffff";
      tempCtx.fillRect(0, 0, width, height);
      drawWatermark(tempCtx);

      canvas.style.backgroundImage = `url(${tempCanvas.toDataURL()})`;
      canvas.style.backgroundSize = "cover";
    }, [width, height]);

    // 2. Init Canvas (Transparent)
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      // context.fillStyle = "#ffffff";
      // context.fillRect(0, 0, canvas.width, canvas.height);

      // drawWatermark(context);

      // Clear to Transparent
      context.clearRect(0, 0, width, height);

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
      const height = end.y - end.y;

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
        x: e.nativeEvent.offsetX / zoom,
        y: e.nativeEvent.offsetY / zoom,
      };
      lastPositionRef.current = currentPosition;
      isDrawingRef.current = true;
    };

    const handleMouseMove = (e) => {
      if (!isDrawingRef.current) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // === ERASER UPDATE ===
      // If brushType is 'eraser' (or special eraser mode), use 'destination-out'
      if (isEraser) {
        // New Logic: Erase to Transparent
        context.globalCompositeOperation = "destination-out";
      } else {
        context.globalCompositeOperation = "source-over";
      }

      /*
      if (isEraser) {
        context.globalCompositeOperation = "destination-out";
      } else {
        context.globalCompositeOperation = "source-over";
      }
      */

      const currentPosition = {
        x: e.nativeEvent.offsetX / zoom,
        y: e.nativeEvent.offsetY / zoom,
      };

      if (brushType === "rectangle" || brushType === "circle") {
        // Shape logic...
        context.clearRect(0, 0, width, height);

        if (historyImage) {
          const img = new Image();
          img.src = historyImage;
          context.drawImage(img, 0, 0);
        }

        // Reset composite operation for shapes just in case
        context.globalCompositeOperation = "source-over";

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

        // Reset composite operation after drawing
        context.globalCompositeOperation = "source-over";
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
        width={width}
        height={height}
        style={{
          width: `${width * zoom}px`,
          height: `${height * zoom}px`,
          background: "white",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)",
        }}
      ></canvas>
    );
  }
);

export default Canvas;
