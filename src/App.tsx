import "./App.css";

import Navigator from "./components/Navigator";
import Terminal from "./components/Terminal";
import Files from "./components/Files";

function App() {
  return (
    <main className="container">
      <Navigator />
      <Files/>
      <Terminal />
    </main>
  )
}

export default App;