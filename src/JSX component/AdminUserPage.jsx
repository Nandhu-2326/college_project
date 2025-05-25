import CollegeLogo from "./CollegeLogo";
import Footer from "./Footer";
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
      <CollegeLogo />
      {/* Mobile Nav */}
      <div className="container my-3 d-sm-none">
        <div className="bg-primary  d-flex justify-content-sm-between justify-content-between align-items-center  p-2 rounded">
          <span
            onClick={handleShow}
            style={{ fontSize: "25px", cursor: "pointer" }}
            className=" d-sm-none "
          >
            <GiHamburgerMenu className="text-light" />
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
      <div className="container ">
        <div className="row  ">
          {/* Sidebar for larger screens */}
          <div className="col-12  d-none d-sm-block">
            <div className="bg-primary opacity-75 pb-3 rounded text-light">
              <MenuItems />
            </div>
          </div>

          {/* Content Area */}
          <div className="col-12 text-center ">
            <div className="bg-light p-2 rounded  pt-4 pb-5">
              <h4 className="mt-3 ms-2">Welcome, Admin</h4>
              <p className="text-muted ms-4">
                Use the menu to manage student, user, and admin data.
              </p>
              {/* <div id="SingleStudent"><SingleStudent /></div> */}
              <div></div>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const MenuItems = ({ handleClose }) => {
  let nav = useNavigate();
  return (
    <>
      <div className="container d-sm-flex justify-content-around mb-5 align-items-center">
        <Dropdown className=" d-flex w-25 mt-sm-3">
          <Dropdown.Toggle
            variant="light"
            className=" text-start d-flex align-items-center"
          >
            <FaUserGraduate className="me-2" />
            Student Details
          </Dropdown.Toggle>
          <Dropdown.Menu className="">
            <Dropdown.Item
              href=""
              onClick={() => {
                nav("/AdminUserPage/SingleStudent");
                handleClose();
              }}
            >
              Single Student
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                nav("/AdminUserPage/MultipleStudentCSV"), handleClose();
              }}
            >
              Multiple Student
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className="mt-3  w-25">
          <Dropdown.Toggle
            variant="light"
            className=" text-start d-flex align-items-center"
          >
            <FaUserPlus className="me-2" />
            User Details
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {nav("/AdminUserPage/StaffAddorUpdatePage"),
              handleClose()
            }}
            >
              User Details
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
              onClick={() => {nav("/AdminUserPage/AdminUserDetails"),
              handleClose()
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
            Department and Subject
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              href="#"
              onClick={() => {nav("/AdminUserPage/Departments"), 
              handleClose()
            }}
            >
              Department
            </Dropdown.Item>
            <Dropdown.Item
              href="#"
              onClick={() =>{ nav("/AdminUserPage/Subject"),
              handleClose()
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
