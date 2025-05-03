import { useState } from 'react';
import './index.scss'

const TabBar = () => {
    const [files, setFiles] = useState([{name: "File1"}, {name: "Sth"}, {name: "New File"}]);
    const [activeTab, setActiveTab] = useState(1);

    const filesEl = files.map((file, index) => {
        return (
            <div key={index+1} className={`tab-bar-item ${activeTab == index ? 'active' : ''}`} onClick={() => setActiveTab(index)}>
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