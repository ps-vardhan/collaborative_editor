import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import EditorPage from "./components/EditorPage";
import LoginPage from "./components/LoginPage";
// import RoomManager from "./components/RoomManager";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/login" element={<LoginPage />} />

        {/* <Route path="/dashboard" element={<RoomManager />} /> */}

        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
