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
    const { setFiles, setOpenedFiles } = useFiles();

    const renameFile = () => {
        console.log(props.file);
        props.edit();
        props.closeMenu();
    };

    const deleteFile = () => {
        // Attempt to remove the file from the file system
        remove(props.file.path)
            .then(() => {
                // If the file was successfully removed, update the state
                const updateFileName = (file: any, path: string) => {
                    // Remove the file if the path matches
                    if ('path' in file && file.path === path) {
                        return null; // Return null to indicate the file should be removed
                    }

                    // If the file has children, recursively remove the file from children
                    if ('children' in file) {
                        return {
                            ...file,
                            children: file.children.filter((child: FileType) => updateFileName(child, path) !== null) // Remove from children
                        };
                    }

                    return file; // Return unchanged file if no match
                };

                // Update the files state by filtering out the removed file
                setFiles(prev => prev.filter(file => {
                    if ('path' in file) {
                        return updateFileName(file, file.path) !== null;
                    }
                    return true; // Keep the file if it doesn't have a 'path' property
                }));

                // Update openedFiles state to remove the file if it matches the path
                setOpenedFiles(prev => prev.filter(file => file.path !== props.file.path)); // Use `props.file.path` instead of `props.path`

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
