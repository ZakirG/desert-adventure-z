import { useState, useEffect } from "react";
import { useAnimationFrame } from "./useAnimationFrame";
import { distanceFormula } from "../utils.js";

export const usePlatformPhysics = (
  platform,
  playerStartX,
  playerX,
  playerY,
  setPlayerY,
  environmentX,
  environmentY,
  setEnvironmentY,
  setPlayerActivity,
  playerVY,
  setPlayerVY,
  setEnvironmentVY,
  playerOnPlatform,
  setPlayerOnPlatform,
  timeElapsed
) => {
  let catchRange = 25;
  let pxPerWidth = 60;
  let { width, height, platformX, platformY } = platform;

  useAnimationFrame(
    (deltaTime) => {
      let playerCoordinate = [
        -1 * environmentX + playerStartX + playerX - 47,
        playerY + environmentY + 47,
      ];
      // console.log("environment Y: ", environmentY);
      let platformCoordinate = [platformX, platformY];

      let playerToPlatformDistance = distanceFormula(
        playerCoordinate,
        platformCoordinate
      );

      // console.log(playerToPlatformDistance);

      if (
        playerCoordinate[1] > platformCoordinate[1] &&
        playerToPlatformDistance <= catchRange &&
        playerVY <= 0
      ) {
        // Catch the player from falling <3 support them!!
        // console.log(
        //   "catching player at playercoord: ",
        //   playerCoordinate,
        //   "platform coord:",
        //   platformCoordinate
        // );
        // console.log("catching player");
        setPlayerVY(0);
        setPlayerY(platformCoordinate[1]);
        setEnvironmentVY(0);
        setEnvironmentY(platformCoordinate[1]);
        setPlayerActivity("idle");
        setPlayerOnPlatform(true);
      }

      // Player can walk off the platform
      // console.log("on platform? ", playerOnPlatform);
      if (
        playerOnPlatform &&
        Math.abs(platformCoordinate[0] - playerCoordinate[0]) >
          width * pxPerWidth
      ) {
        // console.log(
        //   "player walked off the platform at playerY: ",
        //   playerY,
        //   "environmentY: ",
        //   environmentY
        // );
        setPlayerOnPlatform(false);
        setPlayerActivity("fall");
      }
    },
    [playerX, playerY, playerVY, environmentX, environmentY, timeElapsed]
  );
};
