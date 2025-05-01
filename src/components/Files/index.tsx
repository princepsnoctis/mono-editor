import './index.css';

import Directory from '../Directory';
import type { DirectoryProps } from '../Directory';
import type { FileProps } from '../File';

const Files = () => {
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

  return (
    <div className="files">
      <Directory name="src" type="directory" opened={true}>
        {children}
      </Directory>
    </div>
  )
}

export default Files;