import FileType from '../../model/FileType';
import DirectoryType from '../../model/DirectoryType';

interface FileContextType {
    files: FileType[];
    openedFiles: FileType[];
    loadFiles: (path: string) => void;
    createFile: (file: FileType) => void;
    createDirectory: (directory: DirectoryType) => void;
    openFile: (file: FileType) => void;
    closeFile: (file: FileType) => void;
}

export default FileContextType;