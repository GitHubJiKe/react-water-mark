import React, { useEffect, useRef, useCallback } from "react";

interface IConfig {
  /** 水印字体设置 */
  fontStyle: string;
  /** 水印字体颜色设置 */
  fontColor: string;
  /** 水印字体倾斜角度设置 */
  rotateAngle: number;
  /** canvas第一行文字起始X坐标 */
  firstLinePositionX: number;
  /** canvas第一行文字起始Y坐标 */
  firstLinePositionY: number;
  /** 水印内容是以此宽度进行背景重复展示实现的 通过调整次宽度控制水印的疏密程度 */
  width: number;
  /** 水印内容是以此高度进行背景重复展示实现的 通过调整次宽度控制水印的疏密程度*/
  height: number;
  /** 偏移量X基数 */
  translateX: number;
  /** 偏移量Y基数 */
  translateY: number;
}

type BoxStyle = Partial<Omit<IWaterMarkBoxStyle, "position">>;

interface IWaterMarkProps {
  /** 挂在的目标:element id */
  mountTarget?: string;
  /** 配置信息 */
  config?: Partial<IConfig>;
  /** 水印文本内容 */
  text: string;
  /** 水印的样式 */
  boxStyle?: BoxStyle;
  className?: string;
}

interface IWaterMarkBoxStyle {
  width: string;
  height: string;
  "pointer-events": string;
  opacity: number;
  top: number | string;
  left: number | string;
  right: number | string;
  bottom: number | string;
  position: "absolute" | "fixed";
  "z-index": number;
  display: "block" | "inline" | "inline-block";
  background?: string;
  visibility: "hidden" | "visible";
}

const defaultConfig: IConfig = {
  fontStyle: "14px 黑体",
  rotateAngle: -(20 * Math.PI) / 180,
  fontColor: "rgba(44, 46, 59, 0.06)",
  firstLinePositionX: 0,
  firstLinePositionY: 0,
  width: 220,
  height: 100,
  translateX: 110,
  translateY: 50,
};

const defaultBoxStyle: Partial<IWaterMarkBoxStyle> = {
  width: "100%",
  height: "100%",
  "pointer-events": "none",
  opacity: 1,
  top: 0,
  left: 0,
  position: "fixed",
  "z-index": 1000000,
  display: "block",
  visibility: "visible",
};

const WaterMarkClassName = "water-maker";

export default function WaterMark({
  mountTarget = "body",
  config,
  text,
  boxStyle,
  className,
}: IWaterMarkProps) {
  const mountTargetRef = useRef<HTMLElement | null>(null);
  const waterMarkBoxRef = useRef<HTMLElement | null>(null);
  const bgUrlRef = useRef("");
  const finalClassName = className
    ? `${WaterMarkClassName} ${className}`
    : WaterMarkClassName;

  const setBoxStyle = useCallback(() => {
    const mergedBoxStyle: Partial<IWaterMarkBoxStyle> = {
      ...defaultBoxStyle,
      ...boxStyle,
      background: `url(${bgUrlRef.current}) repeat`,
    };

    if (mountTarget !== "body") {
      mergedBoxStyle.position = "absolute";
    }

    Object.keys(mergedBoxStyle).forEach((key) => {
      const priority = ["opacity", "display", "visibility"].includes(key)
        ? "important"
        : "";
      waterMarkBoxRef.current!.style.setProperty(
        key,
        // @ts-ignore
        mergedBoxStyle[key],
        priority
      );
    });
  }, [boxStyle, mountTarget]);

  useEffect(() => {
    const observers: MutationObserver[] = [];

    function createWaterMarkBox() {
      const waterMarkBox = document.createElement("div");

      waterMarkBox.className = finalClassName;

      return waterMarkBox;
    }

    function getMountTarget() {
      if (mountTarget === "body") {
        return document.body;
      }

      const mountTargetEle = document.getElementById(mountTarget);

      setMountTargetPosition(mountTargetEle);

      return mountTargetEle;
    }

    function setMountTargetPosition(target: HTMLElement | null) {
      const ignorePositions = ["relative", "absolute"];

      if (ignorePositions.includes(target!.style.position)) {
        return;
      }

      target!.style.position = "relative";
    }

    function drawCanvas() {
      const mergedConfig = { ...defaultConfig, ...config };
      const canvas = document.createElement("canvas");

      canvas.width = mergedConfig.width;
      canvas.height = mergedConfig.height;

      const ctx = canvas.getContext("2d");

      if (ctx) {
        // 绘制水印到canvas上
        ctx.font = mergedConfig.fontStyle;
        ctx.fillStyle = mergedConfig.fontColor;
        ctx.translate(mergedConfig.translateX, mergedConfig.translateY);
        ctx.rotate(mergedConfig.rotateAngle); // 水印偏转角度
        ctx.fillText(
          text,
          mergedConfig.firstLinePositionX,
          mergedConfig.firstLinePositionY
        );
      }

      bgUrlRef.current = canvas.toDataURL();

      setBoxStyle();

      mountTargetRef.current?.appendChild(waterMarkBoxRef.current!);
    }

    function observeAttributesChange() {
      if (window.MutationObserver) {
        const config = {
          attributes: true,
          characterData: true,
          attributeOldValue: true,
          characterDataOldValue: true,
        };

        const attributesMutationObserver = new MutationObserver(
          (mutationsList) => {
            for (let index = 0; index < mutationsList.length; index++) {
              const mutation = mutationsList[index];

              if (mutation.type === "attributes") {
                if (
                  mutation.attributeName === "class" &&
                  mutation.oldValue === finalClassName
                ) {
                  waterMarkBoxRef.current!.className = finalClassName;
                }

                if (
                  mutation.attributeName === "style" &&
                  // @ts-ignore
                  mutation.target.className === finalClassName
                ) {
                  setBoxStyle();
                }
              }
            }
          }
        );

        attributesMutationObserver.observe(waterMarkBoxRef.current!, config);

        observers.push(attributesMutationObserver);
      }
    }

    function observeDOMChange() {
      if (window.MutationObserver) {
        const domMutationObserver = new MutationObserver((mutationsList) => {
          mutationsList.forEach((mutation) => {
            if (mutation.type === "childList") {
              mutation.removedNodes.forEach((item) => {
                if (item === waterMarkBoxRef.current) {
                  mountTargetRef.current!.appendChild(waterMarkBoxRef.current);
                }
              });
            }
          });
        });

        domMutationObserver.observe(mountTargetRef.current!, {
          childList: true,
        });

        observers.push(domMutationObserver);
      }
    }

    waterMarkBoxRef.current = createWaterMarkBox();

    mountTargetRef.current = getMountTarget();

    drawCanvas();

    observeAttributesChange();

    observeDOMChange();

    return () => {
      observers.forEach((v) => v.disconnect());

      if (mountTargetRef.current && waterMarkBoxRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mountTargetRef.current.removeChild(waterMarkBoxRef.current);
      }
    };
  }, [config, finalClassName, mountTarget, setBoxStyle, text]);

  return <></>;
}

/**
 * 用于某个模块的话，示例如下
 * 核心注意是父节点需要有id;
 * WaterMark的mountTarget为父节点的id
 */

// export function Demo() {
//     return (
//         <div id="demoId">
//             <WaterMark text="This is Demo" mountTarget="demoId" config={{ fontColor: 'red' }} />
//             <h1>Demo</h1>
//             <article>
//                 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//                 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//                 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//                 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//                 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//                 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//                 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//                 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//                 xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//             </article>
//         </div>
//     );
// }
