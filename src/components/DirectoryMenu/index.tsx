import './index.css'

import DirectoryType from '../../model/DirectoryType';
import { Dispatch, forwardRef, SetStateAction } from 'react';

import { remove } from '@tauri-apps/plugin-fs';
import { useFiles } from '../../contexts/Files';

interface FileMenuProps {
    directory: DirectoryType;
    position: { x: number, y: number };
    edit: () => void;
    closeMenu: () => void;
    setIsCreating: Dispatch<SetStateAction<[boolean, string]>>;
}

const DirectoryMenu = forwardRef<HTMLDivElement, FileMenuProps>((props, ref) => {
    const { path, openedFiles, closeFile, deleteByPath } = useFiles();

    const newFile = () => {
        props.setIsCreating([true, "file"])
        props.closeMenu();
    }

    const newFolder = () => {
        props.setIsCreating([true, "directory"])
        props.closeMenu();
    }

    const copyPath = () => {
        navigator.clipboard.writeText(props.directory.path)
        props.closeMenu();
    }
    
    const copyRelativePath = () => {
        navigator.clipboard.writeText(props.directory.path.split(path + '/')[1])
        props.closeMenu();
    }

    const renameDirectory = () => {
        console.log(props.directory);
        props.edit();
        props.closeMenu();
    };

    const deleteDirectory = () => {
        remove(props.directory.path)
            .then(() => {
                deleteByPath(props.directory.path)
                props.closeMenu();
            })
            .catch((error) => {
                alert(`Error removing the file: ${error}`); // Handle error if file removal fails
                props.closeMenu();
            });
    };

    return (
        <div className='settings' ref={ref} style={{
            top: props.position.y,
            left: props.position.x,
        }}>
            <button onClick={newFile}>New File</button>
            <button onClick={newFolder}>New Folder</button>
            <hr/>
            <button onClick={copyPath}>Copy Path</button>
            <button onClick={copyRelativePath}>Copy Relative Path</button>
            <hr/>
            <button onClick={renameDirectory}>Rename</button>
            <button onClick={deleteDirectory}>Delete</button>
        </div>
    );
});

export default DirectoryMenu;
