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
    if (uri) {
      // Load file content from Tauri
      invoke("read_file_content", { path: uri })
        .then((res) => {
          setStartContent(res as string);
        })
        .catch((err) => {
          console.error("Failed to read file:", err);
          setStartContent(`Error loading file: ${err}`);
        });
    }
  }, [uri]);

  useEffect(() => {
    handleInput(); // initialize line count on mount
  }, []);

  function getLogicalLineCount(text: string) {
    // Replace 2+ newlines with just 1
    return text.replace(/\n{2,}/g, "\n").split("\n").length;
  }

  const lineCount = getLogicalLineCount(editorRef.current?.innerText ?? "");

  return (
    <div className="editor">
      <div>
        <TabBar />
      </div>
      <div className="editor-container">
        <div className="lines-counter">
          {(editorRef.current &&
            Array.from({ length: lineCount }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))) || <span>1</span>}
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
