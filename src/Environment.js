import "./Environment.css";

export const Environment = ({ imageSource, environmentX, environmentY }) => {
  let envY = environmentY - 350;
  return (
    <div id="environment-div">
      <img
        src={imageSource}
        id="environment-img"
        style={{ top: envY + "px", left: environmentX }}
      />
    </div>
  );
};
