const ToolBar = ({
  color,
  setColor,
  brushSize,
  setBrushSize,
  brushType,
  setBrushType,
  handleUndo,
  canUndo,
  handleRedo,
  canRedo,
  handleClear,
  handleSave,
  isEraser,
  toggleEraser,
}) => {
  return (
    <div
      className="toolbar"
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        background: "white",
        padding: 10,
        display: "flex",
        gap: "10px",
      }}
    >
      <button onClick={handleUndo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={handleRedo} disabled={!canRedo}>
        Redo
      </button>
      <button
        onClick={toggleEraser}
        style={{ background: isEraser ? "#ccc" : "white" }}
      >
        Eraser
      </button>

      <input
        type="range"
        min="1"
        max="50"
        value={brushSize}
        onChange={(e) => setBrushSize(Number(e.target.value))}
      />

      <select value={brushType} onChange={(e) => setBrushType(e.target.value)}>
        <option value="rectangle">Rectangle</option>
        <option value="circle">Circle</option>
        <option value="default">Default</option>
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
      </select>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleClear}> Clear</button>
    </div>
  );
};

export default ToolBar;
