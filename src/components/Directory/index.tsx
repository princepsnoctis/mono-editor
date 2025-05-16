import './index.css';

import DirectoryIcon from '@/assets/directoryIcons/directoryIcon.svg';
import OpenedDirectory from '@/assets/directoryIcons/openedDirectory.svg';
import ClosedDirectory from '@/assets/directoryIcons/closedDirectory.svg';
import File from '../File'
import { useEffect, useRef, useState } from 'react';

import DirectoryType from '../../model/DirectoryType'
import { useFiles } from '../../contexts/Files';

import { rename } from '@tauri-apps/plugin-fs';
import DirectoryMenu from '../DirectoryMenu';

const Directory = (props: DirectoryType) => {
  const [opened, setOpened] = useState(props.opened);
  const depth = props.depth ?? 0;
  const [menuVisible, setMenuVisible] = useState(false);
    const [editedText, setEditedText] = useState(props.name);
    const [isEditing, setIsEditing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef<HTMLDivElement>(null);

    const { setFiles, setOpenedFiles } = useFiles();
  
    const handleRightClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setMenuVisible(true);
      setPosition({ x: e.pageX, y: e.pageY });
    };
  
    useEffect(() => {
      if (!menuVisible) return;
  
      const handleClickOutside = (e: MouseEvent) => {
        if (!menuRef.current?.contains(e.target as Node))
          setMenuVisible(false);
      }
  
      const timeout = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('contextmenu', handleClickOutside);
      }, 0); // delay one tick to let the menu open first
      return () => {
        clearTimeout(timeout);
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('contextmenu', handleClickOutside);
      };
    }, [menuVisible]);

    const handleTextChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      setEditedText(event.target.value);
    };
  
    const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
      if (event.key == "Enter") {
        console.log(props.path)
        const newPath = `${props.path.split('/').slice(0, -1).join('/')}/${editedText}`
        console.log(newPath)
        try {
          rename(props.path, newPath);
        } 
        catch (err) {
          console.error('Rename failed', err);
        }
        const updateFileName = (file: any, path: string, newName: string) => {
          // If the current file has the path, update its name
          if ('path' in file && file.path === path) {
            return { ...file, name: newName, path: `${path.split('/').slice(0, -1).join('/')}/${editedText}` };
          }
        
          // If the file has children, recursively update the children
          if ('children' in file) {
            return {
              ...file,
              children: file.children.map((child: DirectoryType) => updateFileName(child, path, newName)) // Recursively call for children
            };
          }
        
          return file; // Return unchanged the file if no match
        };
        
        setFiles(prev => prev.map(file => updateFileName(file, props.path, editedText)));
        setOpenedFiles(prev => prev.map(file =>
          'path' in file && file.path == props.path ? { ...file, name: editedText, path: `${props.path.split(/[\\/]/).slice(0, -1).join('/')}/${editedText}` } : file
        ));
        setIsEditing(false); // Stop editing
      }
    };

  const children = opened ? props.children?.map((child, index) => {
    if (child.type == 'directory')
      return <Directory key={index} {...(child)} depth={depth+1} />;
    else
      return <File key={index} {...(child)} depth={depth+1} />;
  }) : null;

  return (
    <>
      <div className="directory" onClick={() => setOpened(prev => !prev)} style={{ paddingLeft: `${depth * 5}px` }} onContextMenu={handleRightClick}>
        <div className="arrow">
          <img className="arrow-icon" style={{ width: OpenedDirectory ? '10px' : '6px', height: OpenedDirectory ? '10px' : '6px' }} src={opened ? OpenedDirectory : ClosedDirectory} alt="Opened or closed directory"></img>
        </div>
        <img className="file-icon" src={DirectoryIcon} alt="Directory icon"></img>
        <div className="name">
          {
            isEditing ?
            <input value={editedText} className="file-name-input" type="text" onChange={handleTextChange} onKeyDown={handleKeyPress} autoFocus/>
            :
            <span>{props.name}</span>
          }
        </div>
        { menuVisible &&
          <DirectoryMenu directory={props} ref={menuRef} position={position} edit={() => setIsEditing(true)} closeMenu={() => setMenuVisible(false)}/>
        }
      </div>
      {children}
    </>
  )
}

export default Directory;