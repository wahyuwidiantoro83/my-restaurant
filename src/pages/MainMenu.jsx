import { useEffect, useState } from "react";
import { HiOutlineMagnifyingGlass, HiOutlineChevronDown } from "react-icons/hi2";
import API_CALL from "../helper/api_backend";
import SideNav from "../components/SideNav";
import Category from "../components/Category";
import { useSearchParams } from "react-router-dom";
import Product from "../components/Product";
import { useDisclosure } from "../hooks/useDisclosure";
import { useDispatch, useSelector } from "react-redux";
import { modify_cart } from "../redux/slice/cartSlice";
import Clock from "../components/Clock";
import Layout from "../components/Layout";

const MainMenu = () => {
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState({});
  const sort = useDisclosure();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReducer.cart);

  useEffect(() => {
    setSearchParams(filter);
  }, [filter]);

  const getDataCategory = async () => {
    const result = await API_CALL.get("/category");
    if (result.data.success) {
      setCategory(result.data.result.data);
    }
  };

  const getDataProduct = async () => {
    const result = await API_CALL.get("/product", { params: filter });
    if (result.data.success) {
      setProduct(result.data.result);
    }
  };

  useEffect(() => {
    getDataProduct();
  }, [searchParams]);

  useEffect(() => {
    getDataCategory();
  }, []);

  const handleAddCart = (data) => {
    const cloneCart = [...cart];
    const find = cloneCart.findIndex((value, idx) => value?.id === data.id);
    if (find < 0) {
      cloneCart.push({ ...data, qty: 1 });
    } else if (find >= 0) {
      cloneCart[find] = { ...cloneCart[find], qty: cloneCart[find].qty + 1 };
    }
    dispatch(modify_cart(cloneCart));
  };

  const printCategory = () => {
    return category.map((value, idx) => {
      return (
        <div key={value.id}>
          <Category
            value={value}
            selected={value.id === parseInt(searchParams.get("category")) ? true : false}
            click={() => {
              const copyFilter = { ...filter };
              if (parseInt(filter?.category) === value.id) {
                delete copyFilter.category;
                setFilter(copyFilter);
              } else if (parseInt(filter?.category) !== value.id) {
                setFilter({ ...copyFilter, category: value.id });
              }
            }}
          />
        </div>
      );
    });
  };

  const printProduct = () => {
    return product.map((value, idx) => {
      return (
        <div key={idx}>
          <Product
            value={value}
            click={() => {
              handleAddCart(value);
            }}
          />
        </div>
      );
    });
  };

  const printCart = () => {
    return cart.map((value, idx) => {
      return (
        <div
          key={idx}
          className="cart-items flex w-full h-fit rounded-xl p-3 items-center bg-gray-100"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-6 items-center">
              <div className="div w-20 h-12 border-2 rounded-xl overflow-hidden">
                <img
                  className=" w-full h-full overflow-hidden object-cover"
                  src={`http://localhost:3333/public/product/${value.image}`}
                  alt=""
                  srcset=""
                />
              </div>
              <div className="details w-fit flex flex-col">
                <span className="text-sm font-bold">{value.productName}</span>
                <span className="text-sm font-light">
                  {value.price.toLocaleString("id", { style: "currency", currency: "idr" })}
                </span>
              </div>
              <div className="total w-fit flex gap-2">
                <span className="text-sm font-bold">
                  {(value.price * value.qty).toLocaleString("id", {
                    style: "currency",
                    currency: "idr",
                  })}
                </span>
              </div>
            </div>
            <div className="flex gap-4 justify-end items-center">
              <span className="text-base font-extrabold rounded-xl py-1 px-2 bg-white cursor-pointer">
                -
              </span>
              <span className="text-sm font-bold">{value.qty}</span>
              <span className="text-base font-extrabold rounded-xl py-1 px-2 bg-white cursor-pointer">
                +
              </span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Layout>
      <div className="main-container flex flex-grow flex-col h-full w-full px-10 py-5  bg-gray-100 gap-4">
        <div className="flex w-full h-fit justify-between items-center ">
          <div className="title flex gap-2">
            <span className="text-2xl font-bold">Menu</span>
            <span className="text-2xl font-normal">Category</span>
          </div>
          <Clock />
          <div className="search-menu focus-within:border-blue-500 flex gap-2 border-2 p-1 rounded-full">
            <span className="w-8 h-8 p-1">
              <HiOutlineMagnifyingGlass size={"100%"} />
            </span>
            <input
              className=" bg-transparent focus:outline-none placeholder:italic placeholder:text-sm"
              type="text"
              placeholder="Search foods"
              onChange={(e) => {
                const copyFilter = { ...filter };
                setTimeout(() => {
                  if (e.target.value === "") {
                    delete copyFilter.search;
                    setFilter(copyFilter);
                  } else if (e.target.value !== "") {
                    setFilter({ ...copyFilter, search: e.target.value });
                  }
                }, 1000);
              }}
            />
          </div>
        </div>
        <div className="flex w-full h-fit items-center">
          <div className="grid grid-flow-col overflow-x-auto w-auto h-fit gap-4">
            {printCategory()}
          </div>
        </div>
        <div className="flex w-full h-fit justify-between items-center ">
          <div className="title flex gap-2">
            <span className="text-xl font-bold">Choose</span>
            <span className="text-xl font-normal">Order</span>
          </div>
          <div className="sort-menu relative focus-within:border-blue-500 flex gap-2 items-center p-1 ">
            <span>Sort By</span>
            <span className="font-bold">{filter?.sort ? filter.sort : "None"}</span>
            <span className="w-8 h-8 p-1" onClick={sort.isOpen ? sort.onClose : sort.onOpen}>
              <HiOutlineChevronDown
                size={"100%"}
                className={` transition-all duration-200 cursor-pointer ${
                  sort.isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
            <div
              className={`${
                sort.isOpen ? "absolute" : "hidden"
              } top-9 right-0 flex flex-col w-32 h-fit rounded-xl p-2 justify-center bg-white shadow-md z-20`}
            >
              <span
                className="w-full h-fit cursor-pointer text-center py-1 text-sm text-gray-500 hover:font-bold hover:text-gray-800"
                onClick={() => {
                  const copyFilter = { ...filter };
                  delete copyFilter.sort;
                  setFilter({ ...copyFilter });
                  sort.onClose();
                }}
              >
                None
              </span>
              <span
                className="w-full h-fit cursor-pointer text-center py-1 text-sm hover:font-bold hover:text-gray-800 text-gray-500"
                onClick={() => {
                  const copyFilter = { ...filter };
                  setFilter({ ...copyFilter, sort: "Price" });
                  sort.onClose();
                }}
              >
                Price
              </span>
              <span
                className="w-full h-fit cursor-pointer text-center py-1 text-sm hover:font-bold hover:text-gray-800 text-gray-500"
                onClick={() => {
                  const copyFilter = { ...filter };
                  setFilter({ ...copyFilter, sort: "Name" });
                  sort.onClose();
                }}
              >
                Name
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full h-fit items-center py-4 overflow-y-auto">
          <div className="flex w-full h-full flex-wrap gap-6 justify-start">{printProduct()}</div>
        </div>
      </div>
      <div
        className={`display-cart ${
          cart.length ? "flex" : "hidden"
        } flex-col gap-6 max-h-full max-w-96 w-96 px-4 py-5 bg-white`}
      >
        <div className="title flex gap-2">
          <span className="text-xl font-bold">Current</span>
          <span className="text-xl font-normal">Order</span>
        </div>
        <div className="flex flex-col gap-6 h-full overflow-y-auto">
          <div className="cart w-full flex h-full flex-col px-2 gap-2">{printCart()}</div>
        </div>
        <div className="flex flex-col h-fit py-4 gap-2 border-dashed border-t-2">
          <div className="flex justify-between">
            <span className="text-sm font-light">SubTotal</span>
            <span className="text-sm font-bold">100.000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-light">PPN(10%)</span>
            <span className="text-sm font-light">10.000</span>
          </div>
          <div className="flex justify-between border-dashed border-t-2 pt-2">
            <span className="text-base font-bold">Total</span>
            <span className="text-base font-bold">110.000</span>
          </div>
        </div>
        <button className=" w-full h-fit bg-blue-500 rounded-xl p-4 text-white font-extrabold text-xl hover:bg-blue-400 transition-all duration-200">
          Pay
        </button>
      </div>
      <div
        className={`${
          sort.isOpen ? "absolute" : "hidden"
        } top-0 right-0 w-screen h-screen shadow-md z-10`}
        onClick={() => {
          sort.onClose();
        }}
      ></div>
    </Layout>
  );
};

export default MainMenu;
