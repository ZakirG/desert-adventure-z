import "./Environment.css";

export const Environment = ({ imageSource }) => {
  return (
    <div id="environment-div">
      <img src={imageSource} id="environment-img" />
    </div>
  );
};
