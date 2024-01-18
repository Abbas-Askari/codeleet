import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync } from "./auth-slice";

function Login() {
  const [text, setText] = useState("Code Leet");
  const { isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  console.log(logo.src);

  function handleSubmit(e) {
    e.preventDefault();
    const user = {
      username: e.target[0].value,
      password: e.target[1].value,
    };
    dispatch(loginAsync(user));
  }

  return (
    <div className="p-16 h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        action=""
        className=" flex flex-col gap-2 p-6 py-16 w-96 items-center bg-base-200 rounded-box "
      >
        <h1 className="text-3xl font-bold pb-8">Login</h1>
        <span className="text-error font-light">{error}</span>
        <input
          type="text"
          placeholder="Username"
          className="input  input-bordered w-full max-w-xs"
        />

        <input
          type="password"
          placeholder="Password"
          className="input  input-bordered w-full max-w-xs mb-4"
        />
        <span>
          Don't have an account?
          <Link to="/signup" className=" link link-primary">
            {" "}
            Sign Up
          </Link>
        </span>

        <button
          disabled={isLoading}
          type="submit"
          className="btn btn-primary mt-2"
        >
          {isLoading && (
            <span className="loading loading-spinner loading-md"></span>
          )}
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
