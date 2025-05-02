import './index.css';

import Directory from '../Directory';
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
  const [path, setPath] = useState<string>('D:\\Programowanie\\Github\\mono-editor\\public\\projekt');
  const [files, setFiles] = useState<FileProps[]>([]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() == 'b') {
        event.preventDefault();
        setOpened(prev => !prev);
      }
    };

    const loadData = async () => {
      const result = await invoke<FileInfo[]>('read_directory', { path });
      return result;
    }

    const result = loadData();
    console.log(result)

    // const result = loadData();
    // result.map(file => {
    //   return {
    //     name: file.name,
    //     type: file.is_dir ? 'directory' : 'file',
    //     extension: file.is_dir ? '' : file.name.split('.').pop() ?? ''
    //   }
    // })
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const children: Array<DirectoryProps | FileProps> = [
    {
      name: 'index.tsx',
      type: 'file',
      extension: 'tsx'
    },
    {
      name: 'components',
      type: 'directory',
      opened: true,
      children: [
        {
          name: 'Button.tsx',
          type: 'file',
          extension: 'tsx',
        },
        {
          name: 'Header',
          type: 'directory',
          opened: false,
          children: [],
        },
      ],
    },
  ];

  return ( opened &&
    <div className="files">
      <Directory name="src" type="directory" opened={true}>
        {children}
      </Directory>
    </div>
  )
}

export default Sidebar;