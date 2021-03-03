# React WaterMark

> 水印组件

[Demo](https://react-watermark-flax.vercel.app/)

### 属性

> 细节移步代码。

|       属性名       | required |
| :----------------: | -------- |
|    Text:string     | Yes      |
|  config：IConfig   | NO       |
| boxStyle:BoxStyle  | NO       |
|  className:string  | NO       |
| mountTarget:string | NO       |

### 默认是挂载到 body 上

```typescript
function App() {
  return <div className="App">
    <WaterMark text="App">
  </div>
}
```

### 挂载到具体的某个 dom 节点上

```typescript

function App() {
  return <div className="App">
    <div id="withWaterMark">I am div with water mark</div>
    <WaterMark text="I am div with water mark" mountTarget="withWaterMark">
  </div>
}
```
