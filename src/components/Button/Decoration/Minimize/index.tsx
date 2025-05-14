import "./index.scss"

import {getCurrentWindow} from "@tauri-apps/api/window";

import IconMinimize from "@assets/icons/minimize.svg?react"

const currentWindow = getCurrentWindow();

function ButtonDecorationMinimize() {
    const minimize = async () => {
        try {
            await currentWindow.minimize();
        } catch (error) {
            console.log('close error:', error);
        }
    };

    return (
        <div className="button button--decoration button--decoration--minimize" onClick={minimize}>
            <IconMinimize />
        </div>
    )
}

export default ButtonDecorationMinimize;