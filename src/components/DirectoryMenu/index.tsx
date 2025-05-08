import './index.css'

import DirectoryType from '../../model/DirectoryType';
import { forwardRef } from 'react';

import { remove } from '@tauri-apps/plugin-fs';
import { useFiles } from '../../contexts/Files';

interface FileMenuProps {
    directory: DirectoryType;
    position: { x: number, y: number };
    edit: () => void;
    closeMenu: () => void;
}

const DirectoryMenu = forwardRef<HTMLDivElement, FileMenuProps>((props, ref) => {
    const { loadFiles, path } = useFiles();

    const renameFile = () => {
        console.log(props.directory);
        props.edit();
        props.closeMenu();
    };

    const deleteFile = () => {
        remove(props.directory.path)
            .then(() => {
                /* 
                
                    ZOPTYMALIZUJ

                */
                loadFiles(path);
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

export default DirectoryMenu;
