import { useState, useEffect } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { distanceFormula } from "../utils.js";

function arraySetter(stateArray, setFunction, newValue, index) {
  setFunction((t) => {
    let clone = [...t];
    clone[index] = newValue;
    return clone;
  });
}

export const useEnemyAI = (
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
) => {
  let numEnemies = enemies.length;

  let [mostRecentEnemyAttack, setMostRecentEnemyAttack] = useState(
    Array(numEnemies).fill(0)
  );
  let [mostRecentDirectionChange, setMostRecentDirectionChange] = useState(
    Array(numEnemies).fill(0)
  );
  let timeToHurtPlayerFromAttackStart = 0.3;
  let coolDownBetweenAttacks = 1.5;
  let directionChangeCoolDown = 1;

  let [enemyDirection, setEnemyDirection] = useState(
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
        -1 * environmentX + playerStartX + playerX + 20,
        playerY + environmentY + 55,
      ];

      let enemyActivityClone = enemyActivity.slice();
      let enemyDisappearTimeClone = enemyDisappearTime.slice();
      let enemyDeathTimeClone = enemyDeathTime.slice();
      let mostRecentDirectionChangeClone = mostRecentDirectionChange.slice();
      let mostRecentEnemyAttackClone = mostRecentEnemyAttack.slice();
      let enemyDirectionClone = enemyDirection.slice();

      for (let i = 0; i < numEnemies; i++) {
        let enemyCoordinate = [
          enemyX[i] + enemies[i].startX,
          enemyY[i] + enemies[i].startY,
        ];

        if (
          enemyActivityClone[i] === "death" &&
          timeElapsed > enemyDeathTimeClone[i] + timeForEnemyToDie
        ) {
          arraySetter(enemyActivity, setEnemyActivity, "disappear", i);
          arraySetter(
            enemyDisappearTime,
            setEnemyDisappearTime,
            timeElapsed,
            i
          );
          // enemyActivityClone[i] = "disappear";
          // enemyDisappearTimeClone[i] = timeElapsed;
          continue;
        } else if (enemyActivityClone[i] === "death") {
          continue;
        }

        if (
          enemyActivityClone[i] === "disappear" &&
          timeElapsed > enemyDisappearTimeClone[i] + timeForEnemyToDisappear
        ) {
          arraySetter(enemyActivity, setEnemyActivity, "gone", i);
          enemyActivityClone[i] = "gone";
          continue;
        } else if (enemyActivityClone[i] === "disappear") {
          continue;
        } else if (enemyActivityClone[i] === "gone") {
          continue;
        }

        let playerIsToRightAndEnemyIsFacingRight =
          playerCoordinate[0] > enemyCoordinate[0] &&
          enemyDirectionClone[i] === "left";
        let playerIsToLeftAndEnemyIsFacingLeft =
          playerCoordinate[0] <= enemyCoordinate[0] &&
          enemyDirectionClone[i] === "right";
        let enemyIsFacingCorrectDirection =
          playerIsToRightAndEnemyIsFacingRight ||
          playerIsToLeftAndEnemyIsFacingLeft;

        if (
          playerCoordinate[0] > enemyCoordinate[0] &&
          timeElapsed >
            mostRecentDirectionChangeClone[i] + directionChangeCoolDown
        ) {
          arraySetter(enemyDirection, setEnemyDirection, "left", i);
          mostRecentDirectionChangeClone[i] = timeElapsed;
          enemyIsFacingCorrectDirection = true;
        } else if (
          timeElapsed >
          mostRecentDirectionChangeClone[i] + directionChangeCoolDown
        ) {
          arraySetter(enemyDirection, setEnemyDirection, "right", i);
          mostRecentDirectionChangeClone[i] = timeElapsed;

          enemyIsFacingCorrectDirection = true;
        } else {
          enemyIsFacingCorrectDirection = false;
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
          enemyActivityClone[i] = "walk";

          let modifier = playerCoordinate[0] > enemyCoordinate[0] ? 1 : -1;
          arraySetter(
            enemyX,
            setEnemyX,
            enemyX[i] + modifier * enemyTranslationAmount,
            i
          );
        } else if (
          Math.abs(playerCoordinate[0] - enemyCoordinate[0]) < attackRange &&
          enemyIsFacingCorrectDirection
        ) {
          if (enemyActivityClone[i] !== "attack") {
            enemyActivityClone[i] = "attack";
            mostRecentEnemyAttackClone[i] = timeElapsed;

            arraySetter(enemyActivity, setEnemyActivity, "attack", i);

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
          enemyActivityClone[i] !== "death"
        ) {
          arraySetter(enemyActivity, setEnemyActivity, "death", i);
          enemyActivityClone[i] = "death";
          arraySetter(enemyDeathTime, setEnemyDeathTime, timeElapsed, i);
          enemyDeathTimeClone[i] = timeElapsed;
          setPlayerVY(8);
          setEnvironmentVY(-8);
          setPlayerActivity("double_jump");
        }

        let injurePlayer =
          enemyActivityClone[i] === "attack" &&
          playerToEnemyDistance < attackRange &&
          timeElapsed >
            mostRecentEnemyAttackClone[i] + timeToHurtPlayerFromAttackStart;

        if (injurePlayer || playerToEnemyDistance < 10) {
          setPlayerDirection(enemyDirection[i]);
          setPlayerActivity((t) => {
            return "hurt";
          });
          mostRecentEnemyAttackClone[i] = timeElapsed + coolDownBetweenAttacks;
          arraySetter(
            mostRecentEnemyAttack,
            setMostRecentEnemyAttack,
            timeElapsed + coolDownBetweenAttacks,
            i
          );
        }
      }
    },
    [
      enemyDirection,
      enemyActivity,
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
  for (let j = 0; j < numEnemies; j++) {
    rv.push({
      x: enemyX[j],
      y: enemyY[j],
      startX: enemies[j].startX,
      startY: enemies[j].startY,
      activity: enemyActivity[j],
      direction: enemyDirection[j],
      type: enemies[j].type,
    });
  }

  return rv;
};
