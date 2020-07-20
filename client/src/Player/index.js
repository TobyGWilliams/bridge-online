import React from "react";

const Player = ({ name, data }) => (
  <span style={{ flexBasis: '25%' }}>
    <h2>{name}</h2>
    <div>State:</div>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </span>
);

export default Player;
