import { useState } from "react";
import API_CALL from "../helper/api_backend";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const actionLogin = async () => {
    try {
      if (username && password) {
        const login = await API_CALL.post("/user/login", {
          username: username,
          password: password,
        });

        if (login.data.success) {
          navigate("/menu");
        }
      } else {
        return alert("Username or password cannot null");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div>
      <div className="flex h-screen w-screen justify-center items-center">
        <div className="flex w-[50%] h-[70%] border-2 rounded-xl shadow-lg overflow-hidden">
          <div className="div w-[50%] h-full rounded-r-lg overflow-hidden">
            <img
              className=" w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            />
          </div>
          <div className="flex flex-col w-[50%] h-full items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Sign In</h1>
            <div className="form-group w-[80%]">
              <span className="block text-xs text-gray-500">Username</span>
              <input
                className="border-2 rounded-md px-2 py-2 text-sm w-full"
                placeholder="Input Username"
                type="text"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="form-group w-[80%]">
              <span className="block text-xs text-gray-500">Password</span>
              <input
                className="border-2 rounded-md px-2 py-2 text-sm w-full"
                placeholder="Input Password"
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button
              type="button"
              className="border-2 rounded-md bg-gray-800 px-5 py-2 text-gray-200 hover:bg-gray-500 transition-all ease-in duration-200"
              onClick={actionLogin}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
