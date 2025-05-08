import File from './FileType';

interface DirectoryType {
    name: string;
    children: Array<DirectoryType | File>;
    path: string;
    type: 'directory';
    opened: boolean;
    depth?: number;
}

export default DirectoryType;