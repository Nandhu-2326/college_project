import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import CollegeLogo from "../CollegeLogo";
import Footer from "../Footer";
import { Toaster } from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";

const StaffLayout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1700); // 2s delay
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center flex-column align-items-center"
        style={{
          height: "100vh",
          background: "rgba(25, 150, 25, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <ThreeDot
          variant="bounce"
          color="#111111"
          size="medium"
          text=""
          textColor=""
        />
        <h1
          className="mt-4 fw-bold"
          style={{
            color: "#000001", // Deep Sky Blue
            letterSpacing: "4px",
            fontSize: "2rem",
            textShadow: "0 0 10px rgba(0, 0, 1, 0.7)",
          }}
        >
          STAFF PANEL
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

export default StaffLayout;
