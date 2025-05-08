import "./index.scss"

import Logo from "@assets/Square310x310Logo.png"

function StartPage() {
    return (
        <div className="start-page">
          <img src={Logo} alt="Mono Editor" />
        </div>
    )
}

export default StartPage;