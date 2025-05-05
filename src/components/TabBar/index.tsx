import './index.scss'
import { useFiles } from '../../contexts/Files';
import { useLocation } from 'react-router-dom';

const TabBar = () => {
    const { pathname } = useLocation();
    const { openFile, openedFiles } = useFiles();

    const activeFile = decodeURIComponent(pathname.split('/f/')[1])

    const filesEl = openedFiles.map((file, index) => {
        return (
            <div key={index+1} className={`tab-bar-item ${activeFile == file.path ? 'active' : ''}`} onClick={() => openFile(file)}>
                {file.name}
            </div>
        )
    })

    return (
        <div className="tab-bar">
            { filesEl }
            <div className="right"></div>
        </div>
    )
}

export default TabBar;