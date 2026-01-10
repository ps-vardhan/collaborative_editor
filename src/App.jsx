import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";
import './App.css';
import CodeEditor from "./components/CodeEditor";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-layout">
      <section className='left-panel'>
        <Flex direction="column" height="100%" bg="#0f0a19" color="gray.500" px={6} py={8}>
          {/* <LanguageSelector /> */}
          <Box flex="1" overflow="hidden">
            <CodeEditor />
          </Box>
        </Flex>
      </section>
      <section className='right-panel'>
        <h2>Right Panel</h2>
      </section>
      {/* <section className='file-structure'> file system</section> */}
      <footer className='footer'>
        User: Guest
      </footer>
    </div>
  )
}

export default App
