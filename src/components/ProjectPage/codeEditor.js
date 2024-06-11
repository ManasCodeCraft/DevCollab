import React, { useRef, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import BreadCrumbNav from "./ProjectsDir/breadCrumbNav";
import { Controlled as CodeMirror } from 'react-codemirror2';
import "codemirror/lib/codemirror.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript"; // Language mode
import "codemirror/mode/python/python";
import "codemirror/addon/selection/active-line"; // Addon: Active Line
import "codemirror/addon/edit/matchbrackets"; // Addon: Match Brackets
import "codemirror/addon/edit/matchtags"; // Addon: Match Tags
import "codemirror/addon/edit/closetag"; // Addon: Auto Close Tags
import "codemirror/addon/comment/comment"; // Addon: Comment/uncomment functionality
import "codemirror/addon/search/search"; // Addon: Search functionality
import "codemirror/addon/search/searchcursor"; // Addon: Search Cursor
import "codemirror/addon/search/jump-to-line"; // Addon: Jump to line

import "codemirror/addon/hint/show-hint"; // Addon: show hint
import "codemirror/addon/hint/anyword-hint"; // Addon: hint any word
import "codemirror/addon/hint/javascript-hint"; // Addon: hint JavaScript
import "codemirror/addon/hint/css-hint"; // Addon: hint CSS
import "codemirror/addon/hint/html-hint"; // Addon: hint HTML
import "codemirror/addon/hint/xml-hint"; // Addon: hint XML
import "codemirror/addon/hint/sql-hint"; // Addon: hint SQL
import { useDispatch, useSelector } from "react-redux";
import { message } from "../../globalComponents/utilityModal";
import { setFileContent } from "../../redux/slices/projectSlice";

export default function CodeEditor() {
  const dispatch = useDispatch();
  const [savebtnDisabled, setsavebtnDisabled] = useState(false);
  // Language extensions
  const extensionToMode = {
    // Markup languages
    ".xml": "xml",
    ".html": "htmlmixed",
    ".md": "markdown",
    ".rst": "rst",

    // Programming languages
    ".js": "javascript",
    ".ts": "typescript",
    ".py": "python",
    ".rb": "ruby",
    ".java": "java",
    ".c": "c",
    ".cpp": "cpp",
    ".cs": "csharp",
    ".go": "go",
    ".php": "php",
    ".pl": "perl",
    ".lua": "lua",
    ".swift": "swift",
    ".m": "objectivec",
    ".r": "r",
    ".kt": "kotlin",
    ".rs": "rust",

    // Stylesheet languages
    ".css": "css",
    ".sass": "sass",
    ".scss": "scss",
    ".less": "less",
    ".styl": "stylus",

    // Data formats
    ".json": "json",
    ".yml": "yaml",
    ".yaml": "yaml",
    ".toml": "toml",
    ".ini": "ini",
    ".csv": "csv",
    ".sql": "sql",

    // Scripting languages
    ".sh": "shell",
    ".ps1": "powershell",
    ".vbs": "vbscript",
    ".bash": "shell",

    // Other languages
    ".vb": "vb",
    ".matlab": "matlab",
    ".sas": "sas",
    ".stata": "stata",
    ".f90": "fortran",
    ".cob": "cobol",
    ".pas": "pascal",
    ".hs": "haskell",
    ".scm": "scheme",
    ".clj": "clojure",
    ".erl": "erlang",
    ".ex": "elixir",
    ".fs": "fsharp",
  };

  const file_to_open = useSelector(
    (state) => state.project.currentlyOpenedFile
  );
  const [code, setCode] = useState("");
  const editorRef = useRef(null);

  useEffect(() => {
    if (!file_to_open) {
      window.location.href = "/user/projects";
      return null;
    }
    setCode(file_to_open.fileContent || "");
  }, []);

  const ext = `.${file_to_open.fileName.split(".").pop()}`;

  const handleChange = (editor, data, value) => {
    setCode(value);
  };

  const saveContent = (content) => {
    setsavebtnDisabled(true);
    fetch("http://localhost:7000/file/save", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: file_to_open.fileId,
        content: content,
      }),
    })
      .then((response) => {
        setsavebtnDisabled(false);
        if (!response.ok) {
          response.json().then((data) => {
            message(
              `Error ${response.status}`,
              data.message || "Error saving file",
              dispatch
            );
          });
        }
        else{
           dispatch(setFileContent(content))
           setCode(content)
        }
      })
      .catch((error) => {
        setsavebtnDisabled(false);
        console.log(error);
        message("Error", "Error saving file", dispatch);
      });
  };

  return (
    <>
      <BreadCrumbNav />
      <div className="editor-tools">
        {savebtnDisabled ? (
          <Button variant="primary" className="float-right" disabled={true}>
            Saving ...
          </Button>
        ) : (
          <Button
            variant="primary"
            className="float-right"
            onClick={() => {
              saveContent(code);
            }}
          >
            Save
          </Button>
        )}
      </div>
      <CodeMirror
        value={code}
        options={{
          mode: extensionToMode[ext],
          theme: "material",
          lineNumbers: true,
          styleActiveLine: true,
          matchBrackets: true,
          matchTags: { bothTags: true },
          autoCloseTags: true,
          extraKeys: {
            "Shift-/": "toggleComment",
            "Ctrl-F": "findPersistent",
            "Ctrl-G": "findPersistentNext",
            "Shift-Ctrl-G": "findPersistentPrev",
            "Ctrl-S": (cm) => {
              saveContent(code);
            },
          },
        }}
        onBeforeChange={handleChange}
        ref={editorRef}
        editorDidMount={(editor) => {
          // CodeMirror reference
          editorRef.current = editor;
        }}
      />
    </>
  );
}
