import { useCurrentlyPressed } from "./hooks/useCurrentlyPressed";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { useEnemyAI } from "./hooks/useEnemyAI";
import { usePlatformPhysics } from "./hooks/usePlatformPhysics";
import { useCoinBehavior } from "./hooks/useCoinBehavior";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { Platform } from "./Platform";
import { FinishLine } from "./FinishLine";
import { HUD } from "./HUD";
import { FinishScreen } from "./FinishScreen";
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

  let [finishLineX, finishLineY] = [3500, 55];
  let levelNumber = 1;

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
    finishLineReached,
    timeElapsed,
  ] = usePlayerMovement(
    playerWeight,
    playerSpeed,
    currentlyPressed,
    controls,
    finishLineX,
    finishLineY
  );

  let enemySpeeds = { hyena: 1.4, dog: 1.6 };
  let attackRange = 45;
  let chaseRange = 320;
  let [enemyStartX, enemyStartY] = [700, 55];

  let enemies = [
    { startX: 700, startY: 55, type: "hyena" },
    { startX: 1300, startY: 55, type: "dog" },
    { startX: 2000, startY: 55, type: "hyena" },
    { startX: 2600, startY: 55, type: "hyena" },
    { startX: 2900, startY: 55, type: "dog" },
  ];
  enemies = useEnemyAI(
    enemies,
    playerStartX,
    playerX,
    playerY,
    environmentX,
    environmentY,
    enemySpeeds,
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
  let coinArcRadius = 13;

  let coinXsA = range(coinArcRadius).map((i) => i * 50 + 450);
  let coinArcA = coinXsA.map((x, i) => ({ x: x, y: coinGroundY + 40 * i }));
  // let coinArcB = coinXsA.map((x, i) => ({
  //   x: x,
  //   y: coinGroundY + 40 * i + 35,
  // }));

  let coinXsC = range(coinArcRadius).map(
    (i) => i * 50 + 450 + 50 * coinArcRadius
  );
  let coinArcC = coinXsC.map((x, i) => ({
    x: x,
    y: coinGroundY + 520 - 40 * i,
  }));

  // let coinArcD = coinXsC.map((x, i) => ({
  //   x: x,
  //   y: coinGroundY + 520 - 40 * i + 35,
  // }));

  let coinXsE = range(30).map((i) => i * 50 + 450 + coinArcRadius * 2 * 50);
  let coinArcE = coinXsE.map((x, i) => ({ x: x, y: coinGroundY }));

  let coins = [...coinArcA, ...coinArcC, ...coinArcE];

  // let platformCoins = [{ x: 1282, y: 257 }];

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

  // let platformXs = range(3).map((i) => i * 200 + 1200);
  // let platforms = platformXs.map((x, i) => ({
  //   platformX: x,
  //   platformY: 500 + 100 * i,
  //   width: 1,
  //   height: 1,
  // }));

  // usePlatformPhysics(
  //   platforms[0],
  //   playerStartX,
  //   playerX,
  //   playerY,
  //   setPlayerY,
  //   environmentX,
  //   environmentY,
  //   setEnvironmentY,
  //   setPlayerActivity,
  //   playerVY,
  //   setPlayerVY,
  //   setEnvironmentVY,
  //   playerOnPlatform,
  //   setPlayerOnPlatform,
  //   timeElapsed
  // );

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
        {/* {platforms.map((platform, index) => {
          return (
            <Platform
              platformX={platform.platformX}
              platformY={platform.platformY}
              width={platform.width}
              height={platform.height}
              key={index}
            ></Platform>
          );
        })} */}
        <FinishLine
          finishLineX={finishLineX}
          finishLineY={finishLineY}
          timeElapsed={timeElapsed}
        ></FinishLine>
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
      <FinishScreen
        numCoinsCollected={numCoinsCollected}
        levelNumber={levelNumber}
        timeElapsed={timeElapsed}
        finishLineReached={finishLineReached}
      ></FinishScreen>
    </>
  );
};
