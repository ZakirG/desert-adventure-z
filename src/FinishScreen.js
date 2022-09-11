import "./FinishScreen.css";

export const FinishScreen = ({
  numCoinsCollected,
  levelNumber,
  timeElapsed,
  finishLineReached,
  playerHealth,
  backToMainMenu,
}) => {
  let overlayStyle;
  if (finishLineReached || playerHealth <= 0) {
    overlayStyle = {
      opacity: 1,
      transform: "scale(1)",
    };
  } else {
    overlayStyle = {
      opacity: 0,
      transform: "scale(10)",
    };
  }

  let showFinishScreen = finishLineReached || playerHealth <= 0;

  return (
    <div
      className="finish-screen"
      style={{ visibility: showFinishScreen ? "visible" : "hidden" }}
    >
      <div className="finish-screen-message" style={overlayStyle}>
        {finishLineReached && playerHealth > 0 && (
          <h1>LEVEL {levelNumber} COMPLETE</h1>
        )}
        {playerHealth <= 0 && <h1>GAME OVER</h1>}
      </div>
      <button
        className="menu-button"
        onClick={() => {
          backToMainMenu();
        }}
      >
        CONTINUE
      </button>
    </div>
  );
};
