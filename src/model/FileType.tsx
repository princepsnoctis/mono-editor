interface FileType {
    name: string;
    type: 'file';
    path: string;
    content?: string;
    extension: string;
    depth?: number;
    isEdited: boolean;
}

export default FileType;