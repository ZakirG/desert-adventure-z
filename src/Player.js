import { useState, useEffect } from "react";
import * as d3 from "d3";

export const Player = ({ playerX, playerY, currentlyPressed }) => {
  console.log(playerX, playerY);

  return (
    <rect
      transform={`translate(${playerX}, ${playerY})`}
      width="10"
      height="10"
      fill="white"
      stroke="white"
      strokeWidth="2"
    />
  );
};
