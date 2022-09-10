import "./FinishScreen.css";

export const FinishScreen = ({
  numCoinsCollected,
  levelNumber,
  timeElapsed,
  finishLineReached,
}) => {
  let overlayStyle;
  if (finishLineReached) {
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

  return (
    <>
      <div className="finish-screen" style={overlayStyle}>
        <h1>LEVEL {levelNumber} COMPLETE</h1>
      </div>
      {/* <button className="menu-button">CONTINUE</button> */}
    </>
  );
};
