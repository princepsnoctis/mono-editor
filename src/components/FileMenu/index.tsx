import './index.css'

import FileType from "../../model/FileType";
import { forwardRef } from 'react';

import { remove } from '@tauri-apps/plugin-fs';
import { useFiles } from '../../contexts/Files';

interface FileMenuProps {
    file: FileType;
    position: { x: number, y: number };
    edit: () => void;
    closeMenu: () => void;
}

const FileMenu = forwardRef<HTMLDivElement, FileMenuProps>((props, ref) => {
    const { path, loadFiles } = useFiles();

    const renameFile = () => {
        props.edit();
        props.closeMenu();
    };

    const deleteFile = () => {
        remove(props.file.path)
            .then(() => {
                /* 
                
                    ZOPTYMALIZUJ

                */
                loadFiles(path)
            })
            .catch((error) => {
                console.error('Error removing the file:', error); // Handle error if file removal fails
            });
    };

    return (
        <div className='settings' ref={ref} style={{
            top: props.position.y,
            left: props.position.x,
        }}>
            <button onClick={renameFile}>Rename</button>
            <button onClick={deleteFile}>Delete</button>
        </div>
    );
});

export default FileMenu;
