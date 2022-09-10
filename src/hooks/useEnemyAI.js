import { useState, useRef } from "react";
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
) => {
  let numEnemies = enemies.length;

  let [mostRecentEnemyAttack, setMostRecentEnemyAttack] = useState(
    Array(numEnemies).fill(0)
  );
  let mostRecentDirectionChange = useRef(Array(numEnemies).fill(0));
  let timeToHurtPlayerFromAttackStart = 0.3;
  let coolDownBetweenAttacks = 1.5;
  let directionChangeCoolDown = 0.5;

  let enemyDirection = useRef(Array(numEnemies).fill("right"));

  const enemyActivity = useRef(Array(numEnemies).fill("idle"));

  let enemyX = useRef(Array(numEnemies).fill(0));
  let enemyY = useRef(Array(numEnemies).fill(0));
  let [enemyVY, setEnemyVY] = useState(Array(numEnemies).fill(0));

  let [enemyDeathTime, setEnemyDeathTime] = useState(Array(numEnemies).fill(0));
  let timeForEnemyToDie = 1;

  let enemyDisappearTime = useRef(Array(numEnemies).fill(0));
  let timeForEnemyToDisappear = 0.6;

  useAnimationFrame(
    (deltaTime) => {
      let playerCoordinate = [
        -1 * environmentX + playerStartX + playerX + 20,
        playerY + environmentY + 55,
      ];

      for (let i = 0; i < numEnemies; i++) {
        let smallRandomNumber = Math.random() * 0.2;
        let enemyTranslationAmount =
          smallRandomNumber * 15 +
          enemySpeeds[enemies[i].type] * deltaTime * 0.1;

        let enemyCoordinate = [
          enemyX.current[i] + enemies[i].startX,
          enemyY.current[i] + enemies[i].startY,
        ];

        if (
          enemyActivity.current[i] === "death" &&
          timeElapsed > enemyDeathTime[i] + timeForEnemyToDie
        ) {
          enemyDisappearTime.current[i] = timeElapsed;
          enemyActivity.current[i] = "disappear";
          continue;
        } else if (enemyActivity.current[i] === "death") {
          continue;
        }

        if (
          enemyActivity.current[i] === "disappear" &&
          timeElapsed > enemyDisappearTime.current[i] + timeForEnemyToDisappear
        ) {
          enemyActivity.current[i] = "gone";
          continue;
        } else if (enemyActivity.current[i] === "disappear") {
          continue;
        } else if (enemyActivity.current[i] === "gone") {
          continue;
        }

        let playerIsToRightAndEnemyIsFacingRight =
          playerCoordinate[0] > enemyCoordinate[0] &&
          enemyDirection.current[i] === "left";
        let playerIsToLeftAndEnemyIsFacingLeft =
          playerCoordinate[0] <= enemyCoordinate[0] &&
          enemyDirection.current[i] === "right";
        let enemyIsFacingCorrectDirection =
          playerIsToRightAndEnemyIsFacingRight ||
          playerIsToLeftAndEnemyIsFacingLeft;

        if (
          playerCoordinate[0] > enemyCoordinate[0] &&
          timeElapsed >
            mostRecentDirectionChange.current[i] +
              directionChangeCoolDown +
              smallRandomNumber
        ) {
          enemyDirection.current[i] = "left";
          mostRecentDirectionChange.current[i] = timeElapsed;
          enemyIsFacingCorrectDirection = true;
        } else if (
          timeElapsed >
          mostRecentDirectionChange.current[i] +
            directionChangeCoolDown +
            smallRandomNumber
        ) {
          enemyDirection.current[i] = "right";
          mostRecentDirectionChange.current[i] = timeElapsed;
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
          enemyActivity.current[i] = "walk";

          let modifier = playerCoordinate[0] > enemyCoordinate[0] ? 1 : -1;
          enemyX.current[i] =
            enemyX.current[i] + modifier * enemyTranslationAmount;
        } else if (
          Math.abs(playerCoordinate[0] - enemyCoordinate[0]) < attackRange &&
          enemyIsFacingCorrectDirection
        ) {
          if (enemyActivity.current[i] !== "attack") {
            enemyActivity.current[i] = "attack";
            arraySetter(
              mostRecentEnemyAttack,
              setMostRecentEnemyAttack,
              timeElapsed,
              i
            );
          }
        } else {
          enemyActivity.current[i] = "idle";
        }

        if (
          playerCoordinate[1] > enemyCoordinate[1] + 4 &&
          playerToEnemyDistance < attackRange &&
          Math.abs(playerCoordinate[0] - enemyCoordinate[0]) < attackRange &&
          playerVY < 0 &&
          enemyActivity.current[i] !== "death"
        ) {
          enemyActivity.current[i] = "death";
          arraySetter(enemyDeathTime, setEnemyDeathTime, timeElapsed, i);
          setPlayerVY(8);
          setEnvironmentVY(-8);
          setPlayerActivity("double_jump");
        }

        let injurePlayer =
          enemyActivity.current[i] === "attack" &&
          playerToEnemyDistance < attackRange &&
          timeElapsed >
            mostRecentEnemyAttack[i] + timeToHurtPlayerFromAttackStart;

        if (injurePlayer || playerToEnemyDistance < 10) {
          setPlayerDirection(enemyDirection.current[i]);
          setPlayerActivity((t) => {
            return "hurt";
          });
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
      x: enemyX.current[j],
      y: enemyY.current[j],
      startX: enemies[j].startX,
      startY: enemies[j].startY,
      activity: enemyActivity.current[j],
      direction: enemyDirection.current[j],
      type: enemies[j].type,
    });
  }

  return rv;
};
