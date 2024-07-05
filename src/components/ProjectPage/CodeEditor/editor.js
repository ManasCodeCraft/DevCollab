import React, { useRef, useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import getExtLang from "../../../utils/getLang";
import EditorTools from "./editorTools";

export default function Editor({ file_to_open }) {
  const [code, setCode] = useState(file_to_open ? file_to_open.fileContent : "");
  const editorRef = useRef(null);

  useEffect(() => {
    if (file_to_open) {
      setCode(file_to_open.fileContent);
    }
  }, [file_to_open]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  const ext = `.${file_to_open.fileName.split(".").pop()}`;
  const lang = getExtLang(ext);

  return (
    <div>
      <EditorTools code={code} fileName={file_to_open.fileName} fileId={file_to_open.fileId} />
      <MonacoEditor
        height="90vh"
        language={lang}
        value={code}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          readOnly: false,
          fontSize: 14,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
