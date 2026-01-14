import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import CodeEditor from "./components/CodeEditor";
import ToolBar from "./components/ToolBar";
const CANVAS_WIDTH = 1123;
const CANVAS_HEIGHT = 794;

function App() {
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(10);
  const [brushType, setBrushType] = useState("default");
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const canvasRef = useRef(null);
  const [isEraser, setIsEraser] = useState(false);
  const [leftWidth, setLeftWidth] = useState(70);
  const isDragging = useRef(false);
  const [zoom, setZoom] = useState(1.0);
  const scrollRef = useRef(null);

  const startResize = () => {
    isDragging.current = true;
  };
  const stopResize = () => {
    isDragging.current = false;
  };

  const resize = (e) => {
    if (isDragging.current) {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;

      setTimeout(() => {
        const x = (container.scrollWidth - container.clientWidth) / 2;
        const y = (container.scrollHeight - container.clientHeight) / 2;

        container.scroll(x, y);
      }, 100);
    }
  }, []);
  const handleSaveState = (dataUrl) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const toggleEraser = () => {
    setIsEraser((prev) => !prev);
    if (!isEraser) setBrushType("default");
  };

  const handleUndo = () => {
    if (historyStep > 0) setHistoryStep((prev) => prev - 1);
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) setHistoryStep((prev) => prev + 1);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      handleSaveState();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;

    // Create a temp canvas to composite Background + Drawing
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext("2d");

    // 1. Fill White Base
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Watermark (Re-using logic here is tricky without export, so we duplicate or assume it's set. 
    //    Actually, we can just grab the computed background from the canvas element style if we want?
    //    Or simpler: just re-implement the simple watermark loop here for the save file.)

    // ... Re-implementing simplified watermark loop for Save ...
    ctx.save();
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 4);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
    for (let x = -diagonal; x < canvas.width + diagonal; x += 150) {
      for (let y = -diagonal; y < canvas.height + diagonal; y += 100) {
        ctx.fillText("PAINT", x, y);
      }
    }
    ctx.restore();

    // 3. Draw the Ink (which has transparency) over the Watermark
    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = tempCanvas.toDataURL(); // Save the composite
    link.click();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          setZoom((z) => Math.min(3, z + 0.1));
        }
        if (e.key === "-") {
          e.preventDefault();
          setZoom((z) => Math.max(0.5, z - 0.1));
        }
        if (e.key === "0") {
          e.preventDefault();
          setZoom(1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div
      className="app-layout"
      style={{ gridTemplateColumns: `${leftWidth}% 5px 1fr` }}
    >
      <section className="left-panel">
        <Flex
          direction="column"
          height="100%"
          bg="#0f0a19"
          color="gray.500"
          px={6}
          py={8}
        >
          <Box flex="1" overflow="hidden">
            <CodeEditor />
          </Box>
        </Flex>
      </section>
      <div
        className="resize-handle"
        onMouseDown={startResize}
        style={{ cursor: "col-resize", background: "#444" }}
      />
      <section
        className="right-panel"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <div
          className="canvas-scroll-area"
          ref={scrollRef}
          style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "50px",
            background: "#e2e8f0",
          }}
        >
          <Canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            zoom={zoom}
            // color={color}
            brushSize={brushSize}
            brushType={brushType}
            onSaveState={handleSaveState}
            historyImage={history[historyStep]}
            color={isEraser ? "#ffffff" : color}
            isEraser={isEraser}
          />
        </div>
        {/* <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "white",
            padding: 10,
          }}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
          <select
            value={brushType}
            onChange={(e) => setBrushType(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="calligraphy">Calligraphy</option>
            <option value="splatter">Splatter</option>
            <option value="fire">Fire</option>
            <option value="neon">Neon</option>
            <option value="swirl">Swirl</option>
            <option value="feather">Feather</option>
            <option value="drip">Drip</option>
            <option value="watercolor">Watercolor</option>
            <option value="foam">Foam</option>
            <option value="glitch">Glitch</option>
            <option value="scribble">Scribble</option>
          </select>
        </div> */}

        <ToolBar
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          brushType={brushType}
          setBrushType={setBrushType}
          handleUndo={handleUndo}
          canUndo={historyStep > 0}
          handleRedo={handleRedo}
          canRedo={historyStep < history.length - 1}
          handleClear={handleClear}
          handleSave={handleSave}
          isEraser={isEraser}
          toggleEraser={toggleEraser}
          zoom={zoom}
          setZoom={setZoom}
        />
      </section>
      {/* <section className='file-structure'> file system</section> */}
      <footer className="footer">User: Guest are here</footer>
    </div>
  );
}

export default App;
