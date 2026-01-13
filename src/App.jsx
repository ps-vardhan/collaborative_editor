import { Box, Flex } from "@chakra-ui/react";
import { useRef, useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import CodeEditor from "./components/CodeEditor";
import ToolBar from "./components/ToolBar";

function App() {
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(10);
  const [brushType, setBrushType] = useState("default");
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const canvasRef = useRef(null);
  const [isEraser, setIsEraser] = useState(false);

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
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvasRef.current.toDataUrl();
    link.click();
  };
  return (
    <div className="app-layout">
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
      <section className="right-panel">
        <Canvas
          ref={canvasRef}
          width={800}
          height={600}
          // color={color}
          brushSize={brushSize}
          brushType={brushType}
          onSaveState={handleSaveState}
          historyImage={history[historyStep]}
          color={isEraser ? "#ffffff" : color}
        />
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
        />
      </section>
      {/* <section className='file-structure'> file system</section> */}
      <footer className="footer">User: Guest are here</footer>
    </div>
  );
}

export default App;
