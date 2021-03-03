import React from "react";
import "./App.css";
import WaterMark from "./WaterMark";

function App() {
  return (
    <div className="App">
      <h1>Water Mark In React</h1>
      <WaterMark
        text="App"
        config={{
          fontColor: "#000",
          fontStyle: "20px 黑体",
          rotateAngle: (20 * Math.PI) / 180,
        }}
        boxStyle={{ left: "10px" }}
      />
      <div className="child" id="a">
        A
        <WaterMark
          text="AAA"
          mountTarget="a"
          config={{ fontColor: "red", fontStyle: "25px 黑体" }}
        />
      </div>
      <div className="child" id="b">
        B
        <WaterMark
          text="BBB"
          mountTarget="b"
          config={{ fontColor: "blue", fontStyle: "25px 黑体" }}
        />
      </div>
      <div className="child" id="c">
        C
        <WaterMark
          text="CCC"
          mountTarget="c"
          config={{ fontColor: "orange", fontStyle: "25px 黑体" }}
        />
      </div>
      <div className="child" id="d">
        D
        <WaterMark
          text="DDD"
          mountTarget="d"
          config={{ fontColor: "green", fontStyle: "25px 黑体" }}
        />
      </div>
    </div>
  );
}

export default App;
