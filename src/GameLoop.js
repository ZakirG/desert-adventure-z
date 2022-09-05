import { useState, useEffect, useRef } from "react";
import { Player } from "./Player";
import { Environment } from "./Environment";
import background_1 from "./assets/backgrounds/1/background.png";
import punk_idle from "./assets/main-characters/punk/Punk_run.png";
import hyena_idle from "./assets/enemies/Hyena/Hyena_idle.png";
import * as d3 from "d3";

// Custom hook that keeps track of currently pressed keys
function useCurrentlyPressed() {
  const [currentlyPressed, setCurrentlyPressed] = useState([]);

  function downHandler({ repeat, code }) {
    if (repeat) return;
    let allowedKeys = [
      "ArrowDown",
      "ArrowUp",
      "ArrowLeft",
      "ArrowRight",
      "Space",
    ];
    setCurrentlyPressed((currentlyPressed) => {
      if (allowedKeys.includes(code) && !currentlyPressed.includes(code)) {
        return [...currentlyPressed, code];
      }
      return currentlyPressed;
    });
  }

  function upHandler({ repeat, code }) {
    if (repeat) return;
    setCurrentlyPressed((currentlyPressed) => {
      if (currentlyPressed.includes(code)) {
        let updatedCurrentlyPressed = currentlyPressed.slice();
        updatedCurrentlyPressed.splice(currentlyPressed.indexOf(code), 1);
        return updatedCurrentlyPressed;
      }
      return currentlyPressed;
    });
  }

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);
  return currentlyPressed;
}

// Custom hook that enables animation via a callback function
const useAnimationFrame = (callback, dependencies) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = (time) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, dependencies);
};

export const GameLoop = () => {
  let gameHeight = 720;
  let gameWidth = 800;
  const currentlyPressed = useCurrentlyPressed();
  let [environmentX, setEnvironmentX] = useState(-3);
  let [environmentY, setEnvironmentY] = useState(0);

  let [playerX, setPlayerX] = useState(0);
  let [playerY, setPlayerY] = useState(0);
  let [playerVY, setPlayerVY] = useState(0);

  const [playerDirection, setPlayerDirection] = useState("right");
  const [playerActivity, setPlayerActivity] = useState("idle");

  let [playerStartX, playerStartY] = [350, -600];

  let [playerSpriteFrameNumber, setPlayerSpriteFrameNumber] = useState(0);

  let [timeElapsed, setTimeElapsed] = useState(0);

  let playerWeight = 0.5;

  let [mostRecentJump, setMostRecentJump] = useState(0);

  useAnimationFrame(
    (deltaTime) => {
      setTimeElapsed((timeElapsed) => timeElapsed + deltaTime / 1000);

      let playerTranslationAmount = 2.7 * deltaTime * 0.1;

      let playerIsAtLeftBound = playerX <= -355;
      let playerIsNearTheCenter = playerX < 4 && playerX > -4;
      let environmentIsAtLeftBound = environmentX >= -3;

      if (environmentX >= -3) {
        setEnvironmentX(-3);
      }

      let playerIsJumping =
        playerActivity === "jump" || playerActivity === "double_jump";

      if (currentlyPressed.includes("ArrowLeft")) {
        if (environmentIsAtLeftBound && !playerIsAtLeftBound) {
          setPlayerX((x) => x - playerTranslationAmount);
        } else if (!environmentIsAtLeftBound && !playerIsAtLeftBound) {
          setEnvironmentX((x) => x + playerTranslationAmount);
        }

        setPlayerDirection("left");
        if (!playerIsJumping) {
          setPlayerActivity("walk");
        }
      } else if (currentlyPressed.includes("ArrowRight")) {
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

      if (
        currentlyPressed.includes("Space") &&
        playerActivity === "jump" &&
        mostRecentJump + 0.2 < timeElapsed
      ) {
        setPlayerActivity("double_jump");
        setPlayerVY(14);
        setPlayerY((y) => y + 8);
      }

      if (
        currentlyPressed.includes("Space") &&
        playerActivity !== "jump" &&
        playerActivity !== "double_jump"
      ) {
        setPlayerActivity("jump");
        setPlayerVY(8);
        setPlayerY((y) => y + 6);
        setMostRecentJump(timeElapsed);
      } else if (
        playerActivity === "jump" ||
        playerActivity === "double_jump"
      ) {
        if (playerY > 5.8) {
          setPlayerVY((vy) => vy - playerWeight);
          setPlayerY((y) => y + playerVY);
        } else {
          setPlayerVY(0);
          setPlayerY(0);
          setPlayerActivity("idle");
        }
      }
    },
    [currentlyPressed, environmentX, playerX, playerY, playerVY, timeElapsed]
  );

  return (
    <>
      <Environment
        environmentX={environmentX}
        environmentY={environmentY}
        currentlyPressed={currentlyPressed}
        gameHeight={gameHeight}
        gameWidth={gameWidth}
        imageSource={background_1}
      ></Environment>
      <Player
        playerDirection={playerDirection}
        playerActivity={playerActivity}
        playerX={playerX}
        playerY={playerY}
        playerStartX={playerStartX}
        playerStartY={playerStartY}
        timeElapsed={timeElapsed}
      ></Player>
    </>
  );
};
