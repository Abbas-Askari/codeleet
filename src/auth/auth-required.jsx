import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AuthRequired() {
  const navigate = useNavigate();

  function back() {
    navigate(-1);
  }

  return (
    <div className="flex-1">
      <div className="flex flex-col items-center justify-center h-full ">
        <h1 className="text-2xl font-bold">Login Required to proceed.</h1>
        <span className="text-xl font-light">Please login to continue</span>
        <div className="flex gap-2 justify-center">
          <button onClick={back} className="btn btn-sm mt-4 btn-block">
            Back
          </button>

          {/* <Link to="/signup" className="btn btn-sm btn-secondary mt-4">
            Sign Up
          </Link> */}
          <Link to="/login" className="btn btn-sm btn-primary mt-4 btn-block">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthRequired;
