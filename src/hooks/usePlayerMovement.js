import { useState, useEffect } from "react";
import { useAnimationFrame } from "./useAnimationFrame";

export const usePlayerMovement = (
  playerWeight,
  playerSpeed,
  currentlyPressed,
  { downKey, upKey, leftKey, rightKey, jumpKey, attackKey1, attackKey2 }
) => {
  let [timeElapsed, setTimeElapsed] = useState(0);
  let [environmentX, setEnvironmentX] = useState(-3);
  let [environmentY, setEnvironmentY] = useState(0);
  let [environmentVY, setEnvironmentVY] = useState(0);

  let [playerX, setPlayerX] = useState(0);
  let [playerY, setPlayerY] = useState(0);
  let [playerVY, setPlayerVY] = useState(0);
  let [mostRecentJump, setMostRecentJump] = useState(0);

  let [playerIsUsingAttack1, setPlayerIsUsingAttack1] = useState(false);
  let [mostRecentAttack1, setMostRecentAttack1] = useState(false);
  let attack1Duration = 0.7;

  const [playerDirection, setPlayerDirection] = useState("right");
  const [playerActivity, setPlayerActivity] = useState("idle");

  useAnimationFrame(
    (deltaTime) => {
      setTimeElapsed((timeElapsed) => timeElapsed + deltaTime / 1000);

      let playerTranslationAmount = playerSpeed * deltaTime * 0.1;

      let playerIsAtLeftBound = playerX <= -355;
      let playerIsNearTheCenter = playerX < 4 && playerX > -4;
      let environmentIsAtLeftBound = environmentX >= -3;

      if (environmentX >= -3) {
        setEnvironmentX(-3);
      }
      if (playerY < 0 || environmentY < 0) {
        setPlayerY(0);
        setEnvironmentY(0);
      }

      if (
        playerIsUsingAttack1 &&
        timeElapsed > mostRecentAttack1 + attack1Duration
      ) {
        setPlayerIsUsingAttack1(false);
        setPlayerActivity("idle");
      } else if (playerIsUsingAttack1) {
        // no other actions allowed while attacking
        return;
      }

      let playerIsJumping =
        playerActivity === "jump" || playerActivity === "double_jump";

      if (!playerIsJumping && currentlyPressed.includes(attackKey1)) {
        setPlayerActivity("clap_attack");
        setPlayerIsUsingAttack1(true);
        setMostRecentAttack1(timeElapsed);
        return;
      }

      if (currentlyPressed.includes(leftKey)) {
        if (environmentIsAtLeftBound && !playerIsAtLeftBound) {
          setPlayerX((x) => x - playerTranslationAmount);
        } else if (!environmentIsAtLeftBound && !playerIsAtLeftBound) {
          setEnvironmentX((x) => x + playerTranslationAmount);
        }

        setPlayerDirection("left");
        if (!playerIsJumping) {
          setPlayerActivity("walk");
        }
      } else if (currentlyPressed.includes(rightKey)) {
        if (environmentIsAtLeftBound && !playerIsNearTheCenter) {
          setPlayerX((x) => x + playerTranslationAmount);
        } else {
          setEnvironmentX((x) => x - playerTranslationAmount);
        }
        setPlayerDirection("right");
        if (!playerIsJumping) {
          setPlayerActivity("walk");
        }
      }

      if (!playerIsJumping && currentlyPressed.length === 0) {
        setPlayerActivity("idle");
      }

      let jumpKeyPressed =
        currentlyPressed.includes(jumpKey) || currentlyPressed.includes(upKey);

      if (
        jumpKeyPressed &&
        playerActivity === "jump" &&
        mostRecentJump + 0.2 < timeElapsed
      ) {
        setPlayerActivity("double_jump");
        setPlayerVY(14);
        // setPlayerY((y) => y + 8);
        // setEnvironmentY((y) => y - 8);
        setEnvironmentVY(-14);
      }

      if (
        jumpKeyPressed &&
        playerActivity !== "jump" &&
        playerActivity !== "double_jump"
      ) {
        setPlayerActivity("jump");
        setPlayerVY(8);
        setEnvironmentVY(-8);
        setPlayerY((y) => y + 6);
        setEnvironmentY((y) => y - 6);
        setMostRecentJump(timeElapsed);
      } else if (
        playerActivity === "jump" ||
        playerActivity === "double_jump"
      ) {
        if (playerY > 5.8) {
          setPlayerVY((vy) => vy - playerWeight);
          setPlayerY((y) => y + playerVY);
          setEnvironmentVY((vy) => vy + playerWeight);
          setEnvironmentY((y) => y - environmentVY);
        } else {
          setPlayerVY(0);
          setEnvironmentVY(0);
          setPlayerActivity("idle");
        }
      }
    },
    [currentlyPressed, environmentX, playerX, playerY, playerVY, timeElapsed]
  );

  return [
    playerX,
    playerY,
    playerDirection,
    playerActivity,
    setPlayerActivity,
    environmentX,
    environmentY,
    timeElapsed,
  ];
};
