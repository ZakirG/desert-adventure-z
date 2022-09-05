import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "./GameWrapper.css";
import { GameLoop } from "./GameLoop";

const GameContainer = styled.div`
  position: absolute;
  width: 800px;
  height: 720px;
  border: 1px solid #eee;
  overflow: hidden;
  user-select: none;
  background-color: black;

  img.bg {
    position: absolute;
    width: 100%;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    min-width: 500px;
  }
`;

export const GameWrapper = () => {
  let assetsDir = "../assets";
  // const canvasRef = useRef();

  let [assetsLoaded, setAssetsLoaded] = useState(false);

  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const ctx = canvasRef.current.getContext("2d");
  //     canvasRef.current.width = 800;
  //     canvasRef.current.height = 720;
  //     setAssetsLoaded(true);
  //     console.log("assetsLoaded");
  //   }
  // }, []);

  return (
    <GameContainer>
      {/* <canvas id="canvas-1" ref={canvasRef}></canvas> */}
      {/* {assetsLoaded ? <GameLoop /> : null} */}
      <GameLoop />
    </GameContainer>
  );
};
