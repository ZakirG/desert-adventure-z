import "./Player.css";
import punk_idle from "./assets/main-characters/punk/Punk_idle.png";
import punk_run from "./assets/main-characters/punk/Punk_run.png";
import punk_jump from "./assets/main-characters/punk/Punk_jump.png";
import punk_double_jump from "./assets/main-characters/punk/Punk_double_jump.png";

const frameCounts = {
  idle: 4,
  walk: 6,
  jump: 4,
  double_jump: 6,
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
  let totalNumberOfFrames = frameCounts[playerActivity];
  let spriteSheetPosition =
    (playerSpriteFrameNumber % totalNumberOfFrames) * 90 - 10;

  const playerStyle = { height: "90px", position: "relative", bottom: "15px" };
  if (playerDirection == "left") {
    playerStyle.transform = "scaleX(-1)";
    playerStyle["WebkitTransform"] = "scaleX(-1)";
    playerStyle.right = spriteSheetPosition + 45 - 10 + "px";
  } else if (playerDirection == "right") {
    playerStyle.transform = "";
    playerStyle["WebkitTransform"] = "";
    playerStyle.right = spriteSheetPosition - 5 + "px";
  }

  // console.log("playerActivity", playerActivity);
  let playerSpriteSheet = punk_idle;
  if (playerActivity === "walk") {
    playerSpriteSheet = punk_run;
  }
  if (playerActivity === "jump") {
    playerSpriteSheet = punk_jump;
  }
  if (playerActivity === "double_jump") {
    playerSpriteSheet = punk_double_jump;
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
