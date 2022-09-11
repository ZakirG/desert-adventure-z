import { useState } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { distanceFormula } from "../utils.js";

export const useCoinBehavior = (
  coins,
  coinGroundY,
  playerX,
  playerY,
  playerStartX,
  playerStartY,
  environmentX,
  environmentY,
  timeElapsed
) => {
  let numCoins = coins.length;
  let [coinActivity, setCoinActivity] = useState(Array(numCoins).fill("idle"));
  let [coinActive, setCoinActive] = useState(Array(numCoins).fill(true));
  let [mostRecentCollectionTime, setMostRecentCollectionTime] = useState(
    Array(numCoins).fill(0)
  );
  let timeToCollect = 0.5;
  let pickupRange = 50;

  useAnimationFrame(
    (deltaTime) => {
      for (let i = 0; i < numCoins; i++) {
        if (!coinActive[i] && coinActivity[i] === "collecting") {
          // Clean up any left over coins
          let coinActivityClone = [...coinActivity];
          coinActivityClone[i] = "collected";
          setCoinActivity(coinActivityClone);

          let coinActiveClone = [...coinActive];
          coinActiveClone[i] = false;
          setCoinActive(coinActiveClone);
        }

        if (!coinActive[i]) {
          continue;
        }
        let playerCoordinate = [
          -1 * environmentX + playerStartX + playerX,
          playerY + coinGroundY + environmentY, // TODO: figure out why this hacky math is necessary
        ];
        let coinCoordinate = [coins[i].x, coins[i].y];

        let playerToCoinDistance = distanceFormula(
          playerCoordinate,
          coinCoordinate
        );

        if (
          playerToCoinDistance < pickupRange &&
          coinActive[i] &&
          coinActivity[i] !== "collecting"
        ) {
          let coinActivityClone = [...coinActivity];
          coinActivityClone[i] = "collecting";
          setCoinActivity(coinActivityClone);

          let mostRecentCollectionTimeClone = [...mostRecentCollectionTime];
          mostRecentCollectionTimeClone[i] = timeElapsed;
          setMostRecentCollectionTime(mostRecentCollectionTimeClone);
        }

        if (
          coinActivity[i] === "collecting" &&
          timeElapsed > mostRecentCollectionTime[i] + timeToCollect
        ) {
          let coinActivityClone = [...coinActivity];
          coinActivityClone[i] = "collected";
          setCoinActivity(coinActivityClone);

          let coinActiveClone = [...coinActive];
          coinActiveClone[i] = false;
          setCoinActive(coinActiveClone);
        }
      }
    },
    [timeElapsed, playerX, playerY, environmentX, environmentY]
  );

  let rv = [];
  for (let i = 0; i < numCoins; i++) {
    rv.push({
      x: coins[i].x,
      y: coins[i].y,
      activity: coinActivity[i],
    });
  }

  return rv;
};
