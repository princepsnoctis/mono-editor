import "./App.scss";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Decoration from "./components/Decoration";
import Editor from "./pages/Editor";
import StartPage from "./pages/StartPage";
import FilesProvider from "./contexts/Files/FilesProvider";
import Explorer from "./components/Explorer";

function App() {
    return (
        <main className="app">
            <Router>
                <FilesProvider>
                    <Decoration/>

                    <div className="app__content">
                        <Explorer/>

                        <Routes>
                            <Route path="/f/:uri/*" element={<Editor />} />
                            <Route path="*" element={<StartPage />} />
                        </Routes>
                    </div>
                </FilesProvider>
            </Router>
        </main>
    )
}

export default App;