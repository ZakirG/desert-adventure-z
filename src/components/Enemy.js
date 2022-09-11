import "./Enemy.css";
import hyena_idle from "../assets/enemies/Hyena/Hyena_idle.png";
import hyena_run from "../assets/enemies/Hyena/Hyena_walk.png";
import hyena_attack from "../assets/enemies/Hyena/Hyena_attack.png";
import hyena_hurt from "../assets/enemies/Hyena/Hyena_hurt.png";
import hyena_death from "../assets/enemies/Hyena/Hyena_death.png";

import dog_idle from "../assets/enemies/Dog/Idle.png";
import dog_run from "../assets/enemies/Dog/Walk.png";
import dog_attack from "../assets/enemies/Dog/Attack.png";
import dog_hurt from "../assets/enemies/Dog/Hurt.png";
import dog_death from "../assets/enemies/Dog/Death.png";

import gas_explosion from "../assets/fx/explosion_gas_circle_sheet.png";
import { useSpriteAnimation } from "../hooks/useSpriteAnimation";

const frameCountsHyena = {
  idle: 4,
  walk: 6,
  attack: 6,
  hurt: 2,
  death: 6,
  disappear: 10,
};

const frameCountsDog = {
  idle: 4,
  walk: 6,
  attack: 4,
  hurt: 2,
  death: 4,
  disappear: 10,
};

const spriteAnimationSpeeds = {
  idle: 8,
  walk: 15,
  jump: 8,
  attack: 12,
  hurt: 10,
  death: 10,
  disappear: 20,
};

const activitiesForSpriteHyena = {
  idle: hyena_idle,
  walk: hyena_run,
  attack: hyena_attack,
  hurt: hyena_hurt,
  death: hyena_death,
  disappear: gas_explosion,
};

const activitiesForSpriteDog = {
  idle: dog_idle,
  walk: dog_run,
  attack: dog_attack,
  hurt: dog_hurt,
  death: dog_death,
  disappear: gas_explosion,
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
  if (enemyActivity === "walk" && enemyType === "hyena") {
    extraPadding = -5;
  }
  let stopOnLastFrame = false;
  if (enemyActivity === "death") {
    stopOnLastFrame = true;
  }
  let enemyDirectionAdjusted = enemyDirection;
  let activitiesForSprite;
  let frameCounts;
  if (enemyType === "hyena") {
    activitiesForSprite = activitiesForSpriteHyena;
    frameCounts = frameCountsHyena;
  } else if (enemyType === "dog") {
    activitiesForSprite = activitiesForSpriteDog;
    frameCounts = frameCountsDog;
    enemyDirectionAdjusted = enemyDirection === "left" ? "right" : "left";
  } else {
    throw new Error("Enemy type not supported");
  }

  let [enemyStyle, enemySpriteSheet, paddingDirection] = useSpriteAnimation(
    frameCounts,
    spriteAnimationSpeeds,
    activitiesForSprite,
    enemyActivity,
    enemyDirectionAdjusted,
    spriteImageWidth,
    stopOnLastFrame,
    extraPadding,
    timeElapsed
  );

  let spriteShift = enemyDirectionAdjusted === "right" ? "0px" : "40px";
  enemyStyle.paddingRight = spriteShift;

  if (enemyActivity === "disappear") {
    enemyStyle.bottom = "-10px";
  }

  if (enemyActivity === "gone") {
    return;
  }

  let morePadding = enemyType === "hyena" ? "10px" : 0;

  return (
    <div
      id="enemy-div"
      style={{
        left: enemyStartX + enemyX,
        bottom: enemyStartY + enemyY,
        [paddingDirection]: morePadding,
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
