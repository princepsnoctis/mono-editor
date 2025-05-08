import { invoke } from "@tauri-apps/api/core";
import "./index.scss";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TabBar from "../../components/TabBar";
import { useFiles } from "../../contexts/Files";

function Editor() {
  const { openFile, openedFiles, setOpenedFiles } = useFiles();
  const { uri } = useParams();
  const [content, setContent] = useState("");
  const [startContent, setStartContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleInput = () => {
    const newContent = editorRef.current?.innerText ?? "";
    setContent(newContent);
    const isEdited = newContent !== startContent;

    const currentFile = openedFiles.find((file) => 'path' in file && file.path === uri);

    if (currentFile && 'isEdited' in currentFile) {
      const updatedFile = { ...currentFile, isEdited };

      setOpenedFiles((prevFiles) =>
          prevFiles.map((file) =>
              file.path === updatedFile.path ? updatedFile : file
          )
      );
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 's') {
        if (!uri) return;
        event.preventDefault();
        invoke("save_to_file", { path: uri, content: content })
            .catch((err) => {
              console.error("Failed to save file: " + err);
            });

        const currentFile = openedFiles.find((file) => 'path' in file && file.path === uri);

        if (currentFile && 'isEdited' in currentFile) {
          const updatedFile = { ...currentFile, isEdited: false };

          setOpenedFiles((prevFiles) =>
              prevFiles.map(file => file.path === updatedFile.path ? updatedFile : file)
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  useEffect(() => {
    if (uri && uri !== '/') {
      invoke("read_file_content", { path: uri })
          .then((res) => {
            setContent(res as string);
            setStartContent(res as string);
          })
          .catch((err) => {
            const errorMsg = "Failed to read file: " + err;
            console.error(errorMsg);
            setContent(errorMsg);
            setStartContent(errorMsg);
          });
    } else {
      setContent("");
      setStartContent("");
    }
  }, [uri]);

  useEffect(() => {
    if (openedFiles.length === 0) {
      navigate('/');
    } else {
      openFile(openedFiles[openedFiles.length - 1]);
    }
  }, [openedFiles.length]);

  function getLogicalLineCount(text: string) {
    return text.split('\n\n').flatMap(part => part.split('\n')).length;
  }

  const lineCount = getLogicalLineCount(content);

  return (
      uri &&
      <div className="editor">
        <TabBar />
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.execCommand('insertText', false, '\n');
                }
              }}
          >
            {startContent}
          </div>
        </div>
      </div>
  );
}

export default Editor;
