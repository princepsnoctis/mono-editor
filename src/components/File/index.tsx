import './index.css';
import TsxIcon from '@/assets/fileIcons/tsxType.svg';
import TsIcon from '@/assets/fileIcons/tsType.svg';
import JsIcon from '@/assets/fileIcons/jsType.svg';
import HtmlIcon from '@/assets/fileIcons/htmlType.svg';
import CssIcon from '@/assets/fileIcons/cssType.svg';
// import DefaultIcon from '@/assets/file.svg';

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
  extension: string;
  depth?: number;
}

const File = (props: FileProps) => {
  // const icon = extensionToIcon[props.extension ?? ''] ?? DefaultIcon;
  const icon = extensionToIcon[props.extension];

  return (
    <div className="file" style={{ marginLeft: `${props.depth ? props.depth * 5 : 0}px` }}>
      <div className="icon">
        <img className="icon" src={icon} alt="File icon"></img>
      </div>
      <span className="name">{props.name}</span>
    </div>
  )
}

export default File;