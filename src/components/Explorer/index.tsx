import './index.scss';

import Directory from '../Directory';
import File from '../File';
import { useEffect, useRef, useState } from 'react';

import { useFiles } from '../../contexts/Files';

import { open } from '@tauri-apps/plugin-dialog';
import ProjectHeader from "../ProjectHeader";
import FileType from '../../model/FileType';
import DirectoryType from '../../model/DirectoryType';

const Explorer = () => {
  const { files, path, setPath, createFile, createDirectory } = useFiles();
  const [opened, setOpened] = useState(true);
  const [addingFileOrDir, setAddingFileOrDir] = useState<[boolean, string]>([false, ""]);
  const inputValueRef = useRef<HTMLInputElement>(null);

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

  const openFolder = async () => {
    const directory = await open({
      multiple: false,
      directory: true,
    });
    setPath(directory?.replace(/\\/g, '/') ?? '');
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(!inputValueRef.current?.value) {
      return;
    }
    if(event.key == "Enter") {
      if(addingFileOrDir[1] == "file") {
        const split = inputValueRef.current.value.split('.')
        const file: FileType = {
          name: inputValueRef.current.value,
          type: 'file',
          extension: split[split.length-1],
          path: path + '/' + inputValueRef.current.value,
          isEdited: false,
        }
        createFile(file)
      }
      else if(addingFileOrDir[1] == "directory") {
        const directory: DirectoryType = {
          name: inputValueRef.current.value,
          type: 'directory',
          path: path + '/' + inputValueRef.current.value,
          children: [],
          opened: false
        }
        createDirectory(directory)
      }
      setAddingFileOrDir([false, ""]);
    }
  }

  const children = files.map((file: any, index: number) => {
    if(file.type == 'directory') {
      return <Directory key={file.name+index} path={file.path} name={file.name} type="directory" opened={file.opened}>
        {file.children}
      </Directory>;
    }
    else
      return <File key={file.name+index} name={file.name} extension={file.extension} path={file.path} type="file" isEdited={file.isEdited}/>
  });

  return (opened &&
    <div className="explorer">
      <ProjectHeader title={path.split('/').pop() ?? "Project"} setAdding={setAddingFileOrDir}/>
      { addingFileOrDir[0] && 
        <input type="text" placeholder={addingFileOrDir[1] == "file" ? "File name" : "Directory name"} autoFocus onBlur={() => setAddingFileOrDir([false, ""])} onKeyDown={handleKeyDown} ref={inputValueRef}/>
      }
      {children}
      { path == '' && 
        <button className="open-folder" onClick={openFolder}>
          Open Folder
        </button>
      }
    </div>
  );
}

export default Explorer;