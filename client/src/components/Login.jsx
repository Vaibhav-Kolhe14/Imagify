import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { delay, motion } from "motion/react";
import axios from 'axios'
import { toast } from "react-toastify";
import { data } from "react-router-dom";

function Login() {
  const { setShowLogin, setToken, setUser } = useContext(AppContext);
  const [state, setState] = useState("Login");

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if(state === 'Login') {
       const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/login`, {
          email, password
        })
        if(response.data.success) {
          setToken(response.data.token)
          setUser(response.data.user)
          localStorage.setItem('token', response.data.token)
          setShowLogin(false)
        } else {
          toast.error(response.data.message)
        }
      } else{
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/register`, {
          name, email, password
        })
        if(response.data.success) {
          setToken(response.data.token)
          setUser(response.data.user)
          localStorage.setItem('token', response.data.token)
          setShowLogin(false)
        } else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 50 }}
        transition={{ duration: 0.3 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-10 rounded-xl text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state}
        </h1>
        <p className="text-sm">Welcome back! Please sign in to continue</p>

        {state !== "Login" && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <img className="w-6 h-6" src={assets.profile_icon} alt="" />
            <input onChange={e => setName(e.target.value)} value={name}
              className="outline-none text-sm"
              type="text"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} alt="" />
          <input onChange={e => setEmail(e.target.value)} value={email}
            className="outline-none text-sm"
            type="email"
            placeholder="Email id"
            required
          />
        </div>

        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} alt="" />
          <input onChange={e => setPassword(e.target.value)} value={password}
            className="outline-none text-sm"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <p className="text-sm text-blue-600 my-4 cursor-pointer">
          Forgot password?
        </p>

        <button className="bg-blue-600 w-full text-white py-2 rounded-full">
          {state === "Login" ? "login" : "create account"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="cursor-pointer text-blue-600"
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="cursor-pointer text-blue-600"
            >
              Login
            </span>
          </p>
        )}

        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt=""
          className="top-5 absolute cursor-pointer right-5"
        />
      </motion.form>
    </div>
  );
}

export default Login;
