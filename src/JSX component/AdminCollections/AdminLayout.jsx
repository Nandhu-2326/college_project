import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import CollegeLogo from "../CollegeLogo";
import Footer from "../Footer";
import { Toaster } from "react-hot-toast";

const AdminLayout = () => {
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(false); // for scale effect

  useEffect(() => {
    // Trigger zoom and set loading timeout
    setZoom(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center flex-column align-items-center"
        style={{ height: "100vh" }}
      >
        
        <h1
          className="h1 text-dark mt-3"
          style={{ letterSpacing: "3px", fontWeight: "bold" }}
        >
          ADMIN PANEL
        </h1>
      </div>
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

export default AdminLayout;
