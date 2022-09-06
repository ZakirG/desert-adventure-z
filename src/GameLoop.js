import { useCurrentlyPressed } from "./hooks/useCurrentlyPressed";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { useEnemyAI } from "./hooks/useEnemyAI";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
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
    setPlayerActivity,
    environmentX,
    environmentY,
    timeElapsed,
  ] = usePlayerMovement(playerWeight, playerSpeed, currentlyPressed, controls);

  let enemySpeed = 1;
  let [enemyStartX, enemyStartY] = [700, 136];

  let [enemyX, enemyY, enemyDirection, enemyActivity] = useEnemyAI(
    "hyena",
    enemyStartX,
    enemyStartY,
    playerStartX,
    playerX,
    playerY,
    environmentX,
    environmentY,
    enemySpeed,
    playerActivity,
    setPlayerActivity,
    timeElapsed
  );

  return (
    <>
      <Environment
        environmentX={environmentX}
        environmentY={environmentY}
        currentlyPressed={currentlyPressed}
        gameHeight={gameHeight}
        gameWidth={gameWidth}
        imageSource={background_1}
      >
        <Enemy
          enemyType="hyena"
          enemyX={enemyX}
          enemyY={enemyY}
          enemyStartX={enemyStartX}
          enemyStartY={enemyStartY}
          enemyDirection={enemyDirection}
          enemyActivity={enemyActivity}
          timeElapsed={timeElapsed}
        ></Enemy>
      </Environment>
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
