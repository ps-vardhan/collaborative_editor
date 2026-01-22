import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaPhoneSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { SERVER_HTTP_URL } from "../config.js";

// Initialize socket outside component to prevent re-connections
const socket = io(SERVER_HTTP_URL);

const AudioFooter = () => {
  // const [me, setMe] = useState("");
  // const [stream, setStream] = useState(null);
  // const [receivingCall, setReceivingCall] = useState(false);
  // const [caller, setCaller] = useState("");
  // const [callerSignal, setCallerSignal] = useState(null);
  // const [callAccepted, setCallAccepted] = useState(false);
  // const [callEnded, setCallEnded] = useState(false);
  // const [name, setName] = useState("");
  // const [isMicMuted, setIsMicMuted] = useState(false);

  const { roomId } = useParams();
  const [peers, setPeers] = useState([]); // Array of peer objects { peerID, peer }
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: "You" }); // Default
  const [socketId, setSocketId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  const userStream = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Could not load user", e);
    }
  }, []);

  const userAudio = useRef(); // My audio (monitor?) - usually we don't want to hear ourselves
  const connectionRef = useRef();
  const remoteAudioRef = useRef(); // The other person's audio

  const toast = useToast();

  // useEffect(() => {
  //   // 1. Get Audio Stream
  //   navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((currentStream) => {
  //     setStream(currentStream);
  //   });

  //   // 2. Socket Listeners
  //   const onMe = (id) => {
  //     setMe(id);
  //     console.log("My Socket ID:", id);
  //   };

  //   socket.on("me", onMe);

  //   // Fallback: If socket is already connected, it might have an ID
  //   if (socket.connected && socket.id) {
  //     setMe(socket.id);
  //   }
  //   // Or if it connects later
  //   socket.on("connect", () => {
  //     if (socket.id) setMe(socket.id);
  //   });

  //   socket.on("callUser", (data) => {
  //     setReceivingCall(true);
  //     setCaller(data.from);
  //     setName(data.name);
  //     setCallerSignal(data.signal);
  //     toast({
  //       title: "Incoming Audio Call",
  //       description: "Someone is calling you...",
  //       status: "info",
  //       duration: 5000,
  //       isClosable: true,
  //     });
  //   });

  // Cleanup
  //   return () => {
  //     socket.off("me", onMe);
  //     socket.off("callUser");
  //   };
  // }, []);

  // const callUser = (id) => {
  //   const peer = new Peer({
  //     initiator: true,
  //     trickle: false,
  //     stream: stream,
  //   });

  //   peer.on("signal", (data) => {
  //     socket.emit("callUser", {
  //       userToCall: id,
  //       signalData: data,
  //       from: me,
  //       name: "User",
  //     });
  //   });

  //   peer.on("stream", (remoteStream) => {
  //     if (remoteAudioRef.current) {
  //       remoteAudioRef.current.srcObject = remoteStream;
  //     }
  //   });

  //   socket.on("callAccepted", (signal) => {
  //     setCallAccepted(true);
  //     peer.signal(signal);
  //   });

  //   connectionRef.current = peer;
  // };

  // const answerCall = () => {
  //   setCallAccepted(true);
  //   const peer = new Peer({
  //     initiator: false,
  //     trickle: false,
  //     stream: stream,
  //   });

  //   peer.on("signal", (data) => {
  //     socket.emit("answerCall", { signal: data, to: caller });
  //   });

  //   peer.on("stream", (remoteStream) => {
  //     if (remoteAudioRef.current) {
  //       remoteAudioRef.current.srcObject = remoteStream;
  //     }
  //   });

  //   peer.signal(callerSignal);
  //   connectionRef.current = peer;
  // };

  // const leaveCall = () => {
  //   setCallEnded(true);
  //   if (connectionRef.current) {
  //     connectionRef.current.destroy();
  //   }
  //   // Reset state to allow new calls?
  //   // For now, simpler to just end.
  //   window.location.reload(); // Quick reset for MVP
  // };

  // const toggleMute = () => {
  //   if (stream) {
  //     stream.getAudioTracks()[0].enabled = isMicMuted; // Toggle
  //     setIsMicMuted(!isMicMuted);
  //   }
  // };

  /**
   * TEMPORARY HELP: How to get the OTHER user's ID to call them?
   * For this MVP, we might need to manually Copy/Paste, or simpler:
   * Just rely on "waiting for call" or broadcast to room.
   * Let's add a COPY ID button so users can share it.
   */
  useEffect(() => {
    let streamRef;

    const handleConnect = () => {
      setSocketId(socket.id);
      setConnectionStatus("connected");
      socket.emit("join room", roomId);
    };
    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
    };
    const handleConnectError = (err) => {
      console.error("Socket connect error", err);
      setConnectionStatus("error");
    };

    const setupMediaAndSockets = async () => {
      streamRef = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      userStream.current = streamRef;

      const handleAllUsers = (users) => {
        if (!socket.id) {
          console.warn("No socket id yet; skipping all users");
          return;
        }
        peersRef.current.forEach((p) => p.peer.destroy());
        peersRef.current = [];
        const nextPeers = [];
        users.forEach((userID) => {
          const peer = createPeer(userID, socket.id, streamRef);
          peersRef.current.push({
            peerID: userID,
            peer,
          });
          nextPeers.push({
            peerID: userID,
            peer,
          });
        });
        setPeers(nextPeers);
      };

      const handleUserJoined = (payload) => {
        const peer = addPeer(payload.signal, payload.callerID, streamRef);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });
        setPeers((users) => [...users, { peerID: payload.callerID, peer }]);
      };

      const handleReturnSignal = (payload) => {
        const item = peersRef.current.find((p) => p.peerID === payload.id);
        if (item) {
          item.peer.signal(payload.signal);
        }
      };

      const handleUserLeft = (id) => {
        const peerObj = peersRef.current.find((p) => p.peerID === id);
        if (peerObj) peerObj.peer.destroy();
        peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
        setPeers((users) => users.filter((p) => p.peerID !== id));
      };

      // register handlers
      socket.on("all users", handleAllUsers);
      socket.on("user joined", handleUserJoined);
      socket.on("receiving returned signal", handleReturnSignal);
      socket.on("user left", handleUserLeft);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);

      // initiate join (after handlers ready)
      if (socket.connected && socket.id) {
        handleConnect();
      }
      socket.on("connect", handleConnect);

      return () => {
        socket.off("all users", handleAllUsers);
        socket.off("user joined", handleUserJoined);
        socket.off("receiving returned signal", handleReturnSignal);
        socket.off("user left", handleUserLeft);
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
        peersRef.current.forEach((p) => p.peer.destroy());
        peersRef.current = [];
        setPeers([]);
        if (streamRef) {
          streamRef.getTracks().forEach((t) => t.stop());
        }
      };
    };

    setupMediaAndSockets();

    return () => {
      // cleanup happens in setupMediaAndSockets returned function if it ran
      if (streamRef) {
        streamRef.getTracks().forEach((t) => t.stop());
      }
    };
  }, [roomId]);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      socket.emit("sending signal", { userToSignal, callerID, signal });
    });
    return peer;
  }
  // Helper: Accept call from new guy
  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      socket.emit("returning signal", { signal, callerID });
    });
    peer.signal(incomingSignal);
    return peer;
  }

  const toggleMute = () => {
    if (userStream.current) {
      userStream.current.getAudioTracks()[0].enabled = isMicMuted;
      setIsMicMuted(!isMicMuted);
    }
  };

  const navigate = useNavigate();

  const leaveRoom = () => {
    if (userStream.current) {
      userStream.current.getTracks().forEach((track) => track.stop());
    }

    navigate("/");
    window.location.reload();
  };

  return (
    <Box
      className="footer"
      bg="gray.900"
      borderTop="1px solid"
      borderColor="gray.700"
      px={4}
      h="13vh">
      {/* Hidden Audio Element for Remote Stream */}
      {/* <audio ref={remoteAudioRef} autoPlay /> */}

      <Flex h="100%" alignItems="center">
        {/* Left: My Profile */}
        <Box flex="1" display="flex" justifyContent="flex-start">
          <HStack spacing={3}>
            <Avatar size="sm" name={currentUser.username || "You"} />
            <Box>
              <Text color="white" fontWeight="bold" fontSize="sm">
                {currentUser.username || "You"}
              </Text>
              <Badge
                colorScheme={peers.length > 0 ? "green" : "gray"}
                fontSize="xs">
                {peers.length} Others
              </Badge>
            </Box>
          </HStack>
        </Box>

        {/* Center: Controls */}
        <Box display="flex" justifyContent="center">
          <HStack spacing={8}>
            <IconButton
              isRound
              size="lg"
              icon={isMicMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
              colorScheme={isMicMuted ? "red" : "gray"}
              onClick={toggleMute}
            />

            <IconButton
              isRound
              size="lg"
              icon={<FaPhoneSlash />}
              colorScheme="red"
              onClick={leaveRoom}
            />
          </HStack>
        </Box>

        {/* Right: Participants list */}
        <Box flex="1" display="flex" justifyContent="flex-end">
          <HStack spacing={2} alignItems="center">
            {/* Current user */}
            <Badge colorScheme="blue" fontSize="xs">
              {currentUser.username || "You"}
            </Badge>
            {/* Other peers in the meeting */}
            {peers.map((p, index) => (
              <Badge key={p.peerID || index} colorScheme="purple" fontSize="xs">
                User {index + 1}
              </Badge>
            ))}
          </HStack>
        </Box>
      </Flex>

      {peers.map((p, index) => {
        return <AudioPlayer key={index} peer={p.peer} />;
      })}
    </Box>
  );
};

const AudioPlayer = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);
  return <audio playsInline autoPlay ref={ref} />;
};
export default AudioFooter;
