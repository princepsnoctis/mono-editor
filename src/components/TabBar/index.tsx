import './index.scss'
import { useFiles } from '../../contexts/Files';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FileType from '../../model/FileType';

const TabBar = () => {
    const { uri } = useParams();
    const { openFile, openedFiles, closeFile } = useFiles();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.ctrlKey) {
            const num = parseInt(event.key, 10);
            if (!isNaN(num) && num >= 1 && num <= 9) {
                event.preventDefault();
                const file = openedFiles[num - 1];
                if (file) openFile(file);
            }
          }
        };
      
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [openedFiles]);

    const handleTabMouseDown = (e: React.MouseEvent, file: FileType) => {
        if (e.button === 1) { // Middle mouse button
          e.preventDefault(); // Prevent browser default (e.g. auto-scroll)
          closeFile(file);
        }
      };

    const filesEl = openedFiles.map((file, index) => {
        return (
            <div key={index+1} className={`tab-bar-item ${uri == file.path ? 'active' : ''}`} onClick={() => openFile(file)} onMouseDown={(e) => handleTabMouseDown(e, file)}>
                {file.name}
                <div className="icons">
                    <div className="close" onClick={() => closeFile(file)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 4 4" width="100%" height="100%">
                            <path d="M-2 -2 L2 2" fill="white" stroke="white"/>
                            <path d="M-2 2 L2 -2" fill="white" stroke="white"/>
                        </svg>
                    </div>
                    {
                        file.isEdited &&
                        <div className={`edited`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 4 4" width="100%" height="100%">
                            <circle cx="0" cy="0" r="1.5" fill="white"/>
                        </svg>
                    </div>
                    }
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