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

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
