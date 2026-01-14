import {
  Box,
  Button,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";

const ToolBar = ({
  color,
  setColor,
  brushSize,
  setBrushSize,
  brushType,
  setBrushType,
  handleClear,
  isEraser,
  toggleEraser,
  // handleUndo, // <--- COMMENTED OUT PROPS
  // canUndo,
  // handleRedo,
  // canRedo,
  // handleSave,
  // zoom,
  // setZoom,
}) => {
  return (
    <Box
      position="absolute"
      top="20px" // <--- TOP
      right="20px" // <--- RIGHT
      left="auto" // <--- UNSET LEFT
      transform="none" // <--- UNSET TRANSFORM
      zIndex={100}
      display="flex"
      flexDirection="column"
      gap={2}
      p={3}
      backdropFilter="blur(12px)"
      bg="rgba(20,20,20,0.6)"
      border="1px solid rgba(255,255,255,0.1)"
      borderRadius="xl"
      boxShadow="xl"
      width="60px"
      alignItems="center"
    >
      {/* ZOOM CONTROLS - COMMENTED OUT */}
      {/* 
      <HStack spacing={2}>
        <Button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>-</Button>
        <Text>{Math.round(zoom * 100)}%</Text>
        <Button onClick={() => setZoom((z) => Math.min(3, z + 0.1))}>+</Button>
      </HStack> 
      <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.2)" }} />
      */}

      {/* 1. Brush Type */}
      <Select
        size="xs"
        value={brushType}
        onChange={(e) => setBrushType(e.target.value)}
        color="white"
        variant="unstyled"
        iconColor="white"
        title="Brush Type"
        sx={{ option: { color: "black" } }}
      >
        <option value="default">Default</option>
        <option value="rectangle">Rectangle</option>
        <option value="circle">Circle</option>
        <option value="calligraphy">Calligraphy</option>
        <option value="splatter">Splatter</option>
        <option value="fire">Fire</option>
        <option value="feather">Feather</option>
        <option value="scribble">Scribble</option>
        <option value="glitch">Glitch</option>
        <option value="foam">Foam</option>
        <option value="watercolor">WaterColor</option>
        <option value="drip">Drip</option>
        <option value="neon">Neon</option>
        <option value="swirl">Swirl</option>
      </Select>

      {/* 2. Color */}
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          border: "2px solid white",
          cursor: "pointer",
          background: "none",
        }}
        title="Color"
      />

      <div
        style={{
          width: "100%",
          height: "1px",
          background: "rgba(255,255,255,0.2)",
        }}
      />

      {/* 3. Slider */}
      <Box height="100px" py={2}>
        <Slider
          value={brushSize}
          min={1}
          max={50}
          onChange={setBrushSize}
          orientation="vertical"
        >
          <SliderTrack bg="whiteAlpha.300">
            <SliderFilledTrack bg="blue.400" />
          </SliderTrack>
          <SliderThumb boxSize={3} />
        </Slider>
      </Box>

      <div
        style={{
          width: "100%",
          height: "1px",
          background: "rgba(255,255,255,0.2)",
        }}
      />

      {/* 4. Eraser */}
      <Button
        size="sm"
        variant={isEraser ? "solid" : "ghost"}
        colorScheme={isEraser ? "red" : "whiteAlpha"}
        color={!isEraser ? "white" : undefined}
        onClick={toggleEraser}
        borderRadius="md"
        p={0}
        title="Eraser"
      >
        Eraser
      </Button>

      {/* UNDO/REDO/SAVE - COMMENTED OUT */}
      {/*
      <Button onClick={handleUndo}>Undo</Button>
      <Button onClick={handleRedo}>Redo</Button>
      <Button onClick={handleSave}>Save</Button>
      */}

      {/* 5. Clear */}
      <Button
        size="sm"
        colorScheme="red"
        variant="ghost"
        onClick={handleClear}
        borderRadius="md"
        p={0}
        title="Clear Canvas"
      >
        Clear
      </Button>
    </Box>
  );
};

export default ToolBar;
