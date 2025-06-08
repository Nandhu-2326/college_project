import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaUserLock } from "react-icons/fa6";
import { SiGoogleclassroom } from "react-icons/si";
import { InformationError, UserAdd, loading } from "../SweetAlert";
import { db } from "../Database";
import { addDoc, collection } from "firebase/firestore";
import { ThreeDot } from "react-loading-indicators";

const AddStaff = () => {
  const nav = useNavigate();
  //
  const [hodData, setHOD] = useState("");
  const [isloading, setisloading] = useState(false);
  //
  const stateObject = {
    staffName: "",
    UserName: "",
    Password: "",
  };
  const reducer = (state, action) => {
    return {
      ...state,
      [action.field]: action.value,
    };
  };
  const [state, dispatch] = useReducer(reducer, stateObject);
  //
  let { Department, HODName, ugorpg, rs, DepartmentCode } = hodData;
  const fetchData = () => {
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    console.log(HODdata);
    setHOD(HODdata);
  };
  useEffect(() => {
    fetchData();
  }, []);
  //
  const AddStaff = async () => {
    if (!state.staffName || !state.UserName || !state.Password) {
      let eror = "Please Fill Staff Details";
      InformationError(eror);
    } else {
      setisloading(true);
      await addDoc(collection(db, "Allstaffs"), {
        staffName: state.staffName,
        UserName: state.UserName,
        Password: state.Password,
        DepartmentCode: DepartmentCode,
      });
      const staff = "Staff Added";
      UserAdd(staff);
      setisloading(false);
      nav("/HODLayout/StaffDetails");
      
    }
  };
  return (
    <>
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center ">
        <p className="fw-semibold"> HOD : {HODName}</p>
        <p className="fw-semibold">Department : {Department?.slice(14)}</p>
      </div>
      <h1
        className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
        style={{ letterSpacing: "2.5px" }}
      >
        create staff
      </h1>

      <div className="container mb-5">
        <div className="row g-4">
          {[1, 2, 3].map((staff, index) => {
            return (
              <div className="d-flex justify-content-center align-items-center flex-column" key={staff}>
                <div className="col-12 col-sm-5" key={index}>
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-light">
                      {staff == 1 ? (
                        <FaUser />
                      ) : staff == 2 ? (
                        <FaUser />
                      ) : (
                        <FaUserLock />
                      )}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={
                        staff == 1
                          ? "staffName"
                          : staff == 2
                          ? "UserName"
                          : "Password"
                      }
                      name={
                        staff == 1
                          ? "staffName"
                          : staff == 2
                          ? "UserName"
                          : "Password"
                      }
                      onChange={(e) => {
                        dispatch({
                          field: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="container d-flex mt-3  justify-content-center  align-items-center">
            <button
              className="btn btn-primary me-3 text-uppercase bg-gradient mb-5"
              onClick={AddStaff}
            >
              {" "}
              {isloading ? (
                <ThreeDot color="#ffffff" size="medium" text="" textColor="" />
              ) : (
                "Add staff"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStaff;
