import productReducer from "./productReducer";
import authReducer from './authReducer'
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  product: productReducer,
  auth:authReducer
});

export default rootReducer;
