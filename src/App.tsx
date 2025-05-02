import "./App.scss";

import Navigator from "./components/Navigator";
import Terminal from "./components/Terminal";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <main className="container">
      <Navigator />
      <Sidebar/>
      <Terminal />
    </main>
  )
}

export default App;