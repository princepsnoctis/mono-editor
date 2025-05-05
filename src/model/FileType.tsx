interface FileType {
    name: string;
    type: 'file';
    path: string;
    extension: string;
    depth?: number;
}

export default FileType;