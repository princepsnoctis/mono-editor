import "./index.scss"

import IconClose from "@assets/icons/close.svg?react"

import {getCurrentWindow} from "@tauri-apps/api/window";

const currentWindow = getCurrentWindow();

function ButtonDecorationClose() {
    const close = async () => await currentWindow.close();

    return (
        <div className="button button--decoration button--decoration--close" onClick={close}>
            <IconClose />
        </div>
    )
}

export default ButtonDecorationClose;