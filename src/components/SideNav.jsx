import { useEffect, useState } from "react";
import {
  HiOutlineBuildingStorefront,
  HiOutlineTruck,
  HiOutlineRectangleStack,
  HiOutlineReceiptPercent,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const SideNav = () => {
  const [selected, setSelected] = useState("Home");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname.toLowerCase().includes("menu")) setSelected("Home");
    if (pathname.toLowerCase().includes("category")) setSelected("Categories");
    if (pathname.toLowerCase().includes("product")) setSelected("Products");
    if (pathname.toLowerCase().includes("transaction")) setSelected("Transactions");
  }, [pathname]);

  const sideMenu = [
    { name: "Home", icon: <HiOutlineBuildingStorefront size={"100%"} />, refTo: "/menu" },
    { name: "Products", icon: <HiOutlineTruck size={"100%"} />, refTo: "/manage/product" },
    {
      name: "Categories",
      icon: <HiOutlineRectangleStack size={"100%"} />,
      refTo: "/manage/category",
    },
    {
      name: "Transactions",
      icon: <HiOutlineReceiptPercent size={"100%"} />,
      refTo: "/manage/transaction",
    },
  ];

  const printSideNav = () => {
    return sideMenu.map((value, idx) => {
      return (
        <div
          key={idx}
          className={`side-menu-item flex flex-col w-full justify-center items-center aspect-square p-2 rounded-xl hover:bg-blue-500 hover:text-gray-100 hover:shadow-sm ${
            selected === value.name ? " bg-blue-500 text-gray-100 shadow-sm" : ""
          } cursor-pointer`}
          onClick={() => {
            navigate(`${value.refTo}`);
          }}
        >
          <span className="w-8 h-8">{value.icon}</span>
          <span
            className={`text-xs w-full text-center truncate ${
              selected === value.name ? "font-bold" : ""
            }`}
          >
            {value.name}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="side-nav flex w-[200px] bg-white">
      <div className="flex flex-col px-4 py-5 items-center gap-6">
        <h1 className="brand text-gray-800 text-xl font-bold">My Restaurant</h1>
        <div className="side-menu flex flex-col w-[60%] gap-4">{printSideNav()}</div>
      </div>
    </div>
  );
};

export default SideNav;
