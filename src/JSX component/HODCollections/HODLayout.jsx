import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import CollegeLogo from "../CollegeLogo";
import Footer from "../Footer";
import { Toaster } from "react-hot-toast";
import { Commet } from "react-loading-indicators";
import Header from "../Header";

const HODLayout = () => {
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(false); // for scale effect

  useEffect(() => {
    // Trigger zoom and set loading timeout
    setZoom(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center flex-column align-items-center"
        style={{ height: "100vh" }}
      >
        <Commet color="#d5181c" size="medium" text="" textColor="" />
        <h1
          className="h1 mt-3"
          style={{ letterSpacing: "3px", fontWeight: "bold", color: "#d5181c" }}
        >
          HOD PANEL
        </h1>
      </div>
    );
  }

  return (
    <>
      <CollegeLogo />
      <div className="d-md-block d-none">
        <Header />
      </div>
      <Outlet />
      <div className="d-md-none">
        <Footer />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default HODLayout;
