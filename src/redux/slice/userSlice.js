import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    role: "",
    image: "",
  },
  reducers: {
    login: (state, action) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.image = action.payload.image;
    },
    logout: (state, action) => {
      state.username = "";
      state.role = "";
      state.image = "";
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
