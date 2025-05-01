import DirectoryIcon from '@assets/fileIcon.png'
import File from '../File'
import type { FileProps } from '../File'

interface DirectoryProps {
  name: string;
  children: Array<DirectoryProps | FileProps>;
  type: 'directory';
  opened: boolean;
}

const Directory = (props: DirectoryProps) => {
  const children = props.children.map((child, index) => {
    if (child.type === 'directory')
      return <Directory key={index+1} {...(child)} />;
    else
      return <File key={index+1} {...(child)} />;
  });

  const ArrowIcon = props.opened ? '@assets/openedDirectory.png' : '@assets/closedDirectory.png';

  return (
    <div className="file">
      <img className="arrow-icon" src={ArrowIcon} alt="Opened or closed directory"></img>
      <img className="file-icon" src={DirectoryIcon} alt="Directory icon"></img>
      <span className="name">{props.name}</span>
      { children }
    </div>
  )
}

export default Directory;