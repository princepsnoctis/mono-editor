import "./index.scss"

import ButtonDecorationMinimize from "../Button/Decoration/Minimize";
import ButtonDecorationMaximize from "../Button/Decoration/Maximize";
import ButtonDecorationClose from "../Button/Decoration/Close";

const Navigator = () => {
    return (
        <div className="navigator">
            <ButtonDecorationMinimize />
            <ButtonDecorationMaximize />
            <ButtonDecorationClose />
        </div>
    )
}

export default Navigator