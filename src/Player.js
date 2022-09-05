import "./Player.css";
import punk_idle from "./assets/main-characters/punk/Punk_idle.png";
import punk_run from "./assets/main-characters/punk/Punk_run.png";

const frameCounts = {
  idle: 4,
  walk: 6,
};

export const Player = ({
  playerX,
  playerY,
  playerStartX,
  playerStartY,
  playerDirection,
  playerActivity,
  playerSpriteFrameNumber,
}) => {
  console.log(playerSpriteFrameNumber);
  let totalNumberOfFrames = frameCounts[playerActivity];
  let spriteSheetPosition =
    (playerSpriteFrameNumber % totalNumberOfFrames) * 90 - 10;

  const playerStyle = { height: "90px", position: "relative", bottom: "15px" };
  if (playerDirection == "left") {
    playerStyle.transform = "scaleX(-1)";
    playerStyle["WebkitTransform"] = "scaleX(-1)";
    playerStyle.right = spriteSheetPosition + 45 + "px";
  } else if (playerDirection == "right") {
    playerStyle.transform = "";
    playerStyle["WebkitTransform"] = "";
    playerStyle.right = spriteSheetPosition + "px";
  }

  let playerSpriteSheet = punk_idle;
  if (playerActivity === "walk") {
    playerSpriteSheet = punk_run;
  }

  return (
    <div
      id="player-div"
      style={{
        left: playerStartX + playerX,
        bottom: playerStartY + playerY,
      }}
    >
      <img
        src={playerSpriteSheet}
        alt="player"
        className="player-sprite-sheet"
        style={playerStyle}
      />
    </div>
  );
};
