import Layout from "../../../components/Layout";
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";
import API_CALL from "../../../helper/api_backend";
import { useEffect, useRef, useState } from "react";
import { useDisclosure } from "../../../hooks/useDisclosure";
import Modal from "../../../components/Modal";

const ManageProduct = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState("");

  //Modal
  const addModal = useDisclosure();

  //add Data
  const [image1, setImage1] = useState();
  const productName = useRef();
  const [category, setCategory] = useState();
  const price = useRef();

  // Edit Data
  const editModal = useDisclosure();
  const [editData, setEditData] = useState();
  const [imageEdit, setImageEdit] = useState();

  const getDataProduct = async () => {
    const result = await API_CALL.get("/product/manage", {
      params: { search: search, page: page },
    });
    setProductData(result.data.result.data);
    setTotalPage(Math.ceil(result.data.result.row / 5));
  };

  const getDataCategory = async () => {
    const result = await API_CALL.get("/category");
    setCategoryData(result.data.result.data);
  };

  const handleAddData = async () => {
    const formData = new FormData();
    formData.append("productName", productName.current.value);
    formData.append("categoryId", category);
    formData.append("price", price.current.value);
    formData.append("productImage", image1);

    const result = await API_CALL.post("/product/create", formData);
    if (result.data.success) {
      alert(result.data.message);
      addModal.onClose();
      getDataProduct();
    }
  };

  const handleEdit = async (e, id) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productImage", imageEdit);
    formData.append("categoryName", e.target[0].value);
    const result = await API_CALL.patch(`/product/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (result.data.success) {
      getDataCategory();
      editModal.onClose();
      setFileEdit();
      alert(result.data.message);
    }
  };

  const handleDelete = async (id) => {
    const isRil = confirm("Are you sure want to delete data?");
    if (isRil) {
      const result = await API_CALL.delete(`/product/delete/${id}`);
      if (result.data.success) {
        alert(result.data.message);
      } else {
        alert("Failed delete data");
      }
      getDataProduct();
    }
  };

  useEffect(() => {
    getDataProduct();
    getDataCategory();
  }, [page, search]);

  const printDataProduct = () => {
    return productData.map((value, idx) => {
      return (
        <tr key={value.id}>
          <td className="border-collapse border px-4 py-2">{value.productName}</td>
          <td className="border-collapse border px-4 py-2">{value.category.category}</td>
          <td className="border-collapse border px-4 py-2">{value.price}</td>
          <td className="border-collapse border px-4 py-2">
            <div className="flex justify-center">
              <img
                className="w-20 h-20 object-cover rounded-xl"
                src={`http://localhost:3333/public/product/${value.image}`}
                alt=""
              />
            </div>
          </td>
          <td className="border-collapse border px-4 py-1">
            <div className="flex justify-center gap-2">
              <span
                className="w-8 h-8 p-1 cursor-pointer bg-slate-100 rounded-xl hover:bg-green-500 "
                onClick={() => {
                  editModal.onOpen();
                  setEditData(value);
                }}
              >
                <HiOutlinePencilSquare size={"100%"} />
              </span>
              <span
                className="w-8 h-8 p-1 cursor-pointer  bg-slate-100 rounded-xl hover:bg-red-500 "
                onClick={() => {
                  handleDelete(value.id);
                }}
              >
                <HiOutlineTrash size={"100%"} />
              </span>
            </div>
          </td>
        </tr>
      );
    });
  };

  console.log(editData);

  return (
    <Layout>
      <div className="main-container flex flex-col h-full w-full px-10 py-5  bg-gray-100 gap-4">
        <div className="flex w-full h-fit justify-between items-center ">
          <div className="title flex gap-2">
            <span className="text-2xl font-bold">Manage</span>
            <span className="text-2xl font-normal">Product</span>
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full justify-between">
              <button
                className=" bg-blue-500 hover:bg-blue-400 duration-200 transition-all px-4 py-2 text-white rounded-xl font-bold"
                onClick={() => {
                  addModal.onOpen();
                }}
              >
                Add Product
              </button>
              <div className=" search-menu focus-within:border-blue-500 flex gap-2 border-2 p-1 rounded-full">
                <span className="w-8 h-8 p-1">
                  <HiOutlineMagnifyingGlass size={"100%"} />
                </span>
                <input
                  className=" bg-transparent focus:outline-none placeholder:italic placeholder:text-sm"
                  type="text"
                  onChange={(e) => {
                    setTimeout(() => {
                      setSearch(e.target.value);
                    }, 1000);
                  }}
                  placeholder="Search Category"
                />
              </div>
            </div>
            <div className="w-full overflow-auto">
              <table className=" table-auto w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border-collapse border px-4 py-2">Product Name</th>
                    <th className="border-collapse border px-4 py-2">Category</th>
                    <th className="border-collapse border px-4 py-2">Price</th>
                    <th className="border-collapse border px-4 py-2">Image</th>
                    <th className="border-collapse border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="text-center">{printDataProduct()}</tbody>
              </table>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm">
                  Page <span className="font-bold">{page}</span> of{" "}
                  <span className="font-bold">{totalPage}</span>
                </span>
                <nav>
                  <ul class="inline-flex -space-x-px text-sm">
                    <li>
                      <button
                        class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100  disabled:bg-slate-300 "
                        onClick={() => {
                          setPage(page - 1);
                        }}
                        disabled={page === 1 ? true : false}
                      >
                        Previous
                      </button>
                    </li>

                    <li>
                      <button
                        class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100  disabled:bg-slate-300"
                        onClick={() => {
                          setPage(page + 1);
                        }}
                        disabled={page === totalPage ? true : false}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={addModal.isOpen} onClose={addModal.onClose} title={"Add Product"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddData();
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700" htmlFor="categoryName">
                Product Name
              </label>
              <input
                type="text"
                ref={productName}
                className=" px-4 py-2 border rounded-xl placeholder:text-sm"
                placeholder="Input product Name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700" htmlFor="categoryName">
                Product Category
              </label>
              <select
                name="productCategory"
                id="productCategory"
                className=" px-4 py-2 border rounded-xl placeholder:text-sm"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option className="text-gray-700" value="">
                  --- Select Category ---
                </option>
                {categoryData.map((value, idx) => {
                  return (
                    <option className="text-gray-700" key={value.id} value={value.id}>
                      {value.category}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700" htmlFor="categoryName">
                Product Price
              </label>
              <input
                ref={price}
                type="number"
                className=" px-4 py-2 border rounded-xl placeholder:text-sm"
                placeholder="Input product Price"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700" htmlFor="categoryName">
                Product Image
              </label>
              <div className="flex gap-2">
                <label
                  htmlFor="image1"
                  className="w-full h-36 border-2 border-dashed rounded-xl p-2"
                >
                  {image1 ? (
                    <div className="w-full h-full flex justify-center relative">
                      <img
                        className="aspect-square object-cover"
                        src={URL.createObjectURL(image1)}
                        alt=""
                      />
                      <span
                        className="rounded-full bg-slate-300 w-5 h-5 p-1 absolute -top-2 right-28 cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          setImage1();
                        }}
                      >
                        <HiOutlineXMark size={"100%"} />
                      </span>
                    </div>
                  ) : (
                    <div className="flex w-full h-full justify-center items-center">
                      <span className="text-gray-700 text-sm">Add Image</span>
                    </div>
                  )}
                </label>
                <input
                  className="hidden"
                  type="file"
                  name="image1"
                  id="image1"
                  onChange={(e) => {
                    setImage1(e.target.files[0]);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-6 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-400"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </Modal>
      <Modal isOpen={editModal.isOpen} onClose={editModal.onClose} title={"Edit Product"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddData();
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700" htmlFor="categoryName">
                Product Name
              </label>
              <input
                type="text"
                defaultValue={editData?.productName}
                className=" px-4 py-2 border rounded-xl placeholder:text-sm"
                placeholder="Input product Name"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700" htmlFor="categoryName">
                Product Category
              </label>
              <select
                name="productCategory"
                id="productCategory"
                className=" px-4 py-2 border rounded-xl placeholder:text-sm"
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option className="text-gray-700" value="">
                  --- Select Category ---
                </option>
                {categoryData.map((value, idx) => {
                  return (
                    <option
                      className="text-gray-700"
                      key={value.id}
                      value={value.id}
                      selected={value.id === editData?.categoryId ? true : false}
                    >
                      {value.category}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700" htmlFor="categoryName">
                Product Price
              </label>
              <input
                type="number"
                defaultValue={editData?.price}
                className=" px-4 py-2 border rounded-xl placeholder:text-sm"
                placeholder="Input product Price"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex w-full h-32 justify-evenly gap-4">
                <div className=" w-1/2 h-full flex justify-center">
                  <img
                    className="aspect-square h-full object-cover rounded-xl"
                    src={`http://localhost:3333/public/product/${editData?.image}`}
                    alt=""
                  />
                </div>
                <label
                  className="flex justify-center items-center w-1/2 h-32 border-2 border-dashed p-2"
                  htmlFor="productImage"
                >
                  {imageEdit ? (
                    <div className="h-full aspect-square relative z-50">
                      <span
                        className="w-5 h-5 p-1 absolute -top-1 -right-1 bg-slate-300 rounded-full cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          setImageEdit();
                        }}
                      >
                        <HiOutlineXMark size={"100%"} />
                      </span>
                      <img
                        className="w-full h-full object-cover rounded-xl"
                        src={URL.createObjectURL(imageEdit)}
                        alt=""
                      />
                    </div>
                  ) : (
                    <span>Upload New File Here</span>
                  )}
                </label>
                <input
                  className=" hidden px-4 py-2 border rounded-xl placeholder:text-sm"
                  type="file"
                  id="productImage"
                  name="productImage"
                  onChange={(e) => {
                    setImageEdit(e.target.files[0]);
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-6 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-400"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};

export default ManageProduct;
