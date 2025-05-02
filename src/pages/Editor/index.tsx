import { invoke } from "@tauri-apps/api/core";
import "./index.scss"

import { useEffect, useState } from "react";
import {useParams} from "react-router-dom";

function Editor() {
    const { uri } = useParams();
    const [content, setContent] = useState("")
    
    useEffect(() => {
        if (uri) {
          // Load file content from Tauri
          invoke("read_file_content", { path: uri })
            .then((res) => {
              setContent(res as string);
            })
            .catch((err) => {
              console.error("Failed to read file:", err);
              setContent(`Error loading file: ${err}`);
            });
        }
      }, [uri]);

    const finalContent = content.split("\n").map((line, index) => {
        return (index+1) + ". " + line + "\n";
    })

    return (
        <div className="editor" contentEditable>{finalContent}</div>
    )
}

export default Editor;