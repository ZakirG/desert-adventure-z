import { useState } from "react";
import { useCurrentlyPressed } from "./hooks/useCurrentlyPressed";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { Player } from "./Player";
import { Environment } from "./Environment";
import background_1 from "./assets/backgrounds/1/background.png";

let WASDcontrols = {
  downKey: "KeyS",
  upKey: "KeyW",
  leftKey: "KeyA",
  rightKey: "KeyD",
  jumpKey: "Space",
  attackKey1: "KeyL",
  attackKey2: "KeyK",
};

let ArrowControls = {
  downKey: "ArrowDown",
  upKey: "ArrowUp",
  leftKey: "ArrowLeft",
  rightKey: "ArrowRight",
  jumpKey: "Space",
  attackKey1: "KeyA",
  attackKey2: "KeyS",
};

export const GameLoop = () => {
  let gameHeight = 720;
  let gameWidth = 800;
  let controls = ArrowControls;
  const currentlyPressed = useCurrentlyPressed(controls);

  let playerWeight = 0.5;
  let playerSpeed = 3;

  let [playerStartX, playerStartY] = [350, -600];

  let [
    playerX,
    playerY,
    playerDirection,
    playerActivity,
    environmentX,
    environmentY,
    timeElapsed,
  ] = usePlayerMovement(playerWeight, playerSpeed, currentlyPressed, controls);

  return (
    <>
      <Environment
        environmentX={environmentX}
        environmentY={environmentY}
        currentlyPressed={currentlyPressed}
        gameHeight={gameHeight}
        gameWidth={gameWidth}
        imageSource={background_1}
      ></Environment>
      <Player
        playerDirection={playerDirection}
        playerActivity={playerActivity}
        playerX={playerX}
        playerY={playerY}
        playerStartX={playerStartX}
        playerStartY={playerStartY}
        timeElapsed={timeElapsed}
      ></Player>
    </>
  );
};
