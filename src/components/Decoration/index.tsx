import "./index.scss"

import ButtonDecorationMinimize from "../Button/Decoration/Minimize";
import ButtonDecorationMaximize from "../Button/Decoration/Maximize";
import ButtonDecorationClose from "../Button/Decoration/Close";

const Decoration = () => {
    return (
        <div className="decoration">
            <ButtonDecorationMinimize />
            <ButtonDecorationMaximize />
            <ButtonDecorationClose />
        </div>
    )
}

export default Decoration