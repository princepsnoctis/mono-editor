import './index.css';

import DirectoryIcon from '@/assets/directoryIcons/directoryIcon.svg';
import OpenedDirectory from '@/assets/directoryIcons/openedDirectory.svg';
import ClosedDirectory from '@/assets/directoryIcons/closedDirectory.svg';
import File from '../File'
import type { FileProps } from '../File'
import { useState } from 'react';

export interface DirectoryProps {
  name: string;
  children: Array<DirectoryProps | FileProps>;
  type: 'directory';
  opened: boolean;
  depth?: number;
}

const Directory = (props: DirectoryProps) => {
  const [opened, setOpened] = useState(props.opened);
  const depth = props.depth ?? 0;

  console.log(props.children)

  const children = opened ? props.children?.map((child, index) => {
    console.log(child)
    if (child.type == 'directory')
      return <Directory key={index} {...(child)} depth={depth+1} />;
    else
      return <File key={index} {...(child)} depth={depth+1} />;
  }) : null;

  return (
    <>
      <div className="directory" onClick={() => setOpened(prev => !prev)} style={{ marginLeft: `${depth * 5}px` }}>
        <div className="arrow">
          <img className="arrow-icon" src={opened ? OpenedDirectory : ClosedDirectory} alt="Opened or closed directory"></img>
        </div>
        <img className="file-icon" src={DirectoryIcon} alt="Directory icon"></img>
        <span className="name">{props.name}</span>
      </div>
      {children}
    </>
  )
}

export default Directory;