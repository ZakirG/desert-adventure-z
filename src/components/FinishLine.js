import "./FinishLine.css";
import desert_flag from "../assets/environment-objects/Flag.png";
import { useSpriteAnimation } from "../hooks/useSpriteAnimation";

const frameCounts = {
  wave: 2,
};

const spriteAnimationSpeeds = {
  wave: 0.8,
};

const activitiesForSprite = {
  wave: desert_flag,
};

export const FinishLine = ({ finishLineX, finishLineY, timeElapsed }) => {
  let spriteImageWidth = 54;
  let extraPadding = 0;

  let [finishLineStyle, finishLineSpriteSheet] = useSpriteAnimation(
    frameCounts,
    spriteAnimationSpeeds,
    activitiesForSprite,
    "wave",
    "right",
    spriteImageWidth,
    false,
    extraPadding,
    timeElapsed
  );

  finishLineStyle.paddingRight = "0px";
  finishLineStyle.height = "81px";
  finishLineStyle.bottom = "5px";
  //   finishLineStyle.left = "5px";

  return (
    <div
      id="finish-line"
      style={{
        left: finishLineX,
        bottom: finishLineY,
      }}
    >
      <img
        src={finishLineSpriteSheet}
        className="finish-line-sprite-sheet"
        style={finishLineStyle}
        alt="finish line flag"
      />
    </div>
  );
};
