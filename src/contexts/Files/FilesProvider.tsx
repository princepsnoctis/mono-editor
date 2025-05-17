import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { invoke } from "@tauri-apps/api/core";
import { watchImmediate, create, mkdir } from '@tauri-apps/plugin-fs';

import FileType from "../../model/FileType";
import DirectoryType from "../../model/DirectoryType";
import FilesContext from "./FilesContext";

import { open } from '@tauri-apps/plugin-dialog';

type FileInfo = {
    name: string;
    is_dir: boolean;
};

const FilesProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const ignoreNextChange = useRef(false);

    const [path, setPath] = useState<string>("");
    const [files, setFiles] = useState<(FileType | DirectoryType)[]>([]);
    const [openedFiles, setOpenedFiles] = useState<FileType[]>([]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Closing and Opening Explorer shortcut
            if(event.ctrlKey && event.key.toLowerCase() == 'o') {
                openFolder()
            }
          };

          const openFolder = async () => {
            const directory = await open({
              multiple: false,
              directory: true,
            });
            if(directory)
                setPath(directory.replace(/\\/g, '/'));
          }
        
          window.addEventListener('keydown', handleKeyDown);
          return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

    useEffect(() => {
        let unwatch: (() => void) | undefined;
    
        const watchChanges = async () => {
          unwatch = await watchImmediate(path, () => {
            if (ignoreNextChange.current) {
              // Ignore if the app itself triggered the change
              ignoreNextChange.current = false;
              return;
            }
    
            // External change, reload files
            loadFiles();
          });
        };
    
        loadFiles();       // Initial load
        watchChanges();    // Set up file watching
    
        return () => {
          if (unwatch) unwatch(); // Cleanup watcher on unmount
        };
      }, [path]);

    const createFile = async (file: FileType) => {
        ignoreNextChange.current = true;
        await create(file.path);
        await loadFiles();
        openFile(file);
    };

    const createDirectory = async (directory: DirectoryType) => {
        ignoreNextChange.current = true;
        await mkdir(directory.path)
        loadFiles()
    }

    const loadData = async (path: string): Promise<any[]> => {
        if(path == "") {
            return [];
        }
        const result = await invoke<FileInfo[]>('read_directory', { path });
        const mapped = await Promise.all(result.map(async (file: FileInfo) => {
            const fullPath = `${path}/${file.name}`;
            if(file.is_dir) {
                const children = await loadData(fullPath);
                return {
                    name: file.name,
                    is_dir: file.is_dir,
                    type: 'directory' as const,
                    path: fullPath,
                    children: children ?? [],
                    opened: false,
                }
            }
            else {
                return {
                    name: file.name,
                    is_dir: file.is_dir,
                    type: 'file' as const,
                    extension: file.name.split('.').pop() ?? '',
                    path: fullPath,
                    isEdited: false,
                }
            }
        }))
    
        return mapped;
    }

    const loadFiles = async (): Promise<void> => {
        const result = await loadData(path);
        setFiles(result.map(file => {
            if(file.is_dir) {
                return {
                    name: file.name,
                    children: file.children,
                    path: file.path,
                    type: 'directory',
                    opened: false,
                }
            }
            else {
                return {
                    name: file.name,
                    type: 'file',
                    path: file.path,
                    extension: file.name.split('.').pop(),
                    isEdited: false,
                }
            }
        }));
    }

    const openFile = (file: FileType) => {
        navigate(`/f/${encodeURIComponent(file.path)}`);
        if(openedFiles.find((f) => f.path == file.path))
            return;
        setOpenedFiles((prevFiles) => [...prevFiles, {...file, content: ""}]);
    };

    const closeFile = (file: FileType) => {
        const fileIndex = openedFiles.indexOf(file);
        if(openedFiles.length == 1)
            navigate('');
        else if(fileIndex == openedFiles.length - 1)
            navigate(`/f/${encodeURIComponent(openedFiles[fileIndex - 1].path)}`);
        else
            navigate(`/f/${encodeURIComponent(openedFiles[fileIndex + 1].path)}`);
        setOpenedFiles(prevFiles => prevFiles.filter(f => f.path != file.path));
    };

    function deleteByPath(path: string) {
        setOpenedFiles(prev =>prev.filter(file => !file.path.startsWith(path + "/") && file.path !== path));
        loadFiles();
    }

    useEffect(() => {
        setFiles([]);
        setOpenedFiles([]);
        navigate('');
    }, [path])

    const contextValue = useMemo(() => ({
        path,
        setPath,
        files,
        setFiles,
        openedFiles,
        setOpenedFiles,
        loadFiles,
        createFile,
        createDirectory,
        openFile,
        closeFile,
        deleteByPath
    }), [path, setPath, files, setFiles, openedFiles, setOpenedFiles, loadFiles, createFile, createDirectory, openFile, closeFile, deleteByPath]);
    
    return (
        <FilesContext.Provider value={contextValue}>
            {children}
        </FilesContext.Provider>
    );
};



export default FilesProvider;