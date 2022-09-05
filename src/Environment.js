import "./Environment.css";

export const Environment = ({ imageSource, environmentX, environmentY }) => {
  return (
    <div id="environment-div">
      <img
        src={imageSource}
        id="environment-img"
        style={{ top: "-350px", left: environmentX }}
      />
    </div>
  );
};
