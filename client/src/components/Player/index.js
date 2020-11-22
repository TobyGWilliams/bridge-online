import React from "react";

export default ({ player, direction }) => {
  return (
    <div>
      {direction}: {player ? player.name : "Waiting for player to join"}
    </div>
  );
};
