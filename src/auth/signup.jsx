import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { loginAsync, signupAsync } from "./auth-slice";

function Signup() {
  const [text, setText] = useState("Code Leet");
  const { isLoading, error, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  console.log(logo.src);
  const navigate = useNavigate();
  console.log({ user });
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  function handleSubmit(e) {
    e.preventDefault();
    const user = {
      username: e.target[0].value,
      password: e.target[1].value,
    };
    console.log({ user });
    dispatch(signupAsync(user));
  }

  return (
    <div className="p-16 h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        action=""
        className=" flex flex-col gap-2 p-6 py-16 w-96 items-center bg-base-200 rounded-box "
      >
        <h1 className="text-3xl font-bold pb-8">Sign Up</h1>
        <span className="text-error font-light">{error}</span>
        <input
          type="text"
          placeholder="Username"
          className="input  input-bordered w-full max-w-xs"
        />

        <input
          type="password"
          placeholder="Password"
          className="input  input-bordered w-full max-w-xs"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="input  input-bordered w-full max-w-xs mb-4"
        />
        <span>
          Already have an account?
          <Link to="/login" className=" link link-primary">
            {" "}
            Login
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
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
