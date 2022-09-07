import { useState, useEffect } from "react";
import { useAnimationFrame } from "./useAnimationFrame";

let distanceFormula = (point1, point2) => {
  let [x1, x2] = point1;
  let [y1, y2] = point2;
  return Math.sqrt(Math.pow(x2 - y2, 2) + Math.pow(x1 - y1, 2));
};

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
  attackRange,
  chaseRange,
  playerActivity,
  setPlayerActivity,
  setPlayerDirection,
  timeElapsed
) => {
  let [mostRecentJump, setMostRecentJump] = useState(0);

  let [mostRecentEnemyAttack, setMostRecentEnemyAttack] = useState(false);
  let timeToHurtPlayerFromAttackStart = 0.3; // todo: parametrize this
  let coolDownBetweenAttacks = 1.5; // todo: parametrize this
  let attackPhaseDuration = 1.4; // todo: make this a list with multiple possible values to be chosen at random

  const [enemyDirection, setEnemyDirection] = useState("right");
  const [enemyActivity, setEnemyActivity] = useState("idle");

  let [enemyX, setEnemyX] = useState(0);
  let [enemyY, setEnemyY] = useState(0);
  let [enemyVY, setEnemyVY] = useState(0);

  useAnimationFrame(
    (deltaTime) => {
      let enemyTranslationAmount = enemySpeed * deltaTime * 0.1;

      let playerCoordinate = [
        -1 * environmentX + playerStartX + playerX,
        playerY,
      ];
      let enemyCoordinate = [enemyX + enemyStartX, enemyY];

      if (playerCoordinate[0] > enemyCoordinate[0]) {
        setEnemyDirection("left");
      } else {
        setEnemyDirection("right");
      }

      let playerToEnemyDistance = distanceFormula(
        playerCoordinate,
        enemyCoordinate
      );

      if (
        playerToEnemyDistance < chaseRange &&
        playerToEnemyDistance > attackRange
      ) {
        setEnemyActivity("walk");
        let modifier = playerCoordinate[0] > enemyCoordinate[0] ? 1 : -1;
        setEnemyX(enemyX + modifier * enemyTranslationAmount);
      } else if (
        Math.abs(playerCoordinate[0] - enemyCoordinate[0]) < attackRange
      ) {
        setEnemyActivity("attack");
        if (enemyActivity !== "attack") {
          setMostRecentEnemyAttack(timeElapsed);
        }
      } else {
        setEnemyActivity("idle");
      }

      let injurePlayer =
        enemyActivity === "attack" &&
        timeElapsed > mostRecentEnemyAttack + timeToHurtPlayerFromAttackStart;

      if (injurePlayer) {
        setPlayerDirection(enemyDirection);
        setPlayerActivity("hurt");
        setMostRecentEnemyAttack(timeElapsed);
      }
    },
    [
      enemyDirection,
      enemyX,
      enemyY,
      enemyVY,
      timeElapsed,
      playerX,
      playerY,
      environmentX,
      environmentY,
    ]
  );

  return [enemyX, enemyY, enemyDirection, enemyActivity, setEnemyActivity];
};
