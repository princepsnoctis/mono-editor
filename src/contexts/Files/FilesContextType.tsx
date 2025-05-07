import FileType from '../../model/FileType';
import DirectoryType from '../../model/DirectoryType';

interface FileContextType {
    path: string;
    setPath: React.Dispatch<React.SetStateAction<string>>;
    files: (FileType | DirectoryType)[];
    openedFiles: FileType[];
    setOpenedFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
    loadFiles: (path: string) => void;
    createFile: (file: FileType) => void;
    createDirectory: (directory: DirectoryType) => void;
    openFile: (file: FileType) => void;
    closeFile: (file: FileType) => void;
}

export default FileContextType;