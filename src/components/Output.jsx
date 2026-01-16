import { Box, Text } from "@chakra-ui/react";

const Output = ({ isOpen, logs }) => {
  //   const toast = useToast();
  //   const [loading, setLoading] = useState(false);
  //   const [logs, setLogs] = useState([]);

  //   const runCode = async () => {
  //     onOpen();

  //     if (!editorRef.current) return;

  //     const sourceCode = editorRef.current.getValue();
  //     if (!sourceCode) return;

  //     setLoading(true);
  //     setTimeout(() => {
  //       setLogs(["> Output generated...", "Hello World"]);
  //       toast({ title: "Code Executed", status: "success" });
  //       setLoading(false);
  //     }, 1000);
  //   };
  return (
    <Box
      w="100%"
      h="100%"
      bg="#0f0a19"
      color="gray.300"
      p={4}
      display={isOpen ? "block" : "none"}
      overflowY="auto"
    >
      {/* <Box p={2} borderBottom="1px solid #333">
        <Text mb={2} fontSize="lg" display="inline-block" mr={4}>
          Output
        </Text>
        <Button
          size="sm"
          variant="outline"
          colorScheme="green"
          isLoading={loading}
          onClick={runCode}
        >
          {" "}
          Run Code
        </Button>
      </Box> */}
      {/* <Box
        flex="1"
        p={2}
        overflow="auto"
        bg="#0f0a19"
        display={isOpen ? "block" : "none"}
      > */}
      {/* {logs.map((log, i) => (
          <Text key={i}>{log}</Text>
        ))}
        {!logs.length && "Click 'Run Code' to see output here"} */}

      <Text fontWeight="bold" mb={2}>
        Output:
      </Text>
      {logs && logs.length > 0 ? (
        logs.map((line, i) => <Text key={i}>{line}</Text>)
      ) : (
        <Text color="gray.500">Click 'Run Code to see output here</Text>
      )}
    </Box>
    // </Box>
  );
};
export default Output;
