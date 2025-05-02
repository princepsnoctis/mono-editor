import "./App.scss";

import {BrowserRouter, Routes, Route} from "react-router-dom";

import Decoration from "./components/Decoration";
import Sidebar from "./components/Sidebar";
import Editor from "./pages/Editor";

function App() {
    return (
        <main className="app">
            <BrowserRouter>
                <Decoration/>

                <div className="app__content">
                    <Sidebar/>

                    <Routes>
                        <Route path="*" element={<Editor />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </main>
    )
}

export default App;