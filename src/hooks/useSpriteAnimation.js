import { useRef } from "react";

export const useSpriteAnimation = (
  frameCounts,
  spriteAnimationSpeeds,
  activitiesForSprite,
  creatureActivity,
  creatureDirection,
  spriteImageWidth,
  stopOnLastFrame,
  extraPadding,
  timeElapsed
) => {
  let previousFrameRef = useRef(0);
  let previousActivityRef = useRef(creatureActivity);
  let lastFrameChange = useRef(timeElapsed);

  if (previousActivityRef.current !== creatureActivity) {
    previousActivityRef.current = creatureActivity;
    previousFrameRef.current = 0;
    lastFrameChange.current = timeElapsed;
  }

  let totalNumberOfFrames = frameCounts[creatureActivity];
  let timeSinceLastFrame = timeElapsed - lastFrameChange.current;
  let incrementor = 0;
  if (timeSinceLastFrame > 1 / spriteAnimationSpeeds[creatureActivity]) {
    lastFrameChange.current = timeElapsed;
    incrementor = 1;
  }

  let creatureSpriteFrameNumber = previousFrameRef.current + incrementor;
  if (stopOnLastFrame) {
    console.log(creatureSpriteFrameNumber);
  }

  if (stopOnLastFrame && creatureSpriteFrameNumber >= totalNumberOfFrames - 1) {
    creatureSpriteFrameNumber = totalNumberOfFrames - 1;
  }
  creatureSpriteFrameNumber = creatureSpriteFrameNumber % totalNumberOfFrames;

  previousFrameRef.current = creatureSpriteFrameNumber;

  let spriteSheetPosition =
    creatureSpriteFrameNumber * spriteImageWidth - extraPadding;
  if (creatureDirection === "left") {
    // Reverse the animation order to preserve the illusion of moving left
    spriteSheetPosition =
      creatureSpriteFrameNumber * (-1 * spriteImageWidth) +
      spriteImageWidth * (totalNumberOfFrames - 1) -
      extraPadding;
  }

  const creatureStyle = {
    height: "90px",
    position: "relative",
    bottom: "15px",
  };
  if (creatureDirection == "left") {
    creatureStyle.transform = "scaleX(-1)";
    creatureStyle["WebkitTransform"] = "scaleX(-1)";
    creatureStyle.right = spriteSheetPosition + 40 + "px";
  } else if (creatureDirection == "right") {
    creatureStyle.transform = "";
    creatureStyle["WebkitTransform"] = "";
    creatureStyle.right = spriteSheetPosition + "px";
  }

  let creatureSpriteSheet = activitiesForSprite[creatureActivity];

  let paddingDirection = "paddingRight";
  if (creatureDirection == "left") {
    paddingDirection = "paddingLeft";
  }

  return [creatureStyle, creatureSpriteSheet, paddingDirection];
};
