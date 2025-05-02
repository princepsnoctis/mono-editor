import './index.css'
import { getCurrentWindow } from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();

const Navigator = () => {
  const handleMinimize = () => {
    appWindow.minimize();
  };

  const handleMaximize = async () => {
    appWindow.toggleMaximize();
  };

  const handleClose = async () => {
    appWindow.close();
  };
  
  return (
    <div className="navigator">
      <button className="navigator-btn" id="minimize-btn" onClick={handleMinimize}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
          <rect width="10" height="1" x="1" y="6"/>
        </svg>
      </button>
      <button className="navigator-btn" id="maximize-btn" onClick={handleMaximize}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
          <rect width="9" height="9" x="1.5" y="1.5" fill="none"/>
        </svg>
      </button>
      <button className="navigator-btn" id="close-btn" onClick={handleClose}>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 9 9">
          <path d="M 0 0 L 9 9"/>
          <path d="M 0 9 L 9 0"/>
        </svg>
      </button>
    </div>
  )
}

export default Navigator