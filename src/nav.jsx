import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "./auth/auth-slice";

function Nav() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl">
          CodeLeet
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <form action="/">
            <input
              type="text"
              name="q"
              placeholder="Search Problems ..."
              className="input input-bordered w-24 md:w-auto"
            />
          </form>
        </div>
        <div className="dropdown dropdown-end">
          {user ? (
            <>
              <div
                tabIndex={0}
                role="button"
                className="avatar placeholder btn btn-ghost btn-circle"
              >
                <div className="bg-neutral text-neutral-content rounded-full w-12">
                  <span>{user?.username[0].toLocaleUpperCase()}</span>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                {/* <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li> */}
                <li>
                  <button onClick={() => dispatch(logout())}>Logout</button>
                </li>
              </ul>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline ">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
