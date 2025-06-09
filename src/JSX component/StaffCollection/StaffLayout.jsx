import React from "react";
import CollegeLogo from "../CollegeLogo";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import { Toaster } from "react-hot-toast";

const StaffLayout = () => {
  return (
    <>
      <CollegeLogo />
      <Outlet />
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default StaffLayout;
