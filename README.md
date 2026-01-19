# Collaborative Code Editor

A React-based Code Editor built with **Vite**, **Chakra UI**, and **Monaco Editor**.

## 🐛 Development Log: Errors & Resolutions

A record of issues encountered during development and how they were fixed.

| Issue | File(s) | Error Description | Resolution |
| :--- | :--- | :--- | :--- |
| **Crash on Start** | `src/index.jsx` | `root is not defined` | Assigned `const root = ReactDOM.createRoot(...)` before calling `root.render()`. |
| **Blank Page** | `src/index.jsx` | `ChakraProvider` wrapped improperly | Moved `<App />` **inside** `<ChakraProvider>`. |
| **Chakra Crash** | `src/theme.js` | `extendedTheme is not a function` | Typos fixed: Changed `extendedTheme` to `extendTheme`. |
| **Blank Page (V3)** | `package.json` | Chakra UI v3 installed but v2 code used | Downgraded Chakra UI to `v2.10.9` for compatibility. |
| **Missing Dep** | `package.json` | `Failed to resolve import "@chakra-ui/react"` | Installed missing dependencies (`npm install @chakra-ui/react ...`). |
| **Layout Overflow** | `App.css` | `#app-layout` ID selector mismatch | Changed CSS selector to `.app-layout` and fixed `100vh` typo to `100vw`. |
| **Layout Blocked** | `App.jsx` | Left panel items overlapping/blocked | Converted Left Panel to **Flexbox** (`Flex direction="column"`) and set CodeEditor container to `flex="1"`. |
| **Editor Logic** | `CodeEditor.jsx` | `setValue(val)` - `val` undefined | Changed variable name to `setValue(value)`. |
| **Editor Logic** | `CodeEditor.jsx` | `onSelect` function unused | Moved `LanguageSelector` **inside** `CodeEditor` (or lifted state up) to connect the components. |
| **Python Indent** | `constants.js` | No auto-indentation for Python | Changed Language ID from `"Python"` (Capital) to `"python"` (lowercase) to match Monaco's ID. |
| **Duplicate UI** | `App.jsx` | Two language selectors visible | Removed the duplicate `<LanguageSelector />` from `App.jsx`. |
| **Wrong Structure** | `App.jsx` | Toolbar mixed in App (vs SeyPaint structure) | Extracted inline toolbar to new `src/components/Toolbar.jsx` to match "95% structure" requirement. |
| **Missing Import** | `App.jsx` | `ToolBar` is not defined | Added `import ToolBar from "./components/ToolBar";`. |
| **Logic Error** | `App.jsx` | `setHistoryStep(newHistory)` (Array vs Number) | Fixed to `setHistory(newHistory)` and `setHistoryStep(index)`. |
| **Ref Access** | `App.jsx` | `Canvas.current.toDataUrl` | Fixed to `canvasRef.current.toDataURL()` (case-sensitive & ref usage). |
| **Missing Props** | `ToolBar.jsx` | `isEraser` undefined | Added `isEraser, toggleEraser` to component props destructuring. |
| **Math Error** | `Canvas.jsx` | Shape width/height calculation wrong | Fixed `end.x - end.y` to `end.x - start.x`. |
| **Var Naming** | `Canvas.jsx` | `ctx` is not defined | Renamed copied `ctx` variables to `context` to match local variable. |
| **Layout Size** | `App.css` | Paint area was 30% (Request: 25%) | Updated grid columns to `75% 25%` (Planned). |
| **Canvas Focus** | `App.jsx` | Canvas started at top-left (hidden/offcenter) | Added `centerScroll` logic in `useEffect` to auto-scroll to center on load. |
| **Toolbar UI** | `ToolBar.jsx` | Visual clutter (Zoom/Undo buttons obsolete) | Commented out unused buttons instead of deleting (User Requirement); Switched to Vertical Layout. |
| **Interpretation** | `etch_effect_guide.md`| "Etching" interpreted as 3D Emboss | **Correction**: User clarified goal was "Fabric Texture" -> then "Wrinkle Brush" -> then "Watermark". |
| **Watermark Logic** | `Canvas.jsx` | Watermark erased by eraser (White Paint) | **Solution**: Moved Watermark to `backgroundImage` (CSS) and changed Eraser to `destination-out` (Transparent). |
| **Save Logic** | `App.jsx` | Watermark missing in downloaded file | **Fix**: `toDataURL` ignores CSS. implemented `tempCanvas` composite (White Fill + Watermark + Ink) in `handleSave`. |
| **Syntax Error** | `Canvas.jsx` | `Function components cannot be given refs` | **Fix**: Added missing `(` in `React.forwardRef` props destructuring. |
| **Syntax Error** | `Canvas.jsx` | `Unexpected token else` | **Fix**: Removed stray `} else {` block left over from replace operation. |
| **Runtime Error** | `Canvas.jsx` | `currentPosition is not defined` | **Fix**: Restored the `currentPosition` variable definition in `handleMouseMove`. |
| **Crash (Runtime)** | `CodeEditor.jsx` | `Uncaught TypeError` (Button not defined) | **Fix**: Added missing `Button` to imports from `@chakra-ui/react`. |
| **Logic Error** | `CodeEditor.jsx` | `e` is not defined (preventing default) | **Fix**: Added `e` as argument to `runCode` function signature. |
| **Crash (Chakra)** | `CodeEditor.jsx` | `Cannot read properties of undefined` (Toast) | **Fix**: Corrected `status: "succ"` to `status: "success"`. |
| **UI Rendering** | `App.jsx` | Output Panel covering Editor | **Fix**: Corrected resize math from `- 0.5` to `* 0.5` (50% limit). |
| **Layout Issue** | `App.jsx` | Editor not using full width | **Fix**: Removed `px={6} py={8}` padding from the `Flex` container in Left Panel. |
| **UX Issue** | `CodeEditor.jsx` | Run button reloads page | **Fix**: Added `type="button"` and `e.preventDefault()`. |
| **Logic Mismatch** | `Output.jsx` | Button located in Output panel but controls Editor | **Refactor**: Lifted `runCode` state & logic up to `CodeEditor.jsx`. |
| **Space Efficiency** | `CodeEditor.jsx` | Editor not taking full height of panel | **Fix**: Applied `flex="1"` and `height="100%"` to editor container in Flex column. |
| **Typo Error** | `LoginPage.jsx` | `handleJoin` is not defined | **Fix**: Renamed `handleJoion` to `handleJoin`. |
| **Method Error** | `server/routes/rooms.js` | `GET` request having body content | **Fix**: Changed `router.get("/join")` to `router.post("/join")`. |
| **Logic Error** | `LoginPage.jsx` | Password input missing | **Fix**: Added Password Input fields for specific flows. |
| **Ref Error** | `server/routes/rooms.js` | `generateId` is not defined | **Fix**: Added `generateId` helper function using `crypto`. |
| **Arg Error** | `server/routes/rooms.js` | `generateRoomId(6)` called with argument | **Fix**: Removed argument to match definition (which is hardcoded to 6 bytes). |
| **UX Polish** | `LoginPage.jsx` | Layout not centered | **Fix**: Added `100vw/100vh` flex container with gradient background. |
| **Secure Auth** | `LoginPage.jsx` | User could create custom passwords | **Improvement**: Switched to Server-Generated Access Keys for security. |
| **Snippet Loading** | `CodeEditor.jsx` | "Hello World" code not appearing on load | Added `onMount` check: if "Select Lang", force placeholder text. |
| **Ref Access** | `CodeEditor.jsx` | Parent unable to trigger `runCode` | Wrapped editor in `forwardRef` and exposed method via `useImperativeHandle`. |
| **Syntax Error** | `CodeEditor.jsx` | `Adjacent JSX elements` / `Unexpected token` | Fixed component nesting (moved `</Box>` tags) and removed extra closing tags. |
| **Runtime Crash** | `EditorPage.jsx` | `Failed to construct 'Text'` | Added missing `Text` import to `@chakra-ui/react` destructured list. |
| **Missing Feature** | `EditorPage.jsx` | Password not visible in session info | Implemented `localStorage` retrieval for `passwordKey` and added Info Popover. |

## 📚 Documentation & Guides

For detailed implementation steps, refer to the following guides created during development:

### **Phase 3: Advanced Tools**
*   [Phase 3 Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\phase_3_guide.md) - Undo/Redo Implementation.
*   [Eraser Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\eraser_guide.md) - Eraser Logic.
*   [Shape Tools Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\shape_tools_guide.md) - Rectangle & Circle Tools.

### **Phase 4-5: UI & Zoom**
*   [UI Fixes](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\ui_fixes_guide.md) - Layout & Resizing bugs.
*   [Phase 5 Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\phase_5_guide.md) - A4 Canvas & Zoom Logic.
*   [Center Focus Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\center_focus_guide.md) - Auto-centering logic.
*   [Keyboard Zoom Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\keyboard_zoom_guide.md) - `Ctrl + It` shortcuts.

### **Phase 7-8: Toolbar Refinement**
*   [Vertical Toolbar Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\vertical_toolbar_guide.md) - Transforming to sidebar.
*   [Cleanup Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\cleanup_toolbar_guide.md) - Commenting out unused props.

### **Phase 9: Creative Effects**
*   [Etch Effect Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\etch_effect_guide.md) - Initial (Discarded) 3D concept.
*   [Fabric Texture Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\fabric_texture_guide.md) - Texture concept.
*   [Wrinkle Brush Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\wrinkle_brush_guide.md) - Brush concept.
*   [Watermark Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\watermark_guide.md) - Initial Tiled Watermark.
*   [Permanent Watermark Guide](C:\Users\DELL\.gemini\antigravity\brain\9b99ad37-5a8e-48b2-a071-88e09b523739\permanent_watermark_guide.md) - **Final** Layered Implementation.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
