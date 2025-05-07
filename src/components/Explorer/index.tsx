import './index.scss';

import Directory from '../Directory';
import File from '../File';
import { useEffect, useState } from 'react';

import { useFiles } from '../../contexts/Files';

const Explorer = () => {
  const [opened, setOpened] = useState(true);
  const { files } = useFiles();

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

  const children = files.map((file: any, index: number) => {
    if(file.type == 'directory') {
      return <Directory key={file.name+index} name={file.name} type="directory" opened={true}>
        {file.children}
      </Directory>;
    }
    else
      return <File key={file.name+index} name={file.name} extension={file.extension} path={file.path} type="file" isEdited={file.isEdited}/>
  });

  return (opened &&
    <div className="explorer">
      {children}
    </div>
  );
}

export default Explorer;