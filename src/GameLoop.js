import { useState, useEffect } from "react";
import { Player } from "./Player";
import * as d3 from "d3";

function useCurrentlyPressed() {
  const [currentlyPressed, setCurrentlyPressed] = useState([]);

  function downHandler({ repeat, key }) {
    if (repeat) return;
    console.log(key);
    let allowedKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
    setCurrentlyPressed((currentlyPressed) => {
      if (allowedKeys.includes(key) && !currentlyPressed.includes(key)) {
        return [...currentlyPressed, key];
      }
      return currentlyPressed;
    });
  }

  function upHandler({ repeat, key }) {
    if (repeat) return;
    setCurrentlyPressed((currentlyPressed) => {
      if (currentlyPressed.includes(key)) {
        let updatedCurrentlyPressed = currentlyPressed.slice();
        updatedCurrentlyPressed.splice(currentlyPressed.indexOf(key), 1);
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

export const GameLoop = () => {
  let gameHeight = 720;
  let gameWidth = 800;
  var currentlyPressed = useCurrentlyPressed();
  let [playerHeight, setPlayerHeight] = useState(100);
  let [playerWidth, setPlayerWidth] = useState(100);
  var [playerX, setPlayerX] = useState(0);
  var [playerY, setPlayerY] = useState(0);
  var [playerSpeed, setPlayerSpeed] = useState(2);
  console.log("currentlyPressed: ", currentlyPressed);

  function tickAnimation() {
    if (currentlyPressed.includes("ArrowLeft")) {
      setPlayerX((x) => x - playerSpeed);
    }
    // console.log("inside tick with ", currentlyPressed);
    if (currentlyPressed.includes("ArrowRight")) {
      console.log("incrementing...");
      setPlayerX((x) => x + playerSpeed);
    }
  }

  useEffect(() => {
    const t = d3.timer(tickAnimation);
    return () => t.stop();
  }, [currentlyPressed]);

  return (
    <>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <Player
          playerX={playerX}
          playerY={playerY}
          currentlyPressed={currentlyPressed}
        ></Player>
      </svg>
    </>
  );
};
