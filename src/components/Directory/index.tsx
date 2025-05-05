import './index.css';

import DirectoryIcon from '@/assets/directoryIcons/directoryIcon.svg';
import OpenedDirectory from '@/assets/directoryIcons/openedDirectory.svg';
import ClosedDirectory from '@/assets/directoryIcons/closedDirectory.svg';
import File from '../File'
import { useState } from 'react';

import DirectoryType from '../../model/DirectoryType'

const Directory = (props: DirectoryType) => {
  const [opened, setOpened] = useState(props.opened);
  const depth = props.depth ?? 0;

  const children = opened ? props.children?.map((child, index) => {
    if (child.type == 'directory')
      return <Directory key={index} {...(child)} depth={depth+1} />;
    else
      return <File key={index} {...(child)} depth={depth+1} />;
  }) : null;

  return (
    <>
      <div className="directory" onClick={() => setOpened(prev => !prev)} style={{ paddingLeft: `${depth * 5}px` }}>
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