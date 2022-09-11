import { useState } from "react";
import "./MainMenu.css";
import pyramid from "./assets/environment-objects/pyramid.png";

export const MainMenu = ({ onStart }) => {
  let [showingInstructions, setShowingInstructions] = useState(false);
  let instructionsScale = showingInstructions ? "scale(1)" : "scale(0)";
  let versionNumber = "0.1";

  return (
    <div className="main-menu">
      <h1>DESERT ADVENTURE Z</h1>
      <img
        src={pyramid}
        className="pyramid"
        alt="pyramid"
        style={{ top: "190px", position: "relative" }}
      />
      <div className="instructions" style={{ transform: instructionsScale }}>
        <p>Instructions:</p>
        <p>Move the character with the arrow keys.</p>
        <p>Press the up arrow to jump.</p>
        <p>Defeat enemies by jumping on them.</p>
        <p>Collect coins.</p>
      </div>
      <div className="menu-buttons">
        <button
          className="menu-button"
          onClick={onStart}
          style={{ top: "80%", left: "50%" }}
        >
          START
        </button>

        <button
          className="menu-button"
          onClick={() => {
            setShowingInstructions((t) => !t);
          }}
          style={{ top: "90%", left: "50%" }}
        >
          INSTRUCTIONS
        </button>
      </div>
      <div className="version-number">V{versionNumber}</div>
    </div>
  );
};
