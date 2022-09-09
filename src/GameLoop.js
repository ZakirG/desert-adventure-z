import { useCurrentlyPressed } from "./hooks/useCurrentlyPressed";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { useEnemyAI } from "./hooks/useEnemyAI";
import { usePlatformPhysics } from "./hooks/usePlatformPhysics";
import { useCoinBehavior } from "./hooks/useCoinBehavior";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { Platform } from "./Platform";
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
  let playerSpeed = 5.5;

  let undergroundHeight = 100;

  let [playerStartX, playerStartY] = [350, -600 + undergroundHeight];

  let [
    playerX,
    playerY,
    setPlayerY,
    playerDirection,
    setPlayerDirection,
    playerActivity,
    setPlayerActivity,
    environmentX,
    environmentY,
    setEnvironmentY,
    playerVY,
    setPlayerVY,
    setEnvironmentVY,
    playerOnPlatform,
    setPlayerOnPlatform,
    timeElapsed,
  ] = usePlayerMovement(playerWeight, playerSpeed, currentlyPressed, controls);

  let enemySpeed = 1.5;
  let attackRange = 45;
  let chaseRange = 320;
  let [enemyStartX, enemyStartY] = [700, 55];

  let enemies = [
    { startX: 700, startY: 55, type: "hyena" },
    { startX: 900, startY: 55, type: "hyena" },
    { startX: 1300, startY: 55, type: "hyena" },
  ];
  enemies = useEnemyAI(
    enemies,
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

  let coinGroundY = 53;
  let range = (n) => [...Array(n).keys()];
  let coinXs = range(13).map((i) => i * 50 + 450);
  let groundCoins = coinXs.map((x, i) => ({ x: x, y: coinGroundY + 40 * i }));
  let platformCoins = [{ x: 1282, y: 257 }];

  let coins = [...groundCoins, ...platformCoins];
  coins = useCoinBehavior(
    coins,
    coinGroundY,
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

  let platforms = [{ width: 1, height: 1, platformX: 1200, platformY: 200 }];
  usePlatformPhysics(
    platforms[0],
    playerStartX,
    playerX,
    playerY,
    setPlayerY,
    environmentX,
    environmentY,
    setEnvironmentY,
    setPlayerActivity,
    playerVY,
    setPlayerVY,
    setEnvironmentVY,
    playerOnPlatform,
    setPlayerOnPlatform,
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
        imageSource2={background_1_flip}
        undergroundHeight={undergroundHeight}
      >
        {enemies.map((enemy, index) => {
          return (
            <Enemy
              enemyType={enemy.type}
              enemyX={enemy.x}
              enemyY={enemy.y}
              enemyStartX={enemy.startX}
              enemyStartY={enemy.startY}
              enemyDirection={enemy.direction}
              enemyActivity={enemy.activity}
              timeElapsed={timeElapsed}
              key={index}
            ></Enemy>
          );
        })}

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
        {platforms.map((platform, index) => {
          return (
            <Platform
              platformX={platform.platformX}
              platformY={platform.platformY}
              width={platform.width}
              height={platform.height}
              key={index}
            ></Platform>
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
