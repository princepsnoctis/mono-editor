import './index.css';

import Directory from '../Directory';
import type { DirectoryProps } from '../Directory';
import type { FileProps } from '../File';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const [opened, setOpened] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() == 'b') {
        event.preventDefault();
        setOpened(prev => !prev);
      }
    };
  
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