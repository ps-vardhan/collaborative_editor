import { Box, Flex } from "@chakra-ui/react";
import "./App.css";
import Canvas from "./components/Canvas";
import CodeEditor from "./components/CodeEditor";

function App() {

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
        <Canvas width={800} height={600} />
      </section>
      {/* <section className='file-structure'> file system</section> */}
      <footer className="footer">User: Guest are here</footer>
    </div>
  );
}

export default App;
