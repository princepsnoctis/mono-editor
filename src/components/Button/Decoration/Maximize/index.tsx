import "./index.scss"

import {getCurrentWindow} from "@tauri-apps/api/window";

import IconMaximize from "@assets/icons/maximize.svg?react"

const currentWindow = getCurrentWindow();

function ButtonDecorationMaximize() {
    const maximize = async () => await currentWindow.toggleMaximize();

    return (
        <div className="button button--decoration button--decoration--maximize" onClick={maximize}>
            <IconMaximize />
        </div>
    )
}

export default ButtonDecorationMaximize;