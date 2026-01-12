import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import CodeEditor from "./components/CodeEditor";

function App() {
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(10);
  const [brushType, setBrushType] = useState("default");

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
          width={800}
          height={600}
          color={color}
          brushSize={brushSize}
          brushType={brushType}
        />
        <div
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
          <select value={brushType} onChange={(e) => setBrushType(e.target.value)}>
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
        </div>
      </section>
      {/* <section className='file-structure'> file system</section> */}
      <footer className="footer">User: Guest are here</footer>
    </div>
  );
}

export default App;
