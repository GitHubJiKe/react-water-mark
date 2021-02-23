import React from "react";
import "./App.css";
import WaterMark from "./WaterMark";

function App() {
  return (
    <div className="App">
      <WaterMark
        text="Peteryuan"
        width="300px"
        height="100px"
        containerStyle={{ position: "absolute", top: 0, left: "50%" }}
      >
        <header className="App-header">AAAAAAA</header>
      </WaterMark>
    </div>
  );
}

export default App;
