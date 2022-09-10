import "./MainMenu.css";
import pyramid from "./assets/environment-objects/pyramid.png";

export const MainMenu = ({ onStart }) => {
  return (
    <div className="main-menu">
      <h1>DESERT ADVENTURE Z</h1>
      <img
        src={pyramid}
        className="pyramid"
        style={{ top: "190px", position: "relative" }}
      />
      <button className="menu-button" onClick={onStart}>
        START
      </button>
    </div>
  );
};
