import { Box } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";

const CodeEditor = () => {
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('javascript'); 
  const editorRef = useRef();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  }

  const onSelect=(language)=>{
    setLanguage(language);
  };

  return (
    <Box height="100%">
      <LanguageSelector language={language} onSelect={onSelect}/>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        language={language}
        defaultValue="//Comments"
        theme="vs-dark"
        onMount={onMount}
        value={value}
        onChange={(value) => setValue(value)}

      />
    </Box>
  );
};
export default CodeEditor;
