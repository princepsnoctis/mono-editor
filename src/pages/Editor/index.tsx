import { invoke } from "@tauri-apps/api/core";
import "./index.scss";

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import TabBar from "../../components/TabBar";

function Editor() {
  const { uri } = useParams();
  const [content, setContent] = useState("");
  const [startContent, setStartContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const handleInput = () => {
    const newContent = editorRef.current?.innerText ?? "";
    setContent(newContent);
  };

  useEffect(() => {
    console.log(uri?.slice(18, uri.length));
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() == 's') {
        if(!uri)
          return;
        event.preventDefault();
        console.log(content);
        invoke("save_to_file", { path: "D:/Programowanie/Github/mono-editor/sample-project/" + uri.slice(18, uri.length), content: content })
        .then(() => {
          console.log("File saved successfully!");
        })
        .catch((err) => {
          console.error("Failed to save file: " + err);
        });
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  useEffect(() => {
    if (uri) {
      // Load file content from Tauri
      invoke("read_file_content", { path: uri })
        .then((res) => {
          setStartContent(res as string);
          setContent(res as string);
        })
        .catch((err) => {
          const errorMsg = "Failed to read file: " + err;
          console.error(errorMsg);
          setStartContent(errorMsg);
          setContent(errorMsg);
        });
    }
  }, [uri]);

  function getLogicalLineCount(text: string) {
    // Replace 2+ newlines with just 1
    return text.replace(/\n{2,}/g, "\n").split("\n").length || 1;
  }

  const lineCount = getLogicalLineCount(content);

  return (
    <div className="editor">
      <div>
        <TabBar />
      </div>
      <div className="editor-container">
        <div className="lines-counter">
          {Array.from({ length: lineCount }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
        </div>
        <div
          className="editor-content"
          contentEditable
          suppressContentEditableWarning
          ref={editorRef}
          onInput={handleInput}
        >
          {startContent}
        </div>
      </div>
    </div>
  );
}

export default Editor;
