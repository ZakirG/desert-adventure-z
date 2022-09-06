import "./Environment.css";

export const Environment = ({
  imageSource,
  environmentX,
  environmentY,
  children,
}) => {
  let envY = environmentY - 350;
  return (
    <div id="environment-div" style={{ top: envY + "px", left: environmentX }}>
      <img src={imageSource} id="environment-img" />
      {children}
    </div>
  );
};
