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

const spriteAnimationSpeeds = {
  idle: 8,
  walk: 10,
  jump: 8,
  double_jump: 8,
};

export const Player = ({
  playerX,
  playerY,
  playerStartX,
  playerStartY,
  playerDirection,
  playerActivity,
  timeElapsed,
}) => {
  let playerSpriteFrameNumber = Math.round(
    timeElapsed * spriteAnimationSpeeds[playerActivity]
  );
  let totalNumberOfFrames = frameCounts[playerActivity];
  let spriteSheetPosition =
    (playerSpriteFrameNumber % totalNumberOfFrames) * 90 - 15;
  if (playerDirection === "left") {
    // Reverse the animation order to preserve the illusion of moving left
    spriteSheetPosition =
      (playerSpriteFrameNumber % totalNumberOfFrames) * -90 +
      90 * (totalNumberOfFrames - 1) -
      15;
  }

  const playerStyle = { height: "90px", position: "relative", bottom: "15px" };
  if (playerDirection == "left") {
    playerStyle.transform = "scaleX(-1)";
    playerStyle["WebkitTransform"] = "scaleX(-1)";
    playerStyle.right = spriteSheetPosition + 40 + "px";
  } else if (playerDirection == "right") {
    playerStyle.transform = "";
    playerStyle["WebkitTransform"] = "";
    playerStyle.right = spriteSheetPosition + "px";
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
