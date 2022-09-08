import { useState, useEffect } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { distanceFormula } from "../utils.js";

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
  setPlayerVY,
  setEnvironmentVY,
  timeElapsed
) => {
  let [mostRecentEnemyAttack, setMostRecentEnemyAttack] = useState(0);
  let [mostRecentDirectionChange, setMostRecentDirectionChange] = useState(0);
  let timeToHurtPlayerFromAttackStart = 0.3; // todo: parametrize this
  let coolDownBetweenAttacks = 1.5;
  let directionChangeCoolDown = 1;

  const [enemyDirection, setEnemyDirection] = useState("right");
  const [enemyActivity, setEnemyActivity] = useState("idle");

  let [enemyX, setEnemyX] = useState(0);
  let [enemyY, setEnemyY] = useState(0);
  let [enemyVY, setEnemyVY] = useState(0);

  let [enemyDeathTime, setEnemyDeathTime] = useState(0);
  let timeForEnemyToDie = 1.5;

  let [enemyDisappearTime, setEnemyDisappearTime] = useState(0);
  let timeForEnemyToDisappear = 0.6;

  useAnimationFrame(
    (deltaTime) => {
      let enemyTranslationAmount = enemySpeed * deltaTime * 0.1;

      let playerCoordinate = [
        -1 * environmentX + playerStartX + playerX,
        playerY,
      ];
      let enemyCoordinate = [enemyX + enemyStartX, enemyY];

      if (
        enemyActivity === "death" &&
        timeElapsed > enemyDeathTime + timeForEnemyToDie
      ) {
        setEnemyActivity("disappear");
        setEnemyDisappearTime(timeElapsed);
        return;
      } else if (enemyActivity === "death") {
        return;
      }

      if (
        enemyActivity === "disappear" &&
        timeElapsed > enemyDisappearTime + timeForEnemyToDisappear
      ) {
        setEnemyActivity("gone");
        return;
      } else if (enemyActivity === "disappear") {
        return;
      } else if (enemyActivity === "gone") {
        return;
      }

      let playerIsToRightAndEnemyIsFacingRight =
        playerCoordinate[0] > enemyCoordinate[0] && enemyDirection === "left";
      let playerIsToLeftAndEnemyIsFacingLeft =
        playerCoordinate[0] <= enemyCoordinate[0] && enemyDirection === "right";
      let enemyIsFacingCorrectDirection =
        playerIsToRightAndEnemyIsFacingRight ||
        playerIsToLeftAndEnemyIsFacingLeft;

      if (
        playerCoordinate[0] > enemyCoordinate[0] &&
        timeElapsed > mostRecentDirectionChange + directionChangeCoolDown
      ) {
        setEnemyDirection("left");
        setMostRecentDirectionChange(timeElapsed);
        enemyIsFacingCorrectDirection = true;
      } else if (
        timeElapsed >
        mostRecentDirectionChange + directionChangeCoolDown
      ) {
        setEnemyDirection("right");
        setMostRecentDirectionChange(timeElapsed);
        enemyIsFacingCorrectDirection = true;
      }

      let playerToEnemyDistance = distanceFormula(
        playerCoordinate,
        enemyCoordinate
      );

      if (
        playerToEnemyDistance < chaseRange &&
        playerToEnemyDistance > attackRange &&
        enemyIsFacingCorrectDirection
      ) {
        setEnemyActivity("walk");
        let modifier = playerCoordinate[0] > enemyCoordinate[0] ? 1 : -1;
        setEnemyX(enemyX + modifier * enemyTranslationAmount);
      } else if (
        Math.abs(playerCoordinate[0] - enemyCoordinate[0]) < attackRange &&
        enemyIsFacingCorrectDirection
      ) {
        setEnemyActivity("attack");
        if (enemyActivity !== "attack") {
          setMostRecentEnemyAttack(timeElapsed);
        }
      } else {
        setEnemyActivity("idle");
      }

      if (
        playerCoordinate[1] > enemyCoordinate[1] + 4 &&
        playerToEnemyDistance < attackRange &&
        Math.abs(playerCoordinate[0] - enemyCoordinate[0]) < attackRange &&
        enemyActivity !== "death"
      ) {
        console.log("enemy dies.");
        setEnemyActivity("death");
        setEnemyDeathTime(timeElapsed);
        setPlayerVY(8);
        setEnvironmentVY(-8);
        setPlayerActivity("double_jump");
      }

      let injurePlayer =
        enemyActivity === "attack" &&
        timeElapsed > mostRecentEnemyAttack + timeToHurtPlayerFromAttackStart;

      if (injurePlayer) {
        setPlayerDirection(enemyDirection);
        setPlayerActivity("hurt");
        setMostRecentEnemyAttack(timeElapsed + coolDownBetweenAttacks);
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
