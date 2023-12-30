import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/cartSlice";

const globalState = configureStore({
  reducer: { cartReducer },
});

export default globalState;
