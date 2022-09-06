import { useState, useEffect } from "react";

// Custom hook that keeps track of currently pressed keys
export const useCurrentlyPressed = (controls) => {
  const [currentlyPressed, setCurrentlyPressed] = useState([]);

  function downHandler({ repeat, code }) {
    if (repeat) return;
    let allowedKeys = Object.values(controls);
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
};
