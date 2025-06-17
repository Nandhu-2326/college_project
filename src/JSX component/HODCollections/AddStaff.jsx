import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaUserLock } from "react-icons/fa6";
import { InformationError, UserAdd, showWarning } from "../SweetAlert";
import { db } from "../Database";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ThreeDot } from "react-loading-indicators";
import toast from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoMdEye } from "react-icons/io";

const AddStaff = () => {
  const nav = useNavigate();

  const [hodData, setHOD] = useState("");
  const [StaffData, setStaffData] = useState("");
  const [isloading, setisloading] = useState(false);
  const [isUpdate, setisUpdate] = useState(false);
  const [eyeNumber, seteyeNumber] = useState(1);
  const initialState = {
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

  const [state, dispatch] = useReducer(reducer, initialState);

  let { Department, HODName, DepartmentCode } = hodData;

  const staffId = StaffData?.id;

  const fetchData = () => {
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    setHOD(HODdata);

    const StaffDetails = sessionStorage.getItem("staff");
    const StaffDatas = JSON.parse(StaffDetails);
    setStaffData(StaffDatas);

    const States = sessionStorage.getItem("state");
    const boolenState = JSON.parse(States) === true;
    setisUpdate(boolenState);
  };

  const fetchStaffDetails = async (staffId) => {
    const getStaffDetails = doc(db, "Allstaffs", staffId);
    const AfterFetch = await getDoc(getStaffDetails);
    const AllData = AfterFetch.data();

    if (isUpdate && AllData) {
      for (let staffField in initialState) {
        dispatch({ field: staffField, value: AllData[staffField] || "" });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isUpdate && staffId) {
      fetchStaffDetails(staffId);
    }
  }, [isUpdate, staffId]);

  const AddStaff = async () => {
    if (!state.staffName || !state.UserName || !state.Password) {
      showWarning("Please Fill All Fields");
    } else {
      try {
        const AnalysisData = query(
          collection(db, "Allstaffs"),
          where("Password", "==", state.Password),
          where("UserName", "==", state.UserName)
        );

        const dataFetch = await getDocs(AnalysisData);

        if (dataFetch.empty) {
          // No duplicate found, safe to add
          setisloading(true);
          await addDoc(collection(db, "Allstaffs"), {
            staffName: state.staffName,
            UserName: state.UserName,
            Password: state.Password,
            DepartmentCode: DepartmentCode,
          });
          toast.success("Staff Saved");
          setisloading(false);
          nav("/HODLayout/StaffDetails");
        } else {
          // Duplicate found
          toast.error("Username and Password Already Provided");
        }
      } catch (error) {
        setisloading(false);
        toast.error("Error adding staff");
        console.error(error);
      }
    }
  };

  const UpdateStaff = async (staffId) => {
    if (!state.staffName || !state.UserName || !state.Password) {
      showWarning("Please Fill All Fields");
    } else {
      try {
        const AnalysisDataUP = query(
          collection(db, "Allstaffs"),
          where("Password", "==", state.Password),
          where("UserName", "==", state.UserName)
        );

        const dataFetchUP = await getDocs(AnalysisDataUP);
        if (dataFetchUP.empty) {
          setisloading(true);
          await updateDoc(doc(db, "Allstaffs", staffId), {
            staffName: state.staffName,
            UserName: state.UserName,
            Password: state.Password,
            DepartmentCode: DepartmentCode,
          });
          toast.success("Staff Updated");
          setisloading(false);
          nav("/HODLayout/StaffDetails");
        } else {
          toast.error("Username and Password Already Provided");
        }
      } catch (error) {
        setisloading(false);
        toast.error("Error updating staff");
        console.error(error);
      }
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center p-2 px-4">
        <p className="fw-semibold m-0">HOD: {HODName}</p>
        <p className="fw-semibold m-0">Department: {Department?.slice(14)}</p>
      </div>

      <div className="container  d-felx  p-3 justify-content-start align-items-center">
        <button
          className="btn text-primary border-0 fs-3"
          onClick={() => {
            nav("/HODLayout/StaffDetails");
          }}
        >
          <FaArrowLeftLong /> Back
        </button>
      </div>

      {/* Main Card */}
      <div className="d-flex mt-4 justify-content-center align-items-center mb-5">
        <div className="card shadow-lg rounded-4" style={{ width: "500px" }}>
          <div className="card-header text-uppercase bg-primary text-light fw-semibold text-center py-3">
            <h3 style={{ letterSpacing: "2.5px" }}>
              {isUpdate ? "Update Staff" : "Create Staff"}
            </h3>
          </div>

          <div className="card-body px-4 py-4">
            <div className="row g-4">
              {[1, 2, 3].map((staff, index) => {
                const fieldName =
                  staff === 1
                    ? "staffName"
                    : staff === 2
                    ? "UserName"
                    : "Password";

                const placeholder =
                  staff === 1
                    ? "Enter Staff Name"
                    : staff === 2
                    ? "Enter Username"
                    : "Enter Password";

                const icon =
                  staff === 1 ? (
                    <FaUser />
                  ) : staff === 2 ? (
                    <FaUser />
                  ) : (
                    <FaUserLock />
                  );

                return (
                  <div
                    className="d-flex justify-content-center align-items-center flex-column"
                    key={staff}
                  >
                    <div className="col-12 col-sm-12">
                      <label
                        htmlFor=""
                        style={{ letterSpacing: "1.5px" }}
                        className="form-label text-uppercase text-primary fw-semibold"
                      >
                        {fieldName}
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-primary text-light">
                          {icon}
                        </span>
                        <input
                          type={
                            fieldName === "Password" && eyeNumber == 1
                              ? "password"
                              : "text"
                          }
                          className="form-control"
                          placeholder={placeholder}
                          name={fieldName}
                          value={state[fieldName]}
                          onChange={(e) => {
                            dispatch({
                              field: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                        {staff === 3
                          ? [eyeNumber].map((nums) => {
                              return (
                                <button
                                  key={nums}
                                  className="input-group-text btn btn-primary"
                                >
                                  {nums === 1 ? (
                                    <IoEyeOffSharp
                                      onClick={() => {
                                        seteyeNumber(2);
                                      }}
                                    />
                                  ) : (
                                    <IoMdEye
                                      onClick={() => {
                                        seteyeNumber(1);
                                      }}
                                    />
                                  )}
                                </button>
                              );
                            })
                          : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Button */}
          <div className="card-footer bg-light d-flex justify-content-center mb-4">
            <button
              className="btn btn-primary text-uppercase bg-gradient px-5 py-2 my-3 rounded-pill"
              style={{ minWidth: "180px", fontWeight: "600" }}
              onClick={
                isUpdate
                  ? () => {
                      UpdateStaff(staffId);
                    }
                  : AddStaff
              }
              disabled={isloading}
            >
              {isloading ? (
                <ThreeDot color="#ffffff" size="medium" text="" textColor="" />
              ) : isUpdate ? (
                "Update Staff"
              ) : (
                "Add Staff"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStaff;
