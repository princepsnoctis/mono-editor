import TsxIcon from '@/assets/tsxType.svg';
import TsIcon from '@/assets/tsType.svg';
import JsIcon from '@/assets/jsType.svg';
import HtmlIcon from '@/assets/htmlType.svg';
import CssIcon from '@/assets/cssType.svg';
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
      <img className="icon" src={icon} alt="File icon"></img>
      <span className="name">{props.name}</span>
    </div>
  )
}

export default File;