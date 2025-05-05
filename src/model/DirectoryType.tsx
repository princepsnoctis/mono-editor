import File from './FileType';

interface DirectoryType {
    name: string;
    children: Array<DirectoryType | File>;
    type: 'directory';
    opened: boolean;
    depth?: number;
}

export default DirectoryType;