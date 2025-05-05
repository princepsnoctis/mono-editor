import { useEffect, useState } from "react";
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

    const [path, setPath] = useState<string>("assets/sample-project");
    const [files, setFiles] = useState<any[]>([]);
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
        result.then(files => {
            setFiles(files.map(file => {
                return {
                    name: file.name,
                    type: file.is_dir ? 'directory' : 'file',
                    extension: file.is_dir ? '' : file.name.split('.').pop() ?? '',
                    children: file.children,
                    path: file.path
                }}
            ))
        })
    }

    const openFile = (file: FileType) => {
        navigate(`/f/${encodeURIComponent(file.path)}`);
        if(openedFiles.find((f) => f.path == file.path))
            return;
        setOpenedFiles((prevFiles) => [...prevFiles, file]);
    };

    const closeFile = (file: FileType) => {
        setOpenedFiles((prevFiles) => prevFiles.filter((f) => f.path != file.path));
        navigate(`/f/${encodeURIComponent(files[files.length-1].path)}`);
    };

    useEffect(() => {
        loadFiles(path);
    }, [])


    return (
        <FilesContext.Provider value={{ files, openedFiles, loadFiles, createFile, createDirectory, openFile, closeFile }}>
            {children}
        </FilesContext.Provider>
    );
};



export default FilesProvider;