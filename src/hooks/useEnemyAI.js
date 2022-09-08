import { useState, useEffect } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { distanceFormula } from "../utils.js";

function arraySetter(stateArray, setFunction, newValue, index) {
  console.log("array setter to ", newValue);
  let clone = [...stateArray];
  clone[index] = newValue;
  setFunction(clone);
}

export const useEnemyAI = (
  enemies,
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
) => {
  let numEnemies = enemies.length;

  let [mostRecentEnemyAttack, setMostRecentEnemyAttack] = useState(
    Array(numEnemies).fill(0)
  );
  let [mostRecentDirectionChange, setMostRecentDirectionChange] = useState(
    Array(numEnemies).fill(0)
  );
  let timeToHurtPlayerFromAttackStart = 0.3; // todo: parametrize this
  let coolDownBetweenAttacks = 1.5;
  let directionChangeCoolDown = 1;

  const [enemyDirection, setEnemyDirection] = useState(
    Array(numEnemies).fill("right")
  );
  const [enemyActivity, setEnemyActivity] = useState(
    Array(numEnemies).fill("idle")
  );

  let [enemyX, setEnemyX] = useState(Array(numEnemies).fill(0));
  let [enemyY, setEnemyY] = useState(Array(numEnemies).fill(0));
  let [enemyVY, setEnemyVY] = useState(Array(numEnemies).fill(0));

  let [enemyDeathTime, setEnemyDeathTime] = useState(Array(numEnemies).fill(0));
  let timeForEnemyToDie = 1;

  let [enemyDisappearTime, setEnemyDisappearTime] = useState(
    Array(numEnemies).fill(0)
  );
  let timeForEnemyToDisappear = 0.6;

  useAnimationFrame(
    (deltaTime) => {
      let enemyTranslationAmount = enemySpeed * deltaTime * 0.1;

      let playerCoordinate = [
        -1 * environmentX + playerStartX + playerX,
        playerY + environmentY,
      ];

      for (let i = 0; i < numEnemies; i++) {
        let enemyCoordinate = [enemyX[i] + enemyStartX[i], enemyY[i]];

        // console.log("player coordinate: ", playerCoordinate);

        if (
          enemyActivity[i] === "death" &&
          timeElapsed > enemyDeathTime[i] + timeForEnemyToDie
        ) {
          arraySetter(enemyActivity, setEnemyActivity, "disappear", i);
          arraySetter(
            enemyDisappearTime,
            setEnemyDisappearTime,
            timeElapsed,
            i
          );
          return;
        } else if (enemyActivity[i] === "death") {
          return;
        }

        if (
          enemyActivity[i] === "disappear" &&
          timeElapsed > enemyDisappearTime[i] + timeForEnemyToDisappear
        ) {
          arraySetter(enemyActivity, setEnemyActivity, "gone", i);
          return;
        } else if (enemyActivity[i] === "disappear") {
          return;
        } else if (enemyActivity[i] === "gone") {
          return;
        }

        let playerIsToRightAndEnemyIsFacingRight =
          playerCoordinate[0] > enemyCoordinate[0] &&
          enemyDirection[i] === "left";
        let playerIsToLeftAndEnemyIsFacingLeft =
          playerCoordinate[0] <= enemyCoordinate[0] &&
          enemyDirection[i] === "right";
        let enemyIsFacingCorrectDirection =
          playerIsToRightAndEnemyIsFacingRight ||
          playerIsToLeftAndEnemyIsFacingLeft;

        if (
          playerCoordinate[0] > enemyCoordinate[0] &&
          timeElapsed > mostRecentDirectionChange[i] + directionChangeCoolDown
        ) {
          arraySetter(enemyDirection, setEnemyDirection, "left", i);
          arraySetter(
            enemyDisappearTime,
            setEnemyDisappearTime,
            timeElapsed,
            i
          );
          enemyIsFacingCorrectDirection = true;
        } else if (
          timeElapsed >
          mostRecentDirectionChange[i] + directionChangeCoolDown
        ) {
          arraySetter(enemyDirection, setEnemyDirection, "right", i);
          arraySetter(
            enemyDisappearTime,
            setEnemyDisappearTime,
            timeElapsed,
            i
          );
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
          arraySetter(enemyActivity, setEnemyActivity, "walk", i);

          let modifier = playerCoordinate[0] > enemyCoordinate[0] ? 1 : -1;
          setEnemyX(enemyX + modifier * enemyTranslationAmount);
        } else if (
          Math.abs(playerCoordinate[0] - enemyCoordinate[0]) < attackRange &&
          enemyIsFacingCorrectDirection
        ) {
          arraySetter(enemyActivity, setEnemyActivity, "attack", i);
          if (enemyActivity !== "attack") {
            arraySetter(
              mostRecentEnemyAttack,
              setMostRecentEnemyAttack,
              timeElapsed,
              i
            );
          }
        } else {
          arraySetter(enemyActivity, setEnemyActivity, "idle", i);
        }

        if (
          playerCoordinate[1] > enemyCoordinate[1] + 4 &&
          playerToEnemyDistance < attackRange &&
          Math.abs(playerCoordinate[0] - enemyCoordinate[0]) < attackRange &&
          playerVY < 0 &&
          enemyActivity !== "death"
        ) {
          arraySetter(enemyActivity, setEnemyActivity, "death", i);
          arraySetter(enemyDeathTime, setEnemyDeathTime, timeElapsed, i);
          setPlayerVY(8);
          setEnvironmentVY(-8);
          setPlayerActivity("double_jump");
        }

        let injurePlayer =
          enemyActivity[i] === "attack" &&
          playerToEnemyDistance < attackRange &&
          timeElapsed > mostRecentEnemyAttack + timeToHurtPlayerFromAttackStart;

        // console.log("player Y: ", playerY, "enemy Y: ", enemyY);

        if (injurePlayer) {
          setPlayerDirection(enemyDirection);
          setPlayerActivity("hurt");
          setMostRecentEnemyAttack(timeElapsed + coolDownBetweenAttacks);
        }
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

  let rv = [];
  for (let i = 0; i < numEnemies; i++) {
    rv.push({
      x: enemyX[i],
      y: enemyY[i],
      startX: enemies[i].startX,
      startY: enemies[i].startY,
      activity: enemyActivity[i],
      direction: enemyDirection[i],
      type: "hyena",
    });
  }

  return [rv, setEnemyActivity];
};
