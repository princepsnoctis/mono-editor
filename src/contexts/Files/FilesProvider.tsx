import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { invoke } from "@tauri-apps/api/core";

import FileType from "../../model/FileType";
import DirectoryType from "../../model/DirectoryType";
import FilesContext from "./FilesContext";

type FileInfo = {
    name: string;
    is_dir: boolean;
};

const FilesProvider = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();

    const [path, setPath] = useState<string>("../sample-project");
    const [files, setFiles] = useState<(FileType | DirectoryType)[]>([]);
    const [openedFiles, setOpenedFiles] = useState<FileType[]>([]);

    const createFile = (file: FileType) => {
        setFiles((prevFiles) => [...prevFiles, file]);
        navigate(`/f/${file.path}`);
    };

    const createDirectory = (directory: DirectoryType) => {
        setFiles((prevFiles) => [...prevFiles, directory]);
    }

    const loadData = async (path: string): Promise<any[]> => {
        const result = await invoke<FileInfo[]>('read_directory', { path });
        const mapped = await Promise.all(result.map(async (file: FileInfo) => {
            const fullPath = `${path}/${file.name}`;
            if(file.is_dir) {
                const children = await loadData(fullPath);
                return {
                    name: file.name,
                    is_dir: file.is_dir,
                    type: 'directory' as const,
                    children: children ?? [],
                }
            }
            else {
                return {
                    name: file.name,
                    is_dir: file.is_dir,
                    type: 'file' as const,
                    extension: file.name.split('.').pop() ?? '',
                    path: fullPath
                }
            }
        }))
    
        return mapped;
    }

    const loadFiles = (path: string) => {
        const result = loadData(path);
        result.then(resultFiles => {
            setFiles(resultFiles.map(file => {
                if(file.is_dir) {
                    return {
                        name: file.name,
                        children: file.children,
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
            }) as (FileType | DirectoryType)[])
        })
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
        loadFiles(path);
    }, [path])


    const contextValue = useMemo(() => ({
        files,
        openedFiles,
        setOpenedFiles,
        loadFiles,
        createFile,
        createDirectory,
        openFile,
        closeFile
    }), [files, openedFiles, setOpenedFiles, loadFiles, createFile, createDirectory, openFile, closeFile]);
    
    return (
        <FilesContext.Provider value={contextValue}>
            {children}
        </FilesContext.Provider>
    );
};



export default FilesProvider;