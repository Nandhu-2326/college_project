import CollegeLogo from "../CollegeLogo";
import Footer from "../Footer";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserGraduate, FaUserPlus, FaUserShield } from "react-icons/fa";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import { Outlet, useNavigate } from "react-router-dom";

const AdminUserPage = () => {
  let nav = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Mobile Nav */}
      <div className=" w-100 sticky-top d-md-none ">
        <div
          style={{ background: "rgb(26, 51, 208)" }}
          className="  d-flex justify-content-sm-between justify-content-between align-items-center  px-2 py-2"
        >
          <span
            onClick={handleShow}
            style={{ fontSize: "25px", cursor: "pointer" }}
            className=" d-md-none "
          >
            <GiHamburgerMenu className="text-light ms-3" />
          </span>
        </div>
      </div>

      {/* Offcanvas for small screens */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="w-75"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <MenuItems handleClose={handleClose} />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Layout */}
      <div className="container-fluid  ">
        <div className="row">
          <div className="col-12 d-none d-md-block">
            <div className=" ">
              <MenuItems />
            </div>
          </div>

          {/* Content Area */}
          <div className="col-12 text-center ">
            <div className=" rounded  ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const MenuItems = ({ handleClose }) => {
  let nav = useNavigate();
  return (
    <>
      <div className="container d-sm-flex justify-content-around mb-5 align-items-center flex-column flex-md-row">
        <Dropdown className="mt-3 w-25">
          <Dropdown.Toggle
            variant="light"
            className=" text-start d-flex align-items-center"
          >
            <FaUserPlus className="me-2" />
            HOD Details
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                nav("/AdminLayout/AdminUserPage/StaffAddorUpdatePage"),
                  handleClose();
              }}
            >
              HOD Details
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="w-25 mt-3">
          <Dropdown.Toggle
            variant="light"
            className=" text-start d-flex align-items-center"
          >
            <FaUserShield className="me-2" />
            Admin Details
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              href="#"
              onClick={() => {
                nav("/AdminLayout/AdminUserPage/AdminUserDetails"),
                  handleClose();
              }}
            >
              Admin Details
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="w-25 mt-3">
          <Dropdown.Toggle
            variant="light"
            className=" text-start d-flex align-items-center"
          >
            <FaUserShield className="me-2" />
            Department & Subject
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              href="#"
              onClick={() => {
                nav("/AdminLayout/AdminUserPage/Departments"), handleClose();
              }}
            >
              Department
            </Dropdown.Item>
            <Dropdown.Item
              href="#"
              onClick={() => {
                nav("/AdminLayout/AdminUserPage/Subject"), handleClose();
              }}
            >
              Subject
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default AdminUserPage;
