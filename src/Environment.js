import "./Environment.css";
import rock from "./assets/tiles/Tile_24.png";

export const Environment = ({
  imageSource,
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
        style={{ top: envY + "px", left: environmentX }}
      >
        <img src={imageSource} id="environment-img" />
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
      >
        {/* <img src={rock} id="environment-img" /> */}
      </div>
    </>
  );
};
