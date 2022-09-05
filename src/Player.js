import "./Player.css";
import punk_idle from "./assets/main-characters/punk/Punk_idle.png";

export const Player = ({
  playerX,
  playerY,
  playerHeight,
  playerWidth,
  currentlyPressed,
  gameHeight,
  gameWidth,
}) => {
  console.log(playerX, playerY);

  return (
    <div
      id="player-div"
      style={{
        bottom: -650 + playerY,
        left: 100 + playerX,
      }}
    >
      <img src={punk_idle} alt="player" className="player-sprite-sheet" />
    </div>
  );
};
