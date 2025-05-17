import { invoke } from "@tauri-apps/api/core";
import "./index.scss";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TabBar from "../../components/TabBar";
import { useFiles } from "../../contexts/Files";

import Editor, { useMonaco } from '@monaco-editor/react'
import tomorrowNight from "./themes/Tomorrow-Night.json";

const EditorPage = () => {
  const monaco = useMonaco();
  const { uri } = useParams();
  const [content, setContent] = useState("");
  const [startContent, setStartContent] = useState("");
  const { openedFiles, setOpenedFiles } = useFiles();

  useEffect(() => {
    const file = openedFiles.find(file => file.path == uri);
    if (file?.content) {
      setContent(file.content ?? "");
    }
    else if (uri && uri != '/') {
      invoke("read_file_content", { path: uri })
      .then((res) => {
        setContent(res as string);
        setStartContent(res as string);
        const file = openedFiles.find(file => file.path == uri);
        if (file) {
          file.content = res as string;
        }
      })
      .catch((err) => {
        const errorMsg = "Failed to read file: " + err;
        console.error(errorMsg);
        setContent(errorMsg);
        setStartContent(errorMsg);
      });
    }
    else {
      setContent("");
      setStartContent("");
    }
  }, [uri]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() == 's') {
        event.preventDefault();
        invoke("save_to_file", { path: uri, content })
          .then(() => {
            const currentFile = openedFiles.find(file => file.path == uri);

            if (currentFile) {
              setStartContent(content);
              const updatedFile = { ...currentFile, isEdited: false };
              setOpenedFiles((prevFiles) =>
                  prevFiles.map(file => file.path == updatedFile.path ? updatedFile : file)
              );
            }
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
    const customTomorrowNight = {
      ...tomorrowNight,
      colors: {
        ...tomorrowNight.colors,
        'editor.background': '#161616',  // Twój nowy kolor tła
      }
    }
    if (monaco) {
      monaco.editor.defineTheme('TomorrowNight', customTomorrowNight as any);
      monaco.editor.setTheme('TomorrowNight');
    }
  }, [monaco]);

  function handleCodeChange(newValue: string | undefined) {
    const isEdited = newValue != startContent;
    setContent(newValue ?? "");
    setOpenedFiles(prev =>
      prev.map(f => f.path == uri ? { ...f, content: newValue, isEdited } : f)
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


  return (
    uri &&
    <div className="editor">
      <TabBar />
      <Editor 
        theme="TomorrowNight"
        value={content}
        language={getLanguageFromPath(uri)}
        path={uri}
        onChange={(value) => handleCodeChange(value)}
      />
    </div>
  );
}

export default EditorPage;