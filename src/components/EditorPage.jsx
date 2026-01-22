import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import "../App.css";
import Canvas from "./Canvas";
import CodeEditor from "./CodeEditor";
import LanguageSelector from "./LanguageSelector";
import ToolBar from "./ToolBar";
// import {InfoIcon} from "@chakra-ui/icons";
// import { Avatar, AvatarGroup, Tooltip } from "@chakra-ui/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";

import "@livekit/components-styles";

import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useParticipants,
} from "@livekit/components-react";

const CANVAS_WIDTH = 1123;
const CANVAS_HEIGHT = 794;

function EditorPage() {
  const { roomId } = useParams();
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(10);
  const [brushType, setBrushType] = useState("default");
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [isEraser, setIsEraser] = useState(false);
  const [leftWidth, setLeftWidth] = useState(70);
  const [zoom, setZoom] = useState(1.0);
  const [language, setLanguage] = useState("Select Lang");
  const [doc, setDoc] = useState(null);
  const [provider, setProvider] = useState(null);
  const [roomPassword, setRoomPassword] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [token, setToken] = useState("");

  const codeEditorRef = useRef();
  const canvasRef = useRef(null);
  const isDragging = useRef(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Get User from Storage
    const storedUser = localStorage.getItem("user");
    let currentName = "Guest";
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // setUserName(parsedUser.username || "Guest");
        currentName = parsedUser.username || "Guest";
        setUserName(currentName);
      } catch (e) {
        console.error("Failed to parse user");
      }
    }

    // Get Token from Server
    (async () => {
      try {
        const resp = await fetch(
          `http://localhost:5000/api/token?room=${roomId}&username=${currentName}`,
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [roomId]);


  useEffect(() => {
    if (!roomId) return;

    const ydoc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      "ws://localhost:5000",
      roomId,
      ydoc,
    );

    wsProvider.on("status", (event) => {
      console.log("EditorPage: WebSocket status change", event.status);
    });

    setDoc(ydoc);
    setProvider(wsProvider);

    return () => {
      wsProvider.destroy();
      ydoc.destroy();
    };
  }, [roomId]);

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
  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      handleSaveState();

      if (doc) {
        doc.getArray("paint-ops").delete(0, doc.getArray("paint-ops").length);
      }
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;

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
    const diagonal = Math.sqrt(
      canvas.width * canvas.width + canvas.height * canvas.height,
    );
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

  if (!token) {
    return <div>Loading Connection...</div>;
  }

  return (
    <LiveKitRoom
      video={false}
      audio={true}
      token={token}
      serverUrl={import.meta.env.VITE_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div
        className="app-layout"
        style={{ gridTemplateColumns: `${leftWidth}% 5px 1fr` }}>
        {/*
    <div
      className="app-layout"
      style={{ gridTemplateColumns: `${leftWidth}% 5px 1fr` }}>
        */}
        <section className="left-panel">
          <Flex
            direction="column"
            height="100%"
            bg="#0f0a19"
            color="gray.500"
          // p={0}
          // px={3}
          // py={4}
          >
            <Box
              w="100%"
              pl={3}
              pr={4}
              py={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgGradient="linear(to-r,#2c1a4d,#3b2566)"
              borderBottom="1px solid"
              borderColor="whiteAlpha.100">
              <Box display="flex" alignItems="center" width="200px">
                <Heading
                  size="md"
                  fontWeight="semibold"
                  mb={0}
                  color="whiteAlpha.900">
                  Code Editor
                </Heading>
              </Box>

              <Box flex="1" display="flex" justifyContent="center">
                <LanguageSelector language={language} onSelect={onSelect} />
              </Box>
              {/* <Tag size="sm" variant="subtle" colorScheme="purple" ml={3} borferRadius="full">
              <TagLabel>Session:{roomId}</TagLabel>
              </Tag> */}
              <Box
                display="flex"
                alignItems="center"
                width="200px"
                justifyContent="flex-end">
                <Popover placement="bottom-end">
                  <PopoverTrigger>
                    <IconButton
                      icon={<IoMdInformationCircleOutline size={24} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="whiteAlpha"
                      mr={3}
                      color="white"
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    bg="gray.800"
                    borderColor="gray.600"
                    color="white"
                    width="auto"
                    minW="200px">
                    <PopoverArrow bg="gray.800" borderColor="gray.600" />
                    <PopoverCloseButton />
                    <PopoverHeader fontWeight="bold" borderBottomColor="gray.600">
                      Session Info
                    </PopoverHeader>
                    <PopoverBody p={4}>
                      <Text mb={2}>
                        <strong>Room ID:</strong> {roomId}
                      </Text>
                      <Text>
                        {" "}
                        <strong>Pass Key:</strong>{" "}
                        {roomPassword || "***************"}
                      </Text>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
                <Button
                  size="sm"
                  colorScheme="green"
                  px={6}
                  onClick={() => codeEditorRef.current.runCode()}>
                  Run
                </Button>
              </Box>
            </Box>

            <Box flex="1" overflow="hidden">
              {doc && provider ? (
                <CodeEditor
                  ref={codeEditorRef}
                  doc={doc}
                  provider={provider}
                  language={language}
                />
              ) : (
                <Box color="white">Initializing Editor...</Box>
              )}
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
          style={{ position: "relative", overflow: "hidden" }}>
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            zIndex={10}
            textAlign="center"
            p={4}
            bg="rgba(26,21,37,0.85)"
            backdropFilter="blur(8px)"
            borderBottom="1px solid"
            borderColor="gray.200"
            pointerEvents="none">
            <Heading
              // position="absolute"
              // top={4}
              // left={4}
              // zIndex={10}
              size="md"
              color="whiteAlpha.900"
            // color="gray.600"
            // pointerEvents="none"
            // userSelect="none"
            >
              Whiteboard
            </Heading>
          </Box>
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
            }}>
            {doc ? (
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
                doc={doc}
              />
            ) : (
              <div>Loading Canvas...</div>
            )}
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
        <AudioFooter userName={userName} />
        <RoomAudioRenderer />
      </div>
    </LiveKitRoom>
  );
  {/*
      <footer className="footer">
        <Flex alignItems="center" gap={3}>
          <Avatar
            size="md"
            name={userName}
            src="https://bit.ly/broken-link"
            border="2px solid #805ad5" // Purple accent border
          />
        < Box lineHeight="1.2">
      <Text fontWeight="bold" fontSize="sm" color="white">
        {userName}
      </Text>
      <Text fontSize="xs" color="green.300">
        ● Connected
      </Text>
    </Box>
        </Flex >
        <Flex gap={4} alignItems="center">
          <Tooltip label={isMuted ? "Unmute" : "Mute"} hasArrow>
            <IconButton
              aria-label="Toggle Microphone"
              icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
              onClick={() => setIsMuted(!isMuted)}
              isRound
              size="lg"
              colorScheme={isMuted ? "red" : "gray"} // Red when muted, Gray when active
              variant={isMuted ? "solid" : "solid"}
              _hover={{ transform: "scale(1.05)" }}
            />
          </Tooltip>
          <Tooltip label="Leave Room" hasArrow>
            <IconButton
              aria-label="End Call"
              icon={<MdCallEnd />}
              onClick={() => (window.location.href = "/")} // Exit to Home
              isRound
              size="lg"
              colorScheme="red"
              variant="outline"
              borderWidth="2px"
              _hover={{
                bg: "red.500",
                color: "white",
                transform: "scale(1.05)",
              }}
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center" gap={3}>
          <Text fontSize="xs" color="gray.500" fontWeight="medium">
            OTHERS IN ROOM
          </Text>
          <AvatarGroup size="sm" max={4} spacing={-2} borderColor="#0f0a19">

      <Avatar name="User One" bg="blue.500" />
      <Avatar name="User Two" bg="teal.500" />
      <Avatar name="User Three" bg="orange.500" />
      <Avatar name="User Four" bg="pink.500" />
    </AvatarGroup >
        </Flex >
      </footer >
      */
  }
}

function AudioFooter({ userName }) {
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants(); // List of all users
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    if (localParticipant) {
      const newState = !isMuted;
      localParticipant.setMicrophoneEnabled(!newState);
      setIsMuted(newState);
    }
  };

  return (
    <footer className="footer">
      <Flex alignItems="center" gap={3}>
        <Avatar
          size="md"
          name={userName}
          src=""
          border="2px solid #805ad5"
        />
        <Box lineHeight="1.2">
          <Text fontWeight="bold" fontSize="sm" color="white">
            {userName}
          </Text>
          <Text fontSize="xs" color="green.300">
            ● Connected
          </Text>
        </Box>
      </Flex>
      <Flex gap={4} alignItems="center">
        <Tooltip label={isMuted ? "Unmute" : "Mute"} hasArrow>
          <IconButton
            aria-label="Toggle Microphone"
            icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            onClick={toggleMute}
            isRound
            size="lg"
            colorScheme={isMuted ? "red" : "gray"}
            variant="solid"
            _hover={{ transform: "scale(1.05)" }}
          />
        </Tooltip>
        <Tooltip label="Leave Room" hasArrow>
          <IconButton
            aria-label="End Call"
            icon={<MdCallEnd />}
            onClick={() => (window.location.href = "/")}
            isRound
            size="lg"
            colorScheme="red"
            variant="outline"
            borderWidth="2px"
            _hover={{
              bg: "red.500",
              color: "white",
              transform: "scale(1.05)",
            }}
          />
        </Tooltip>
      </Flex>

      <Flex alignItems="center" gap={3}>
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          OTHERS IN ROOM
        </Text>
        <AvatarGroup size="sm" max={4} spacing={-2} borderColor="#0f0a19">
          {participants
            .filter((p) => p.identity !== userName)
            .map((p) => (
              <Avatar key={p.identity} name={p.identity} bg="blue.500" />
            ))}
        </AvatarGroup>
      </Flex>
    </footer>
  );
}

export default EditorPage;
