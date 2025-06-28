import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showWarning } from "../SweetAlert";
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

import { IoEyeOffSharp } from "react-icons/io5";
import { IoMdEye } from "react-icons/io";
// mui
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

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
    console.log(boolenState);
  };

  const fetchStaffDetails = async (staffId) => {
    const getStaffDetails = doc(db, "Allstaffs", staffId);
    const AfterFetch = await getDoc(getStaffDetails);
    const AllData = AfterFetch.data();
    console.log(AllData);
    if (isUpdate && AllData) {
      for (let staffField in initialState) {
        dispatch({ field: staffField, value: AllData[staffField] || "" });
      }
    }
  };
  console.log(state);

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
      <div
        style={{ background: "#d5181c", overflowX: "hidden" }}
        className="container-fluid  bg-gradient text-light sticky-top p-2 "
      >
        <div className="row ">
          <div className="col-2 text-sm-end">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/HODLayout/StaffDetails");
              }}
            >
              <img src="/back.png" width={25} alt="" className="img img-flui" />
            </button>
          </div>
          <div className="col-4 d-flex justify-content-start align-items-center">
            <Stack direction="row" spacing={2}>
              <Chip
                avatar={
                  <Avatar style={{ color: "white", background: "#d5181c" }}>
                    {HODName?.slice(0, 1)}
                  </Avatar>
                }
                label={HODName}
                sx={{
                  width: 100,
                  bgcolor: "#fff", // white chip background
                  color: "#000", // black text
                  border: "1px solid #ccc", // optional subtle border
                  fontWeight: 500, // optional: stronger text
                }}
              />
            </Stack>
          </div>
          <div className="col-6  d-flex justify-content-center align-items-center ">
            <p className="fw-semibold m-0 text-center">
              {Department?.slice(14)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div style={{ width: "90%" }} className=" mb-5 mt-5 container">
        <div className="row rounded d-flex justify-content-center mb-5 align-items-center">
          <div className="col-12 col-md-6 col-lg-5 ">
            <div className="card border rounded  cards">
              <div
                className="card-header border-0"
                style={{ color: "rgb(26, 51, 208)" }}
              >
                <h3
                  className="text-uppercase fw-bold h3 text-center "
                  style={{ letterSpacing: "1.5px" }}
                >
                  {isUpdate ? "Update Staff" : "Create Staff"}
                </h3>
              </div>
              <div className="card-body ">
                {[1, 2, 3].map((staff) => {
                  const fieldName =
                    staff === 1
                      ? "staffName"
                      : staff === 2
                      ? "UserName"
                      : "Password";
                  const LabelName =
                    staff === 1
                      ? "Staff Name"
                      : staff === 2
                      ? "User Name"
                      : "Password";

                  const placeholder =
                    staff === 1
                      ? " Staff Name"
                      : staff === 2
                      ? " Username"
                      : " Password";

                  return (
                    <div
                      className="d-flex row  justify-content-center align-items-center flex-column"
                      key={staff}
                    >
                      <div className="col-12 mb-4">
                        <label
                          htmlFor=""
                          style={{
                            color: "#000",
                          }}
                          className="form-label  fw-semibold"
                        >
                          {LabelName}
                        </label>
                        <div className="input-group">
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
                                  <span
                                    key={nums}
                                    className="input-group-text"
                                    style={{ background: "white" }}
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
                                  </span>
                                );
                              })
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="card-footer border-0  d-flex justify-content-center">
                <button
                  className="btnlist text-uppercase bg-gradient px-5 py-2  rounded-pill"
                  // style={{
                  //   minWidth: "180px",
                  //   fontWeight: "600",
                  //   background: "#1A33D0",
                  //   color: "white",
                  // }}
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
                    <ThreeDot
                      color="#ffffff"
                      size="medium"
                      text=""
                      textColor=""
                    />
                  ) : isUpdate ? (
                    "Update Staff"
                  ) : (
                    "Add Staff"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container p-5"></div>
    </>
  );
};

export default AddStaff;
