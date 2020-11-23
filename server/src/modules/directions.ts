export const north = "north";
export const east = "east";
export const south = "south";
export const west = "west";
export const northSouth = "north-south";
export const eastWest = "east-west";

export const partners = {
  north: northSouth,
  east: eastWest,
  south: northSouth,
  west: eastWest,
};

export const oppositePartner = {
  north: south,
  east: west,
  south: north,
  west: east,
};

export const reverseOrderOfPlay = {
  north: west,
  east: north,
  south: east,
  west: south,
};

export const orderOfPlay = {
  north: east,
  east: south,
  south: west,
  west: north,
};
