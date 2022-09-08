import "./Environment.css";
import rock from "./assets/tiles/Tile_24.png";

export const Environment = ({
  imageSource,
  imageSource2,
  environmentX,
  environmentY,
  children,
  undergroundHeight,
}) => {
  let envY = environmentY - 350 - undergroundHeight;
  return (
    <>
      <div
        id="environment-div"
        style={{
          top: envY + "px",
          left: environmentX,
          backgroundImage: imageSource,
          backgroundRepeat: "repeat",
        }}
      >
        <div className="environment-background">
          <img src={imageSource} />
          <img src={imageSource2} />
        </div>
        {children}
      </div>
      <div
        id="underground"
        style={{
          backgroundImage: rock,
          top: 1080 + envY + "px",
          left: environmentX,
          height: undergroundHeight + "px",
        }}
      ></div>
    </>
  );
};
