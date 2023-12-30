import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    modify_cart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const { modify_cart } = cartSlice.actions;
export default cartSlice.reducer;
