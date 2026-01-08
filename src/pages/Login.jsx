import React, { useContext, useState, useEffect } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  //we use this state to switch b/w admin and doctor
  const [state, setState] = useState("Admin");
  const navigate = useNavigate();
  //it is used to store the email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const { setAToken, backendUrl, aToken } = useContext(AdminContext); //importing token and backendurl to make connection
  const { dToken, setDToken } = useContext(DoctorContext); //importing token and backendurl to make connection

  // define onsubmit function in where user enters data that data should be pass therefore we defined in form tag
  const onSubmitHandler = async (event) => {
    event.preventDefault(); //this stops the reloading the page

    try {
      // if the user is admin call the admin api from backend or else call doctor api from backend
      // for this we use axios library
      if (state === "Admin") {
        // hear we send email and password to backend to generate token for the admin
        const { data } = await axios.post(
          backendUrl + "/api/admin/login",
          { email, password }
        );
        if (data.success) {
          // if the emali and password is correct token is generted
          localStorage.setItem("aToken", data.token); //when user came next time this token is stored in the localstorage
          setAToken(data.token); //set that token but it is valid for some time
        } else {
          toast.error(data.message); //it generate alert message for user when they enter invalid data
        }
      } else {
       
        const { data } = await axios.post(
          backendUrl + "/api/doctor/login",
          { email, password }
        );

        if (data.success) {
          // if the emali and password is correct token is generted
          localStorage.setItem("dToken", data.token); //when user came next time this token is stored in the localstorage
          setDToken(data.token); //set that token but it is valid for some time
          console.log(data.token);
        } else {
          toast.error(data.message); //it generate alert message for user when they enter invalid data
        }

      }
    } catch (error) {
      toast.error(error.message);      
    }
  };

  useEffect(()=>{ // it is used to redirect to admin dashboard when admin has token

    if (aToken) {
      navigate('/') //if token is there navigate to admin dashboard
    }

  },[aToken]) //dependency array, when atoken changes useEffect will run

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login
        </p>

        {/* Email input */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-gray-400 rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>

        {/* Password input with show/hide */}
        <div className="w-full relative">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-gray-400 rounded w-full p-2 mt-1 pr-10"
            type={showPassword ? "text" : "password"}
            required
          />
          <span
            className="absolute right-3 top-[38px] cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>

        {/* Toggle between Admin / Doctor */}
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
