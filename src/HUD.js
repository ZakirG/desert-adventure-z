import coin_gold from "./assets/items/Coin_gold.png";
import "./HUD.css";

export const HUD = ({ numCoinsCollected }) => {
  return (
    <div className="HUD">
      <div className="coin-counter">
        <div className="coin-counter-icon">
          <img src={coin_gold} height={30} />{" "}
        </div>{" "}
        x {numCoinsCollected}
      </div>
    </div>
  );
};
