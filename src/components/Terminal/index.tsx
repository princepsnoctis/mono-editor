import { useEffect, useState } from 'react';
import './index.css'

const Terminal = () => {
  const [opened, setOpened] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() == 'j') {
        event.preventDefault();
        setOpened(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  })

  return (
    <div className={"terminal" + (!opened ? " hidden" : "")}>

    </div>
  )
}

export default Terminal;