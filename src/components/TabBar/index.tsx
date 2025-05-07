import './index.scss'
import { useFiles } from '../../contexts/Files';
import { useLocation } from 'react-router-dom';

const TabBar = () => {
    const { pathname } = useLocation();
    const { openFile, openedFiles, closeFile } = useFiles();

    const activeFile = decodeURIComponent(pathname.split('/f/')[1])

    const filesEl = openedFiles.map((file, index) => {
        return (
            <div key={index+1} className={`tab-bar-item ${activeFile == file.path ? 'active' : ''}`} onClick={() => openFile(file)}>
                {file.name}
                <div className="icons">
                    <div className="close" onClick={() => closeFile(file)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 4 4" fill="none" width="90%" height="90%">
                            <path d="M-2 -2 L2 2" fill="white" stroke="white"/>
                            <path d="M-2 2 L2 -2" fill="white" stroke="white"/>
                        </svg>
                    </div>
                    <div className={`edited ${!file.isEdited ? 'hidden' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 4 4" fill="none" width="75%" height="75%">
                            <circle cx="0" cy="0" r="2" fill="white"/>
                        </svg>
                    </div>
                </div>
            </div>
        )
    })

    return (
        openedFiles.length > 0 && (
            <div className="tab-bar">
            { filesEl }
            <div className="right"></div>
            </div>
        )
    )
}

export default TabBar;