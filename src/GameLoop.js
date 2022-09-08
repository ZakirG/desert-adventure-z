import { useCurrentlyPressed } from "./hooks/useCurrentlyPressed";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { useEnemyAI } from "./hooks/useEnemyAI";
import { useCoinBehavior } from "./hooks/useCoinBehavior";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { HUD } from "./HUD";
import { Coin } from "./Coin";
import { Environment } from "./Environment";
import background_1 from "./assets/backgrounds/background1.png";
import background_1_flip from "./assets/backgrounds/background1flip.png";

let controls = {
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
  const currentlyPressed = useCurrentlyPressed(controls);

  let playerWeight = 0.5;
  let playerSpeed = 6;

  let undergroundHeight = 100;

  let [playerStartX, playerStartY] = [350, -600 + undergroundHeight];

  let [
    playerX,
    playerY,
    playerDirection,
    setPlayerDirection,
    playerActivity,
    setPlayerActivity,
    environmentX,
    environmentY,
    playerVY,
    setPlayerVY,
    setEnvironmentVY,
    timeElapsed,
  ] = usePlayerMovement(playerWeight, playerSpeed, currentlyPressed, controls);

  let enemySpeed = 1.5;
  let attackRange = 45;
  let chaseRange = 320;
  let [enemyStartX, enemyStartY] = [700, 136];

  let [enemyX, enemyY, enemyDirection, enemyActivity, setEnemyActivity] =
    useEnemyAI(
      "hyena",
      enemyStartX,
      enemyStartY,
      playerStartX,
      playerX,
      playerY,
      environmentX,
      environmentY,
      enemySpeed,
      attackRange,
      chaseRange,
      playerActivity,
      setPlayerActivity,
      setPlayerDirection,
      playerVY,
      setPlayerVY,
      setEnvironmentVY,
      timeElapsed
    );

  let coinGroundY = 135;
  let range = (n) => [...Array(n).keys()];
  let coinXs = range(13).map((i) => i * 50 + 450);
  let groundCoins = coinXs.map((x, i) => ({ x: x, y: coinGroundY + 40 * i }));
  let coins = [...groundCoins];
  coins = useCoinBehavior(
    coins,
    playerX,
    playerY,
    playerStartX,
    playerStartY,
    environmentX,
    environmentY,
    timeElapsed
  );

  let numCoinsCollected = coins.filter(
    (coin) => coin.activity === "collected"
  ).length;

  return (
    <>
      <Environment
        environmentX={environmentX}
        environmentY={environmentY}
        currentlyPressed={currentlyPressed}
        gameHeight={gameHeight}
        gameWidth={gameWidth}
        imageSource={background_1}
        imageSource2={background_1_flip}
        undergroundHeight={undergroundHeight}
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
        {coins.map((coin, index) => {
          return (
            <Coin
              coinStartX={coin.x}
              coinStartY={coin.y}
              coinActivity={coin.activity}
              timeElapsed={timeElapsed}
              key={index}
            ></Coin>
          );
        })}
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
      <HUD numCoinsCollected={numCoinsCollected}></HUD>
    </>
  );
};
