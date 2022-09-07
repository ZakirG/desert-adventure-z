import "./Enemy.css";
import hyena_idle from "./assets/enemies/Hyena/Hyena_idle.png";
import hyena_run from "./assets/enemies/Hyena/Hyena_walk.png";
import hyena_attack from "./assets/enemies/Hyena/Hyena_attack.png";
import { useSpriteAnimation } from "./hooks/useSpriteAnimation";

const frameCounts = {
  idle: 4,
  walk: 6,
  attack: 6,
};

const spriteAnimationSpeeds = {
  idle: 8,
  walk: 14,
  jump: 8,
  attack: 12,
};

const activitiesForSprite = {
  idle: hyena_idle,
  walk: hyena_run,
  attack: hyena_attack,
};

export const Enemy = ({
  enemyType,
  enemyX,
  enemyY,
  enemyStartX,
  enemyStartY,
  enemyDirection,
  enemyActivity,
  timeElapsed,
}) => {
  let spriteImageWidth = 90;
  let extraPadding = -10;
  if (enemyActivity === "walk") {
    extraPadding = -5;
  }

  let [enemyStyle, enemySpriteSheet, paddingDirection] = useSpriteAnimation(
    frameCounts,
    spriteAnimationSpeeds,
    activitiesForSprite,
    enemyActivity,
    enemyDirection,
    spriteImageWidth,
    extraPadding,
    timeElapsed
  );

  let spriteShift = enemyDirection === "right" ? "0px" : "40px";
  enemyStyle.paddingRight = spriteShift;

  return (
    <div
      id="enemy-div"
      style={{
        left: enemyStartX + enemyX,
        bottom: enemyStartY + enemyY,
        [paddingDirection]: "10px",
      }}
    >
      <img
        src={enemySpriteSheet}
        alt="enemy"
        className="enemy-sprite-sheet"
        style={enemyStyle}
      />
    </div>
  );
};
