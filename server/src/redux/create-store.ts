import { createStore, combineReducers } from "redux";

import gameReducer from "./games/reducer";

const combinedReducer = combineReducers({ games: gameReducer });

const store = createStore(combinedReducer);

export default store;
