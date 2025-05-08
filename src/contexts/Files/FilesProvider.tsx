import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { invoke } from "@tauri-apps/api/core";
import { watchImmediate, create, mkdir } from '@tauri-apps/plugin-fs';

import FileType from "../../model/FileType";
import DirectoryType from "../../model/DirectoryType";
import FilesContext from "./FilesContext";

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
        setOpenedFiles((prevFiles) => [...prevFiles, file]);
    };

    const closeFile = (file: FileType) => {
        setOpenedFiles(prevFiles => prevFiles.filter(f => f.path != file.path));
    };

    useEffect(() => {
        loadFiles();
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
        closeFile
    }), [path, setPath, files, setFiles, openedFiles, setOpenedFiles, loadFiles, createFile, createDirectory, openFile, closeFile]);
    
    return (
        <FilesContext.Provider value={contextValue}>
            {children}
        </FilesContext.Provider>
    );
};



export default FilesProvider;