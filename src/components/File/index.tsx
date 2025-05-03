import './index.css';

import { useLocation, useNavigate } from 'react-router-dom';

import TsxIcon from '@/assets/fileIcons/tsxType.svg';
import TsIcon from '@/assets/fileIcons/tsType.svg';
import JsIcon from '@/assets/fileIcons/jsType.svg';
import HtmlIcon from '@/assets/fileIcons/htmlType.svg';
import CssIcon from '@/assets/fileIcons/cssType.svg';
import DefaultIcon from '@/assets/directoryIcons/directoryIcon.svg';

const extensionToIcon: Record<string, string> = {
  tsx: TsxIcon,
  ts: TsIcon,
  js: JsIcon,
  css: CssIcon,
  html: HtmlIcon,
};

export interface FileProps {
  name: string;
  type: 'file';
  path: string;
  extension: string;
  depth?: number;
}

const File = (props: FileProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const icon = extensionToIcon[props.extension ?? ''] ?? DefaultIcon;

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click event from bubbling up to parent elements
    navigate(`/f/${encodeURIComponent(props.path)}`);
  };

  const isActive = decodeURIComponent(pathname.split('/f/')[1]) == props.path;

  return (
    <div className={`file ${isActive ? ' active' : ''}`} style={{ paddingLeft: `${props.depth ? props.depth * 5 : 0}px` }} onClick={handleClick}>
      <div className="icon">
        <img className="icon" src={icon} alt="File icon"></img>
      </div>
      <span className="name">{props.name}</span>
    </div>
  )
}

export default File;