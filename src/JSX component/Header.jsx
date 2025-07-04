import React from "react";
import { useNavigate } from "react-router-dom";
import "../JSX component/Style Component/header.css";
const Header = () => {
  const nav = useNavigate();
  return (
    <>
      <nav className="navbar " style={{ background: "rgb(26, 51, 208)" }}>
        <div className="container-fluid d-flex align-items-center justify-content-center">
          <a
            className="navbar-brand text-light  me-4"
            onClick={() => {
              nav("/HODLayout");
            }}
            href="#"
          >
            HOD
          </a>
          <a
            className="navbar-brand text-light me-4"
            onClick={() => {
              nav("/AdminLayout");
            }}
            href="#"
          >
            ADMIN
          </a>
          <a
            className="navbar-brand text-light me-4"
            onClick={() => {
              nav("/");
            }}
            href="#"
          >
            STUDENT
          </a>
          <a
            className="navbar-brand text-light"
            onClick={() => {
              nav("/StaffLayout");
            }}
            href="#"
          >
            STAFF
          </a>
        </div>
      </nav>
    </>
  );
};

export default Header;
