import {
  Box,
  Button,
  Code,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../api";
// import { login, register } from "../api";

const LoginPage = () => {
  // const [isLogin, setIsLogin] = useState(true);
  // const [formData, setFormData] = useState({ username: "", password: "" });
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createdRoomData, setCreatedRoomData] = useState(null);

  // const handleSubmit = async () => {
  //   try {
  //     const { data } = isLogin
  //       ? await login(formData)
  //       : await register(formData);
  //     if (isLogin) {
  //       localStorage.setItem("token", data.token);
  //       localStorage.setItem("user", JSON.stringify(data.user));
  //       toast({ title: "Login Sucessful", status: "success" });
  //       navigate("/dashboard");
  //     } else {
  //       toast({ title: "Register! Sucessful", status: "success" });
  //       setIsLogin(true);
  //     }
  //   } catch (err) {
  //     toast({
  //       title: "Error",
  //       description: err.response?.data?.msg || "something went wrong",
  //       status: "error",
  //     });
  //   }
  // };

  const saveUserAndRedirect = (rId) => {
    if (!username.trim()) {
      toast({ title: "Please enter your Display Name", status: "warning" });
      return;
    }
    // Save minimal "User" object for the Editor to read
    const mockUser = { username, id: Date.now().toString() };
    localStorage.setItem("user", JSON.stringify(mockUser));

    navigate(`/editor/${rId}`);
  };

  const handleJoin = async () => {
    if (!roomId) return;
    // saveUserAndRedirect(roomId);
    if (!password) {
      toast({ title: "Password Required", status: "warning" });
      return;
    }
    try {
      await joinRoom({ roomId, password });
      localStorage.setItem("current_room_pass",password);
      saveUserAndRedirect(roomId);

    } catch (err) {
      toast({
        title: "Access Denied",
        description: "Invalid Credentionals",
        status: "error",
      });
    }
  };

  const handleCreate = async () => {
    // Generate a unique Room ID
    // const id = "room-" + Date.now();
    // saveUserAndRedirect(id);
    if (!username) {
      toast({ title: "Name required", status: "warning" });
      return;
    }
    try {
      const { data } = await createRoom({
        name: newRoomName || "Untitled",
        // password,
        owner: username,
      });
      setCreatedRoomData({
        roomId: data.roomId,
        passwordKey: data.passwordKey,
      });
      // saveUserAndRedirect(data.roomId);
      onOpen();
    } catch (err) {
      toast({ title: "Error creating room", status: "error" });
    }
  };

  const enterRoom = () => {
    if (createdRoomData) {
      localStorage.setItem("current_room_pass",createdRoomData.passwordKey);
      
      saveUserAndRedirect(createdRoomData.roomId);
    }
  };
  
  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, #0f0a19, #1a1a2e)"
      color="white">
      <VStack
        spacing={6}
        width={{ base: "90%", md: "450px" }}
        p={8}
        bg="gray.900"
        borderRadius="xl"
        boxShadow="2xl"
        border="1px solid"
        borderColor="gray.700">
        <Heading size="lg" bg="lightblue" bgClip="text" textAlign="center">
          Collaborative Space
        </Heading>

        <Text color="gray.400" fontSize="sm" textAlign="center">
          Create Joint, Secure Sessions.
        </Text>

        {/* <Input
          placeholder="UserName"
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        /> */}
        <Input
          placeholder="Display Name"
          size="lg"
          bg="gray.800"
          border="none"
          _focus={{ border: "1px solid #7928CA" }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* <Button colorScheme="blue" width="100%" onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </Button>
        <Text
          cursor="pointer"
          color="blue.400"
          onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account?" : "Already have one?"}
        </Text> */}

        <Tabs isFitted variant="soft-rounded" colorScheme="purple" width="100%">
          <TabList mb="1.5em" bg="gray.800" borderRadius="full" p={1}>
            <Tab
              color="gray.400"
              _selected={{ color: "white", bg: "purple.600" }}>
              Join Session
            </Tab>
            <Tab
              color="gray.400"
              _selected={{ color: "white", bg: "purple.600" }}>
              Create Session
            </Tab>
          </TabList>

          <TabPanels>
            {/* Join Panel */}
            <TabPanel px={0} py={0}>
              <VStack spacing={4}>
                <Input
                  placeholder="Paste Room ID (e.g. room-123)"
                  size="md"
                  bg="gray.800"
                  border="none"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />

                <Input
                  placeholder="Room Password"
                  type="password"
                  size="md"
                  bg="gray.800"
                  border="none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  colorScheme="purple"
                  width="100%"
                  size="lg"
                  onClick={handleJoin}
                  isDisabled={!roomId || !username}>
                  Join Session
                </Button>
              </VStack>
            </TabPanel>
            {/* Create Panel */}
            <TabPanel px={0} py={0}>
              <VStack spacing={4}>
                <Input
                  placeholder="Meeting Name (Optional)"
                  size="md"
                  bg="gray.800"
                  border="none"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                />
                {/* <Input
                  placeholder="Password Key"
                  type="password"
                  size="md"
                  bg="gray.800"
                  border="none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                /> */}
                <Button
                  colorScheme="purple"
                  width="100%"
                  size="lg"
                  onClick={handleCreate}
                  isDisabled={!username}>
                  Start New Session
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Room Created!</ModalHeader>
          <ModalBody>
            <VStack align="start" spacing={4}>
              <Text>Share these credentials with your team:</Text>
              <Box>
                <Text fontWeight="bold" color="gray.400">
                  Room ID:
                </Text>
                <Code fontSize="xl" colorScheme="purple">
                  {createdRoomData?.roomId}
                </Code>
              </Box>
              <Box>
                <Text fontWeight="bold" color="gray.400">
                  Access Key:
                </Text>
                <Code fontSize="xl" colorScheme="purple">
                  {createdRoomData?.passwordKey}
                </Code>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={enterRoom}>
              Enter Room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default LoginPage;
