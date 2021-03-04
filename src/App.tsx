import React, { useState } from "react";
import "./App.css";
import WaterMark from "./WaterMark";

function App() {
  const [showChildWaterMark, setShowChildWaterMark] = useState(false);
  return (
    <div className="App">
      <h1>
        Water Mark In React
        <button onClick={() => setShowChildWaterMark((c) => !c)}>
          toggle child WaterMark
        </button>
      </h1>
      <WaterMark
        text="AppAppAppAppAppAppApp"
        config={{
          fontColor: "#000",
          fontStyle: "20px 黑体",
          rotateAngle: (20 * Math.PI) / 180,
          width: 300,
          height: 300,
          translateX: 6,
          translateY: 150,
        }}
        boxStyle={{ left: "10px", "z-index": 999 }}
      />
      <div className="child" id="a">
        A
        {showChildWaterMark && (
          <WaterMark
            text="AAA"
            mountTarget="a"
            config={{ fontColor: "red", fontStyle: "25px 黑体" }}
          />
        )}
      </div>
      <div className="child" id="b">
        B
        {showChildWaterMark && (
          <WaterMark
            text="BBB"
            mountTarget="b"
            config={{ fontColor: "blue", fontStyle: "25px 黑体" }}
          />
        )}
      </div>
      <div className="child" id="c">
        C
        {showChildWaterMark && (
          <WaterMark
            text="CCC"
            mountTarget="c"
            config={{ fontColor: "orange", fontStyle: "25px 黑体" }}
          />
        )}
      </div>
      <div className="child" id="d">
        D
        {showChildWaterMark && (
          <WaterMark
            text="DDD"
            mountTarget="d"
            config={{ fontColor: "green", fontStyle: "25px 黑体" }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
