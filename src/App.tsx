import "./App.scss";

import {BrowserRouter, Routes, Route} from "react-router-dom";

import Decoration from "./components/Decoration";
import Sidebar from "./components/Explorer";
import Editor from "./pages/Editor";
import StartPage from "./pages/StartPage";

function App() {
    return (
        <main className="app">
            <BrowserRouter>
                <Decoration/>

                <div className="app__content">
                    <Sidebar/>

                    <Routes>
                        <Route path="/f/:uri/*" element={<Editor />} />
                        <Route path="*" element={<StartPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </main>
    )
}

export default App;