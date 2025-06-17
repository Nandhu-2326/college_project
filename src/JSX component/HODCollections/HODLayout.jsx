import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import CollegeLogo from "../CollegeLogo";
import Footer from "../Footer";
import { Toaster } from "react-hot-toast";
import { DotLoader } from "react-spinners";
const HODLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <div
          className="d-flex justify-content-center flex-column align-items-center"
          style={{
            height: "100vh",
            background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          }}
        >
          <DotLoader color="#00bfff" size={60} />
          <h1 className="h1 text-light mt-3" style={{ letterSpacing: "3px" }}>
            HOD PANEL
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <CollegeLogo />
      <Outlet />
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default HODLayout;
