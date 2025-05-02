import "./index.scss"

import {getCurrentWindow} from "@tauri-apps/api/window";

import IconMinimize from "@assets/icons/minimize.svg?react"

const currentWindow = getCurrentWindow();

function ButtonDecorationMinimize() {
    const minimize = async () => await currentWindow.minimize();

    return (
        <div className="button button--decoration button--decoration--minimize" onClick={minimize}>
            <IconMinimize />
        </div>
    )
}

export default ButtonDecorationMinimize;