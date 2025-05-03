import { invoke } from "@tauri-apps/api/core";
import "./index.scss"

import { useEffect, useRef, useState } from "react";
import {useParams} from "react-router-dom";

import TabBar from "../../components/TabBar";

function Editor() {
    const { uri } = useParams();
    const [content, setContent] = useState("")
    const [lineCount, setLineCount] = useState(1);
    const [startContent, setStartContent] = useState("")
    const editorRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        const newContent = editorRef.current?.innerText ?? "";
        setContent(newContent);
        console.log(content)
        if(editorRef.current) {
          const text = editorRef.current.innerText;
          const lines = text.split("\n");
          setLineCount(lines.length);
        }
    }
    
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
            <div className="editor-content" contentEditable suppressContentEditableWarning ref={editorRef} onInput={handleInput}>
              {startContent}
            </div>
          </div>
        </div>
    )
}

export default Editor;