import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainMenu from "./pages/MainMenu";
import ManageCategory from "./pages/Manage/ManageCategory/ManageCategory";
import ManageProduct from "./pages/Manage/ManageProducts/ManageProduct";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MainMenu />} />
        <Route path="/manage/category" element={<ManageCategory />} />
        <Route path="/manage/product" element={<ManageProduct />} />
      </Routes>
    </>
  );
}

export default App;
