import { Box, Button, useToast } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
// import { useParams } from "react-router-dom";
import { MonacoBinding } from "y-monaco";
// import { WebsocketProvider } from "y-websocket";
// import * as Y from "yjs";
import { Code_Snippets } from "../constants";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";

const CodeEditor = forwardRef(({ doc, provider, language }, ref) => {
  // const { roomId } = useParams();
  const [value, setValue] = useState("");
  // const [language, setLanguage] = useState("Select Language");
  const editorRef = useRef();

  const [outputHeight, setOutputHeight] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [isOutputOpen, setIsOutputOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const toast = useToast();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    if (!doc || !provider) return;

    // const doc = new Y.Doc();
    // const provider = new WebsocketProvider("ws://localhost:5000", roomId, doc);

    const type = doc.getText("monaco");

    const binding = new MonacoBinding(
      type,
      editor.getModel(),
      new Set([editor]),
      provider.awareness,
    );

    if (language === "Select Lang") {
      editor.setValue("// Select a Language");
    }
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(Code_Snippets[language]);

    if (editorRef.current) {
      editorRef.current.setValue(Code_Snippets[language]);
    }
  };

  const startResize = (e) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const stopResize = () => {
    setIsDragging(false);
  };

  const resize = (e) => {
    if (isDragging) {
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 50 && newHeight < window.innerHeight * 0.5) {
        setOutputHeight(newHeight);
      }
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      if (language === "Select Lang") {
        editorRef.current.setValue("// Select a Language");
      } else if (Code_Snippets[language]) {
        editorRef.current.setValue(Code_Snippets[language]);
      }
    }
  }, [language]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResize);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [isDragging]);

  const runCode = (e) => {
    e?.preventDefault();

    if (!editorRef.current) return;

    setIsOutputOpen(true);
    if (outputHeight < 200) setOutputHeight(250);

    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    setLoading(true);

    setTimeout(() => {
      setLogs([">Output"]);
      toast({ title: "code", status: "success" });
      setLoading(false);
    }, 1000);
  };

  useImperativeHandle(ref, () => ({
    runCode: runCode
  }));

  return (
    <Box height="100%" display="flex" flexDirection="column" overflow="hidden">
      {/* <Box minHeight="0" flex="1" display="flex" flexDirection="column">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pr={4}>
          <LanguageSelector language={language} onSelect={onSelect} />
          <Button
            type="button"
            size="sm"
            variant="outline"
            colorScheme="green"
            isLoading={loading}
            onClick={runCode}
            mt={3}>
            Run
          </Button>
        </Box> */}

      <Box flex="1" overflow="hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language={language}
          defaultValue="// Select a Language"
          theme="vs-dark"
          onMount={onMount}
          // value={value}
          onChange={(val) => setValue(val)}
        />
      </Box>


      <Box
        height="5px"
        bg="#444"
        cursor={"ns-resize"}
        onMouseDown={startResize}
        _hover={{ bg: "blue.500" }}
      />
      <Box height={`${outputHeight}px`} bg="#0f0a19">
        <Output
          // editorRef={editorRef}
          // language={language}
          isOpen={isOutputOpen}
          logs={logs}
        // onOpen={handleRunTrigger}
        />
      </Box>
    </Box >
  );
});
export default CodeEditor;
