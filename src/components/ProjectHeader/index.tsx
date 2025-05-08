import "./index.scss"

interface ProjectHeaderProps {
    readonly title: string;
    setAdding: React.Dispatch<React.SetStateAction<[boolean, string]>>
}

function ProjectHeader(props: ProjectHeaderProps) {
    const addFile = () => {
        props.setAdding([true, "file"]);
    }
    
    const addDirectory = () => {
        props.setAdding([true, "directory"]);
    }

    return ( props.title &&
        <div className="project-header">
            <div className="project-header__title">{props.title ? props.title.toUpperCase() : ""}</div>
            <div className="project-header__right">
                <div className="project-header__right__addFile">
                    <button onClick={addFile}>+File</button>
                </div>
                <div className="project-header__right__addDirectory">
                    <button onClick={addDirectory}>+Dir</button>
                </div>
            </div>
        </div>
    )
}

export default ProjectHeader;