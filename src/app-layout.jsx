import React from "react";
import Nav from "./nav";
import { Outlet } from "react-router-dom";

function AppLayout({ children }) {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}

export default AppLayout;
