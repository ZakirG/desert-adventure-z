import { useState, useEffect } from "react";

export const useEnemy = (
  enemyType,
  enemyStartX,
  enemyStartY,
  enemySpeed,
  playerActivity,
  setPlayerActivity,
  timeElapsed
) => {
  let [enemyX, setEnemyX] = useState(0);
  let [enemyY, setEnemyY] = useState(0);
  let [enemyDirection, setEnemyDirection] = useState("right");
  let [enemyActivity, setEnemyActivity] = useState("idle");

  return [enemyX, enemyY, enemyDirection, enemyActivity];
};
