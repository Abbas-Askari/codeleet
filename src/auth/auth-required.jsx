import React from "react";
import { Link } from "react-router-dom";

function AuthRequired() {
  return (
    <div className="flex-1">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Login Required to proceed.</h1>
        <span className="text-xl font-light">Please login to continue</span>
        <div className="flex gap-2">
          <Link to="/signup" className="btn btn-secondary mt-4">
            Sign Up
          </Link>
          <Link to="/login" className="btn btn-primary mt-4">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthRequired;
