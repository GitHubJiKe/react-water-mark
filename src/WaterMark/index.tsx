import React, { CSSProperties, useEffect } from "react";

// Canvas 文档
// https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D

interface IWaterMarkTextStyle {
  color?: string; // 字体颜色
  font?: string; // 字体样式
  rotate?: number; // 偏移角度
  textAlign?: "center" | "left" | "right" | "start" | "end"; // 文本的对齐方式
  textBaseline?:
    | "top"
    | "hanging"
    | "middle"
    | "alphabetic"
    | "ideographic"
    | "bottom"; // 文本基线
  direction?: "ltr" | "rtl" | "inherit"; // 当前文本方向 ltr:left to right,rtl: right to left,default : inherit
}

interface IWaterMarkProps {
  text: string;
  textStyle?: IWaterMarkTextStyle;
  width?: string;
  height?: string;
  children: React.ReactNode;
  containerStyle?: React.CSSProperties | null;
}

function createCanvasContext(width: string, height: string) {
  const canvas = document.createElement("canvas");

  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);

  return { canvas, cxt: canvas.getContext("2d") };
}

function getWaterMarkContainer() {
  let container = document.getElementById("water-mark-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "water-mark-container";
  }
  return container;
}

export default function WaterMark({
  width = "100%",
  height = "100%",
  textStyle = {
    color: "rgba(184, 184, 184, 0.6)",
    font: "20px Microsoft Yahei",
    rotate: 30,
    textAlign: "center",
    textBaseline: "middle",
    direction: "ltr",
  },
  text,
  children,
  containerStyle,
}: IWaterMarkProps) {
  useEffect(() => {
    const textX = text.length * 12 + "px";
    const textY = text.length * 7 + "px";
    const { cxt, canvas } = createCanvasContext(textX, textY);
    if (cxt) {
      const { textAlign, textBaseline, font, color, rotate } = textStyle;
      cxt.textAlign = textAlign!;
      cxt.textBaseline = textBaseline!;
      cxt.font = font!;
      cxt.fillStyle = color!;
      cxt.rotate((rotate! * Math.PI) / 180);
      cxt.fillText(
        text,
        text.length * 6,
        parseFloat((text.length / 3).toString())
      );

      const base64URL = canvas.toDataURL();

      const container = getWaterMarkContainer();

      container.style.width = width;
      container.style.height = height;
      container.style.backgroundImage = `url(${base64URL})`;
      container.style.pointerEvents = "none";
      container.style.backgroundRepeat = "repeat";
      container.style.position = containerStyle?.position!;
      // @ts-ignore
      container.style.top = containerStyle?.top!;

      // @ts-ignore
      container.style.left = containerStyle?.left!;
      container.style.zIndex = "1000";

      document.getElementById("water-mark")?.appendChild(container);
    }
  }, []);
  return <div id="water-mark">{children}</div>;
}
