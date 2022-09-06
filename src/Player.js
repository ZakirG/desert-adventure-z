import "./Player.css";
import punk_idle from "./assets/main-characters/punk/Punk_idle.png";
import punk_run from "./assets/main-characters/punk/Punk_run.png";
import punk_jump from "./assets/main-characters/punk/Punk_jump.png";
import punk_double_jump from "./assets/main-characters/punk/Punk_double_jump.png";
import punk_clap_attack from "./assets/main-characters/punk/Punk_attack3.png";

const frameCounts = {
  idle: 4,
  walk: 6,
  jump: 4,
  double_jump: 6,
  clap_attack: 8,
};

const spriteAnimationSpeeds = {
  idle: 8,
  walk: 14,
  jump: 8,
  double_jump: 8,
  clap_attack: 12,
};

const activitiesForSprite = {
  idle: punk_idle,
  walk: punk_run,
  jump: punk_jump,
  double_jump: punk_double_jump,
  clap_attack: punk_clap_attack,
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

  let playerSpriteSheet = activitiesForSprite[playerActivity];

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
