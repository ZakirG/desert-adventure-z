import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "./GameWrapper.css";
import { GameLoop } from "./GameLoop";
import { MainMenu } from "./MainMenu";

const GameContainer = styled.div`
  position: absolute;
  width: 800px;
  // height: 600px;
  height: 720px;
  border: 1px solid #eee;
  overflow: hidden;
  user-select: none;
  background-color: black;

  img.bg {
    position: absolute;
    width: 100%;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    min-width: 500px;
  }
`;

export const GameWrapper = () => {
  let [gameStarted, setGameStarted] = useState(false);
  const onStart = () => {
    setGameStarted(true);
  };
  const backToMainMenu = () => {
    setGameStarted(false);
  };
  return (
    <GameContainer>
      {gameStarted ? (
        <GameLoop backToMainMenu={backToMainMenu} />
      ) : (
        <MainMenu onStart={onStart}></MainMenu>
      )}
    </GameContainer>
  );
};
