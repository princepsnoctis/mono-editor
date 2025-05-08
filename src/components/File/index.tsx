import './index.css';

import { useLocation } from 'react-router-dom';

import TsxIcon from '@/assets/fileIcons/tsxType.svg';
import TsIcon from '@/assets/fileIcons/tsType.svg';
import JsIcon from '@/assets/fileIcons/jsType.svg';
import HtmlIcon from '@/assets/fileIcons/htmlType.svg';
import CssIcon from '@/assets/fileIcons/cssType.svg';
import DefaultIcon from '@/assets/directoryIcons/directoryIcon.svg';
import FileType from '../../model/FileType';
import { useFiles } from '../../contexts/Files';
import React, { useEffect, useRef, useState } from 'react';
import FileMenu from '../FileMenu';

import { rename } from '@tauri-apps/plugin-fs';

const extensionToIcon: Record<string, string> = {
  tsx: TsxIcon,
  ts: TsIcon,
  js: JsIcon,
  css: CssIcon,
  html: HtmlIcon,
};

const File = (props: FileType) => {
  const { pathname } = useLocation();
  const icon = extensionToIcon[props.extension ?? ''] ?? DefaultIcon;
  const [menuVisible, setMenuVisible] = useState(false);
  const [editedText, setEditedText] = useState(props.name);
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const { setFiles, setOpenedFiles, openFile } = useFiles();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (menuVisible) return;
    openFile(props);
  };

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
      const newPath = `${props.path.split('/').slice(0, -1).join('/')}/${editedText}`
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
            children: file.children.map((child: FileType) => updateFileName(child, path, newName)) // Recursively call for children
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

  const isActive = decodeURIComponent(pathname.split('/f/')[1]) == props.path;

  return (
    <div className={`file ${isActive ? ' active' : ''}`} style={{ paddingLeft: `${props.depth ? props.depth * 5 : 0}px` }} onClick={handleClick} onContextMenu={handleRightClick}>
      <div className="icon">
        <img className="icon" src={icon} alt="File icon"></img>
      </div>
      {
        isEditing ?
        <input value={editedText} className="file-name-input" type="text" onChange={handleTextChange} onKeyDown={handleKeyPress} autoFocus/>
        :
        <span className="name">{props.name}</span>
      }
      { menuVisible &&
        <FileMenu file={props} ref={menuRef} position={position} edit={() => setIsEditing(true)} closeMenu={() => setMenuVisible(false)}/>
      }
    </div>
  )
}

export default File;