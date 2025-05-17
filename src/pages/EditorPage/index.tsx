import { invoke } from "@tauri-apps/api/core";
import "./index.scss";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TabBar from "../../components/TabBar";
import { useFiles } from "../../contexts/Files";

import Editor from '@monaco-editor/react'

const EditorPage = () => {
  const { uri } = useParams();
  const [content, setContent] = useState("");

  const { openedFiles, setOpenedFiles } = useFiles();

  useEffect(() => {
    console.log(uri)
    console.log(openedFiles)
    const file = openedFiles.find(file => file.path == uri);
    if (file?.content) {
      setContent(file.content ?? "");
    }
    else if (uri && uri != '/') {
      invoke("read_file_content", { path: uri })
      .then((res) => {
        setContent(res as string);
        const file = openedFiles.find(file => file.path == uri);
        if (file) {
          file.content = res as string;
        }
      })
      .catch((err) => {
        const errorMsg = "Failed to read file: " + err;
        console.error(errorMsg);
        setContent(errorMsg);
      });
    }
    else {
      setContent("");
    }
    
  }, [uri]);

  function handleCodeChange(path: string, newValue: string | undefined) {
    setOpenedFiles(prev =>
      prev.map(f => f.path == path ? { ...f, content: newValue ?? '' } : f)
    );
  }

  function getLanguageFromPath(path: string): string {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.js') || path.endsWith('.jsx')) return 'javascript';
    if (path.endsWith('.html')) return 'html';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.json')) return 'json';
    return 'plaintext';
  }

  const language = getLanguageFromPath(uri ?? '');

  console.log(content)

  return (
    uri &&
    <div className="editor">
      <TabBar />
      <Editor 
        theme="vs-dark"
        value={content}
        language={language}
        path={uri}
        onChange={(value) => handleCodeChange(uri, value)}
      />
    </div>
  );
}

export default EditorPage;