import "./Platform.css";
import platform_smallest from "../assets/tiles/Tile_47.png";

export const Platform = ({ platformX, platformY, width, height }) => {
  return (
    <div
      className="platform"
      style={{
        left: platformX,
        bottom: platformY,
        width: width * 125 + "px",
        height: height * 60 + "px",
        // [paddingDirection]: "10px",
      }}
    >
      <img
        src={platform_smallest}
        className="platform"
        style={{ height: "100%" }}
        alt="platform"
      />
    </div>
  );
};
