import React, { useContext, useEffect, useState } from "react";
import { FaSchool } from "react-icons/fa";
import CreateStaffContext from "./CreateStaffContext";
// import { db } from "./Database.js";
// import { collection, getDocs } from "firebase/firestore";
// import Swal from "sweetalert2";
// import { createSTaff } from "./HODStaffs.jsx";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiNumber1 } from "react-icons/ri";
import { RiNumber2 } from "react-icons/ri";
import { RiNumber3 } from "react-icons/ri";
import { RiShieldUserFill } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";

const HOD_Cstaff = () => {
  let { staffData } = useContext(CreateStaffContext);
  console.log(staffData);
  let { Department, rs, ugorpg } = staffData || {};
  console.log(Department);
  
  return (
    <>
      <div className="container py-5">
        <h3 className="mb-4 text-center text-primary fw-bold t">
          CREATE STAFF
        </h3>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <span className="fw-semibold">Department</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <FaSchool />
              </div>
              <select name="" id="" className="form-control">
                <option value={Department}> {Department} </option>
              </select>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <span className="fw-semibold"> Regular or Self</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <span className="fw-bold">RS</span>
              </div>
              <select name="" id="" className="form-control">
                <option value={rs}> {rs} </option>
              </select>
            </div>
          </div>

          <div className="col-md-3 col-6">
            UG / PG
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <FaRegCircleUser />
              </div>
              <select name="" id="" className="form-control">
                <option value={ugorpg}> {ugorpg} </option>
              </select>
            </div>
          </div>

          <div className="col-md-4 mt-5 mb-5">
            <div className="row d-flex flex-column bg-light shadow">
              <span className="fw-bold text-center">I - Year</span>
              <div className="col">
                <span className="fw-semibold">Subject - I</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber1 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - II</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber2 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - III</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber3 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-5 mb-5 ">
            <div className="row d-flex flex-column bg-light shadow">
              <span className="fw-bold text-center">II - Year</span>
              <div className="col">
                <span className="fw-semibold">Subject - I</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber1 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - II</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber2 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - III</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber3 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-5 mb-5">
            <div className="row d-flex flex-column  bg-light shadow">
              <span className="fw-bold text-center">III - Year</span>
              <div className="col ">
                <span className="fw-semibold">Subject - I</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber1 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - II</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber2 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - III</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber3 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <span className="fw-semibold">Staff Name</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <FaRegCircleUser />
              </div>
              <input
                type="text"
                placeholder="Staff Name"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-4">
            <span className="fw-semibold">Staff User Name</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <RiShieldUserFill />
              </div>
              <input
                type="text"
                placeholder="Staff User Name"
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-4">
            <span className="fw-semibold">Staff Password</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <TbPasswordUser />
              </div>
              <input
                type="text"
                placeholder="Staff Password"
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center mb-5">
          <button className="btn btn-primary  fw-bold">Submit</button>
        </div>
      </div>
    </>
  );
};

export default HOD_Cstaff;
