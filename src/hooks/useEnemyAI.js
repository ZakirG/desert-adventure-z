import { useState, useEffect } from "react";
import { useAnimationFrame } from "./useAnimationFrame";

function playerIsToTheLeftOfEnemy(
  playerStartX,
  enemyX,
  enemyStartX,
  environmentX
) {
  return -1 * environmentX + playerStartX > enemyX + enemyStartX;
}

export const useEnemyAI = (
  enemyType,
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
) => {
  let [mostRecentJump, setMostRecentJump] = useState(0);

  let [enemyIsUsingAttack1, setEnemyIsUsingAttack1] = useState(false);
  let [mostRecentAttack1, setMostRecentAttack1] = useState(false);
  let attack1Duration = 0.7;

  const [enemyDirection, setEnemyDirection] = useState("right");
  const [enemyActivity, setEnemyActivity] = useState("idle");

  let [enemyX, setEnemyX] = useState(0);
  let [enemyY, setEnemyY] = useState(0);
  let [enemyVY, setEnemyVY] = useState(0);

  useAnimationFrame(
    (deltaTime) => {
      let enemyTranslationAmount = enemySpeed * deltaTime * 0.1;

      if (
        playerIsToTheLeftOfEnemy(
          playerStartX,
          enemyX,
          enemyStartX,
          environmentX
        )
      ) {
        setEnemyDirection("left");
      } else {
        setEnemyDirection("right");
      }

      if (
        enemyIsUsingAttack1 &&
        timeElapsed > mostRecentAttack1 + attack1Duration
      ) {
        setEnemyIsUsingAttack1(false);
        setEnemyActivity("idle");
      } else if (enemyIsUsingAttack1) {
        // no other actions allowed while attacking
        return;
      }

      // if (currentlyPressed.includes(attackKey1)) {
      //   setEnemyActivity("attack");
      //   setEnemyIsUsingAttack1(true);
      //   setMostRecentAttack1(timeElapsed);
      //   return;
      // }
    },
    [enemyDirection, enemyX, enemyY, enemyVY, timeElapsed]
  );

  return [enemyX, enemyY, enemyDirection, enemyActivity, setEnemyActivity];
};
