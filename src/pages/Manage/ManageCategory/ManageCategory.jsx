import { useEffect, useState, Fragment } from "react";
import Layout from "../../../components/Layout";
import {
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";
import API_CALL from "../../../helper/api_backend";
import { Dialog, Transition } from "@headlessui/react";
import { useDisclosure } from "../../../hooks/useDisclosure";
import Modal from "../../../components/Modal";

const ManageCategory = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  // Add Data
  const addModal = useDisclosure();
  const [preview, setPreview] = useState();
  const [file, setFile] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [search, setSearch] = useState("");
  // Edit Data
  const editModal = useDisclosure();
  const [editData, setEditData] = useState();
  const [fileEdit, setFileEdit] = useState();

  const getDataCategory = async () => {
    const result = await API_CALL.get("/category", {
      params: {
        page: page,
        search: search,
      },
    });
    if (result.data.success) {
      setCategoryData(result.data.result.data);
      setTotalPage(Math.ceil(result.data.result.row / 5));
      if (page > Math.ceil(result.data.result.row / 5)) {
        setPage(Math.ceil(result.data.result.row / 5));
      }
    }
  };

  const handleSearch = (e) => {
    setTimeout(() => {
      setSearch(e.target.value);
    }, 1000);
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("categoryImage", file);
    formData.append("categoryName", categoryName);

    const result = await API_CALL.post("/category/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (result.data.success) {
      setFile();
      setPreview();
      setCategoryName();
      addModal.onClose();
      getDataCategory();
      alert("Success add Category");
    }
  };

  const handleEdit = async (e, id) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryImage", fileEdit);
    formData.append("categoryName", e.target[0].value);
    const result = await API_CALL.patch(`/category/update/${id}`, formData, {
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
    const forReal = confirm("Are you sure you want to delete the data?");
    if (forReal) {
      const result = await API_CALL.delete(`/category/delete/${id}`);
      if (result.data.success) {
        alert(result.data.message);
        getDataCategory();
      }
    }
  };

  useEffect(() => {
    getDataCategory();
  }, [page, search]);

  const printDataCategory = () => {
    return categoryData.map((value, idx) => {
      return (
        <tr key={value.id}>
          <td className="border-collapse border px-4 py-2">{value.category}</td>
          <td className="border-collapse border px-4 py-2">
            <div className="flex justify-center">
              <img
                className="w-20 h-20 object-cover rounded-xl"
                src={`http://localhost:3333/public/category/${value.image}`}
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
  return (
    <Layout>
      <div className="main-container flex flex-col h-full w-full px-10 py-5  bg-gray-100 gap-4">
        <div className="flex w-full h-fit justify-between items-center ">
          <div className="title flex gap-2">
            <span className="text-2xl font-bold">Manage</span>
            <span className="text-2xl font-normal">Category</span>
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full justify-between">
              <button
                className=" bg-blue-500 hover:bg-blue-400 duration-200 transition-all px-4 py-2 text-white rounded-xl font-bold"
                onClick={addModal.onOpen}
              >
                Add Category
              </button>
              <div className=" search-menu focus-within:border-blue-500 flex gap-2 border-2 p-1 rounded-full">
                <span className="w-8 h-8 p-1">
                  <HiOutlineMagnifyingGlass size={"100%"} />
                </span>
                <input
                  className=" bg-transparent focus:outline-none placeholder:italic placeholder:text-sm"
                  type="text"
                  placeholder="Search Category"
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="w-full overflow-auto">
              <table className=" table-auto w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border-collapse border px-4 py-2">Category Name</th>
                    <th className="border-collapse border px-4 py-2">Image</th>
                    <th className="border-collapse border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="text-center">{printDataCategory()}</tbody>
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
      <Modal isOpen={addModal.isOpen} onClose={addModal.onClose} title={"Add Category"}>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700" htmlFor="categoryName">
                Category Name
              </label>
              <input
                className=" px-4 py-2 border rounded-xl placeholder:text-sm"
                placeholder="Input category name"
                type="text"
                id="categoryName"
                name="categoryName"
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Upload Image</label>
              <label
                className="flex justify-center items-center w-full h-32 border-2 border-dashed p-2"
                htmlFor="uploadImage"
              >
                {preview ? (
                  <div className="h-full aspect-square relative z-50">
                    <span
                      className="w-5 h-5 p-1 absolute -top-1 -right-1 bg-slate-300 rounded-full cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setPreview();
                        setFile();
                      }}
                    >
                      <HiOutlineXMark size={"100%"} />
                    </span>
                    <img className="w-full h-full object-cover rounded-xl" src={preview} alt="" />
                  </div>
                ) : (
                  <span>Upload File Here</span>
                )}
              </label>
              <input
                className=" hidden"
                type="file"
                id="uploadImage"
                name="uploadImage"
                accept="image/*"
                onChange={handleFile}
              />
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
      {/* Modal Edit */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.onClose} title={"Edit Category"}>
        <form
          onSubmit={(e) => {
            handleEdit(e, editData?.id);
          }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700" htmlFor="categoryName">
                Category Name
              </label>
              <input
                className=" px-4 py-2 border rounded-xl placeholder:text-sm"
                placeholder="Input category name"
                defaultValue={editData?.category}
                type="text"
                id="categoryName"
                name="categoryName"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-700">Category Image</label>
              <div className="flex w-full h-32 justify-evenly gap-4">
                <div className=" w-1/2 h-full flex justify-center">
                  <img
                    className="aspect-square h-full object-cover rounded-xl"
                    src={`http://localhost:3333/public/category/${editData?.image}`}
                    alt=""
                  />
                </div>
                <label
                  className="flex justify-center items-center w-1/2 h-32 border-2 border-dashed p-2"
                  htmlFor="categoryFile"
                >
                  {fileEdit ? (
                    <div className="h-full aspect-square relative z-50">
                      <span
                        className="w-5 h-5 p-1 absolute -top-1 -right-1 bg-slate-300 rounded-full cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          setFileEdit();
                        }}
                      >
                        <HiOutlineXMark size={"100%"} />
                      </span>
                      <img
                        className="w-full h-full object-cover rounded-xl"
                        src={URL.createObjectURL(fileEdit)}
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
                  id="categoryFile"
                  name="categoryFile"
                  onChange={(e) => {
                    setFileEdit(e.target.files[0]);
                  }}
                />
              </div>
            </div>
            <input type="hidden" value={editData?.image} />
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

export default ManageCategory;
