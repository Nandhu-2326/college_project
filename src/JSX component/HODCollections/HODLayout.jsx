import React from "react";
import { Outlet } from "react-router-dom";
import CollegeLogo from "../CollegeLogo";
import Footer from "../Footer";

const HODLayout = () => {
  return (
    <>
      <CollegeLogo />
      <Outlet />
      <Footer />
    </>
  );
};

export default HODLayout;
