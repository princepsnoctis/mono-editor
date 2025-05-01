export interface FileProps {
  name: string;
  icon: string;
  type: 'file';
}

const File = (props: FileProps) => {
  return (
    <div className="file">
      <img className="icon" src={props.icon} alt="File icon"></img>
      <span className="name">{props.name}</span>
    </div>
  )
}

export default File;