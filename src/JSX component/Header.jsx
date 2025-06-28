import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const nav = useNavigate();
  return (
    <>
      <nav class="navbar " style={{ background: "rgb(26, 51, 208)" }}>
        <div class="container-fluid d-flex align-items-center justify-content-center">
          <a
            class="navbar-brand text-light  me-4"
            onClick={() => {
              nav("/HODLayout");
            }}
            href="#"
          >
            HOD
          </a>
          <a
            class="navbar-brand text-light me-4"
            onClick={() => {
              nav("/AdminLayout");
            }}
            href="#"
          >
            ADMIN
          </a>
          <a
            class="navbar-brand text-light me-4"
            onClick={() => {
              nav("/");
            }}
            href="#"
          >
            STUDENT
          </a>
          <a
            class="navbar-brand text-light"
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
