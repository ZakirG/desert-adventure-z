import "./GameWrapper.css";
import background from "./assets/backgrounds/1/background.png";
import punk_idle from "./assets/main-characters/punk/Punk_run.png";
import hyena_idle from "./assets/enemies/Hyena/Hyena_idle.png";
import { useState, useEffect, useRef } from "react";
import { GameLoop } from "./GameLoop";

export const GameWrapper = () => {
  let assetsDir = "../assets";
  const canvasRef = useRef();

  let [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = 800;
      canvasRef.current.height = 720;
      setAssetsLoaded(true);
      console.log("assetsLoaded");
    }
  }, []);

  return (
    <>
      <canvas id="canvas-1" ref={canvasRef}></canvas>
      <img id="background-1" src={background} className="spritesheet" />
      <img id="player-idle" src={punk_idle} className="spritesheet" />
      <img id="hyena-idle" src={hyena_idle} className="spritesheet" />

      {assetsLoaded ? <GameLoop /> : null}
    </>
  );
};
