import './index.css';

import Directory from '../Directory';
import File from '../File';
import type { DirectoryProps } from '../Directory';
import type { FileProps } from '../File';
import { useEffect, useState } from 'react';

import { invoke } from '@tauri-apps/api/core';

type FileInfo = {
  name: string;
  is_dir: boolean;
};

const Sidebar = () => {
  const [opened, setOpened] = useState(true);
  const [path, setPath] = useState<string>("assets/sample-project");
  const [files, setFiles] = useState<any>([]);

  const loadData = async (path: string): Promise<any[]> => {
    const result = await invoke<FileInfo[]>('read_directory', { path });
    const mapped = await Promise.all(result.map(async (file: FileInfo) => {
      const fullPath = `${path}\\${file.name}`;
      if(file.is_dir) {
        const children = await loadData(fullPath);
        return {
          name: file.name,
          is_dir: file.is_dir,
          type: 'directory',
          children: children ?? [],
        }
      }
      else {
        return {
          name: file.name,
          is_dir: file.is_dir,
          type: 'file',
          extension: file.name.split('.').pop() ?? '',
        }
      }
    }))

    return mapped;
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() == 'b') {
        event.preventDefault();
        setOpened(prev => !prev);
      }
    };

    console.log(path)
    const result = loadData(path);
    result.then(files => {
      console.log(files);
      setFiles(files.map(file => {
        return {
          name: file.name,
          type: file.is_dir ? 'directory' : 'file',
          extension: file.is_dir ? '' : file.name.split('.').pop() ?? '',
          children: file.children
        }}
      ))
    })
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const children = files.map((file: any, index: number) => {
    if(file.type == 'directory') {
      console.log(file.children)
      return <Directory key={file.name+index} name={file.name} type="directory" opened={true}>
        {file.children}
      </Directory>;
    }
    else
      return <File key={file.name+index} name={file.name} extension={file.extension} type="file"/>
  });

  return (opened &&
    <div className="files">
      {children}
    </div>
  );
}

export default Sidebar;