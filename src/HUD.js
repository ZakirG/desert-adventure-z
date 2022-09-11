import coin_gold from "./assets/items/Coin_gold.png";
import health_bar from "./assets/health-bar/health-bar.png";
import "./HUD.css";

export const HUD = ({ numCoinsCollected, healthRemaining }) => {
  let healthBarWrapperStyle = {};
  let topVals = [-44, -83, -121, -159, -197, -235];
  let healthBarImgStyle = { top: topVals[healthRemaining] + "px" };
  return (
    <div className="HUD">
      <div className="health-bar" style={healthBarWrapperStyle}>
        <img src={health_bar} style={healthBarImgStyle} alt="health bar" />
      </div>
      <div className="coin-counter">
        <div className="coin-counter-icon">
          <img src={coin_gold} height={30} alt="coin counter coin icon" />{" "}
        </div>{" "}
        x {numCoinsCollected}
      </div>
    </div>
  );
};
