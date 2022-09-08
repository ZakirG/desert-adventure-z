import { useCurrentlyPressed } from "./hooks/useCurrentlyPressed";
import { usePlayerMovement } from "./hooks/usePlayerMovement";
import { useEnemyAI } from "./hooks/useEnemyAI";
import { useCoinBehavior } from "./hooks/useCoinBehavior";
import { Player } from "./Player";
import { Enemy } from "./Enemy";
import { Coin } from "./Coin";
import { Environment } from "./Environment";
import background_1 from "./assets/backgrounds/1/background.png";

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
  let playerSpeed = 3;

  let [playerStartX, playerStartY] = [350, -600];

  let [
    playerX,
    playerY,
    playerDirection,
    setPlayerDirection,
    playerActivity,
    setPlayerActivity,
    environmentX,
    environmentY,
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
      setPlayerVY,
      setEnvironmentVY,
      timeElapsed
    );

  let coinGroundY = 139;
  let range = (n) => [...Array(n).keys()];
  let coinXs = range(10).map((i) => i * 50 + 450);
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
    </>
  );
};
