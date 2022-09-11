import "./Coin.css";
import coin_gold from "../assets/items/Coin_gold.png";
import shine from "../assets/fx/Shine.png";
import { useSpriteAnimation } from "../hooks/useSpriteAnimation";

const frameCounts = {
  idle: 5,
  collecting: 5,
};

const spriteAnimationSpeeds = {
  idle: 12,
  collecting: 6,
};

const activitiesForSprite = {
  idle: coin_gold,
  collecting: shine,
};

export const Coin = ({
  coinType,
  coinActivity,
  coinStartX,
  coinStartY,
  timeElapsed,
}) => {
  let spriteImageWidth = 20;
  let extraPadding = 0;
  if (coinActivity === "collecting") {
    extraPadding = -15;
    spriteImageWidth = 100;
  }

  let [coinStyle, coinSpriteSheet] = useSpriteAnimation(
    frameCounts,
    spriteAnimationSpeeds,
    activitiesForSprite,
    coinActivity,
    "right",
    spriteImageWidth,
    false,
    extraPadding,
    timeElapsed
  );

  let scaleValue = "scale(1.2)";
  coinStyle.bottom = "4px";
  coinStyle.height = "20px";
  if (coinActivity === "collecting") {
    coinStyle.height = "50px";
    coinStyle.bottom = "12px";
    scaleValue = "scale(2)";
  }

  if (coinActivity === "collected") {
    return null;
  }

  return (
    <div
      id="coin-div"
      style={{
        left: coinStartX,
        bottom: coinStartY,
        transform: scaleValue,
      }}
    >
      <img
        src={coinSpriteSheet}
        alt="coin"
        className="coin-sprite-sheet"
        style={coinStyle}
      />
    </div>
  );
};
