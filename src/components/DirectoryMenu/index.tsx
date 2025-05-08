import './index.css'

import DirectoryType from '../../model/DirectoryType';
import { forwardRef } from 'react';

import { remove } from '@tauri-apps/plugin-fs';

interface FileMenuProps {
    directory: DirectoryType;
    position: { x: number, y: number };
    edit: () => void;
    closeMenu: () => void;
}

const DirectoryMenu = forwardRef<HTMLDivElement, FileMenuProps>((props, ref) => {
    const renameDirectory = () => {
        console.log(props.directory);
        props.edit();
        props.closeMenu();
    };

    const deleteDirectory = () => {
        remove(props.directory.path)
            .catch((error) => {
                console.error('Error removing the file:', error); // Handle error if file removal fails
            });
    };

    return (
        <div className='settings' ref={ref} style={{
            top: props.position.y,
            left: props.position.x,
        }}>
            <button onClick={renameDirectory}>Rename</button>
            <button onClick={deleteDirectory}>Delete</button>
        </div>
    );
});

export default DirectoryMenu;
