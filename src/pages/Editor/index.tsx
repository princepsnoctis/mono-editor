import "./index.scss"
import {useParams} from "react-router-dom";


function Editor() {
    const { uri } = useParams();

    return (
        <div className="editor">{uri}</div>
    )
}

export default Editor;