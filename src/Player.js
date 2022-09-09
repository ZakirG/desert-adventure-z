import "./Player.css";
import punk_idle from "./assets/main-characters/punk/Punk_idle.png";
import punk_run from "./assets/main-characters/punk/Punk_run.png";
import punk_hurt from "./assets/main-characters/punk/Punk_hurt.png";
import punk_jump from "./assets/main-characters/punk/Punk_jump.png";
import punk_fall from "./assets/main-characters/punk/Fall.png";
import punk_double_jump from "./assets/main-characters/punk/Punk_double_jump.png";
import punk_clap_attack from "./assets/main-characters/punk/Punk_attack3.png";
import punk_punch from "./assets/main-characters/punk/Punk_run_attack.png";
import { useSpriteAnimation } from "./hooks/useSpriteAnimation";

const frameCounts = {
  idle: 4,
  walk: 6,
  jump: 4,
  hurt: 2,
  double_jump: 6,
  clap_attack: 8,
  punch: 6,
  fall: 2,
};

const spriteAnimationSpeeds = {
  idle: 8,
  walk: 14,
  hurt: 6,
  jump: 8,
  double_jump: 8,
  clap_attack: 12,
  punch: 12,
  fall: 8,
};

const activitiesForSprite = {
  idle: punk_idle,
  walk: punk_run,
  jump: punk_jump,
  hurt: punk_hurt,
  double_jump: punk_double_jump,
  clap_attack: punk_clap_attack,
  punch: punk_punch,
  fall: punk_fall,
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
  let spriteImageWidth = 90;
  let extraPadding = 15;

  let [playerStyle, playerSpriteSheet, paddingDirection] = useSpriteAnimation(
    frameCounts,
    spriteAnimationSpeeds,
    activitiesForSprite,
    playerActivity,
    playerDirection,
    spriteImageWidth,
    false,
    extraPadding,
    timeElapsed
  );

  return (
    <div
      id="player-div"
      style={{
        left: playerStartX + playerX,
        bottom: playerStartY + playerY,
        [paddingDirection]: "10px",
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
