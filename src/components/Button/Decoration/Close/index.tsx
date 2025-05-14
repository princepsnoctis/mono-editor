import "./index.scss"

import IconClose from "@assets/icons/close.svg?react"

import { getCurrentWindow } from "@tauri-apps/api/window";

const currentWindow = getCurrentWindow();

function ButtonDecorationClose() {
    const close = async () => {
        try {
            await currentWindow.close();
        } catch (error) {
            console.log('close error:', error);
        }
    };

    return (
        <div className="button button--decoration button--decoration--close" onClick={close}>
            <IconClose />
        </div>
    )
}

export default ButtonDecorationClose;