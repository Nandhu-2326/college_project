import bcrypt, { hash } from "bcryptjs";
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
  onSnapshot,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { ThreeDot } from "react-loading-indicators";
import toast from "react-hot-toast";

import { IoEyeOffSharp } from "react-icons/io5";
import { IoMdEye } from "react-icons/io";
// mui
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
const AddStaff = () => {
  const nav = useNavigate();

  const [hodData, setHOD] = useState("");
  //   const [StaffData, setStaffData] = useState("");
  const [isloading, setisloading] = useState(false);
  const [isUpdate, setisUpdate] = useState(false);
  const [eyeNumber, seteyeNumber] = useState(1);
  const [tableData, settableData] = useState([]);

  const [currentId, setCurrentId] = useState("");

  const initialState = {
    staffName: "",
    UserName: "",
    OrgPassword: "",
    Password: "",
  };

  const reducer = (state, action) => {
    return {
      ...state,
      [action.field]: action.value,
    };
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log(state);
  let { Department, HODName, DepartmentCode } = hodData;
  // console.log(hodData);
  // const staffId = StaffData?.id;
  // console.log(staffId);

  const fetchData = () => {
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    setHOD(HODdata);

    // const StaffDetails = sessionStorage.getItem("staff");
    // const StaffDatas = JSON.parse(StaffDetails);
    // setStaffData(StaffDatas);

    // const States = sessionStorage.getItem("state");
    // const boolenState = JSON.parse(States) === true;
    // setisUpdate(boolenState);
    // console.log(boolenState);
  };

  //   const fetchStaffDetails = async (staffId) => {
  //     const getStaffDetails = doc(db, "Allstaffs", staffId);
  //     const AfterFetch = await getDoc(getStaffDetails);
  //     const AllData = AfterFetch.data();
  //     console.log(AllData);
  //     if (isUpdate && AllData) {
  //       for (let staffField in initialState) {
  //         dispatch({ field: staffField, value: AllData[staffField] || "" });
  //       }
  //     }
  //   };

  const fetchDataFB = () => {
    try {
      // Prevent invalid query
      if (!DepartmentCode) {
        console.warn("DepartmentCode is missing");
        return () => {}; // Return a dummy cleanup function
      }

      const querys = query(
        collection(db, "Allstaffs"),
        where("DepartmentCode", "==", DepartmentCode)
      );

      const unsubscribe = onSnapshot(querys, (data) => {
        const AllData = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(AllData);
        settableData(AllData);
        // setTotalHod(AllData.length);
        // setData(AllData);
      });

      return unsubscribe; // Always return a cleanup function
    } catch (e) {
      console.log(e.message);
      return () => {}; // Safe fallback
    }
  };

  useEffect(() => {
    const unsubscribe = fetchDataFB();
    return () => unsubscribe(); // Cleanup is always safe
  }, [DepartmentCode]);

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (isUpdate && staffId) {
  //     fetchStaffDetails(staffId);
  //   }
  // }, [isUpdate, staffId]);

  const AddStaff = async () => {
    if (!state.staffName || !state.UserName || !state.Password) {
      showWarning("Please Fill All Fields");
      return;
    }

    try {
      const AnalysisData = query(
        collection(db, "Allstaffs"),
        where("OrgPassword", "==", state.Password), // compare with original password
        where("UserName", "==", state.UserName)
      );

      const dataFetch = await getDocs(AnalysisData);

      if (dataFetch.empty) {
        // ✅ No duplicate found — proceed to add
        const hashPassword = await bcrypt.hash(state.Password, 10);

        setisloading(true);
        await addDoc(collection(db, "Allstaffs"), {
          staffName: state.staffName,
          UserName: state.UserName,
          Password: hashPassword,
          OrgPassword: state.Password,
          DepartmentCode: DepartmentCode,
        });

        toast.success("Staff Added");
        setisloading(false);
        nav("/HODLayout/StaffDetails");
        sessionStorage.removeItem("staff");
      } else {
        // ❌ Duplicate found
        toast.error("Username and Password Already Provided");
      }
    } catch (error) {
      setisloading(false);
      toast.error("Error adding staff");
      console.error(error);
    }
  };

  const UpdateStaff = async () => {
    if (!state.staffName || !state.UserName || !state.Password) {
      showWarning("Please Fill All Fields");
      return;
    }

    try {
      // Find users with same username & password
      const q = query(
        collection(db, "Allstaffs"),
        where("UserName", "==", state.UserName),
        where("OrgPassword", "==", state.Password) // compare with original password field
      );

      const snapshot = await getDocs(q);

      // Remove the current record from duplicate check
      console.log(currentId);
      const duplicates = snapshot.docs.filter((doc) => doc.id !== currentId);

      if (duplicates.length > 0) {
        toast.error("Username and Password Already Provided to another staff");
      } else {
        // No duplicates except possibly the current record
        const hashPassword = await bcrypt.hash(state.Password, 10);

        setisloading(true);

        await updateDoc(doc(db, "Allstaffs", currentId), {
          staffName: state.staffName,
          UserName: state.UserName,
          Password: hashPassword,
          OrgPassword: state.Password,
          DepartmentCode: DepartmentCode,
        });

        toast.success("Staff Updated");
        setisloading(false);
        setisUpdate(false);

        // sessionStorage.removeItem("staff");
        for (let i in initialState) {
          dispatch({ field: i, value: "" });
        }
      }
    } catch (error) {
      setisloading(false);
      toast.error(error.message);
    }
  };

  const ChangestaffDetails = async (id) => {
    console.log(id);
    setCurrentId(id);
    setisUpdate(true);
    const getStaffData = await getDoc(doc(db, "Allstaffs", id));
    const staffdetails = getStaffData.data();
    dispatch({ field: "staffName", value: staffdetails.staffName });
    dispatch({ field: "UserName", value: staffdetails.UserName });
    dispatch({ field: "Password", value: staffdetails.OrgPassword });
  };

  const deleteStaff = async (id, stName) => {
    Swal.fire({
      title: "Delete Staff?",
      html: `<div style="font-size: 1.1rem">
               Are you sure you want to remove <strong>${stName}</strong>?
             </div>`,
      iconHtml: "🗑️",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "No, Cancel",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3498db",
      background: "#fefefe",
      backdrop: `
        rgba(0,0,0,0.4)
        left top
        no-repeat
      `,
      customClass: {
        popup: "animated fadeInDown faster",
        title: "text-danger fw-bold",
        confirmButton: "px-4 py-2",
        cancelButton: "px-4 py-2",
      },
      reverseButtons: true,
      focusCancel: true,
      showClass: {
        popup: "swal2-show animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "swal2-hide animate__animated animate__fadeOutUp",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "Allstaffs", id));
          toast.success(`Staff "${stName}" deleted successfully`);
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  return (
    <>
      {/* Top Bar */}
      <div
        style={{ background: "#d5181c", overflowX: "hidden" }}
        className="container-fluid d-md-none bg-gradient text-light sticky-top p-1 "
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
                className="fw-semibold"
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

      <div className="container d-none d-md-block">
        <div className="row  d-flex align-items-center">
          <div className="col-2">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/HODLayout/StaffDetails");
              }}
            >
              <img
                src="/arrow-left.png"
                width={25}
                alt=""
                className="img img-flui"
              />
            </button>
          </div>
          <div className="col-2 d-flex justify-content-start ">
            <Stack direction="row" spacing={2}>
              <Chip
                avatar={
                  <Avatar style={{ color: "white", background: "#d5181c" }}>
                    {HODName?.slice(0, 1)}
                  </Avatar>
                }
                label={HODName}
                className="fw-semibold"
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
          <div className="col-8 fw-semibold d-flex justify-content-end align-items-center ">
            {Department?.slice(14)}
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
                          className="form-label  "
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
                          UpdateStaff();
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
      <div className="container ">
        <div className="table-responsive">
          <table
            className="table table-bordered align-middle text-center"
            style={{
              border: "2px solid #ccc", // outer border
              borderCollapse: "collapse",
            }}
          >
            <thead className="table-light">
              <tr>
                <th style={{ padding: "14px", fontWeight: "600" }}>S.No</th>
                <th style={{ padding: "14px", fontWeight: "600" }}>Name</th>
                <th style={{ padding: "14px", fontWeight: "600" }}>Edit</th>
                <th style={{ padding: "14px", fontWeight: "600" }}>Delete</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((doc, index) => (
                <tr key={doc.id}>
                  <td style={{ padding: "14px" }}>{index + 1}</td>
                  <td style={{ padding: "14px", fontWeight: "500" }}>
                    {doc.staffName}
                  </td>
                  <td style={{ padding: "14px" }}>
                    <img
                      src="/edit.png"
                      width={32}
                      alt="Edit"
                      style={{ cursor: "pointer" }}
                      onClick={() => ChangestaffDetails(doc.id)}
                    />
                  </td>
                  <td style={{ padding: "14px" }}>
                    <img
                      src="/deletes.png"
                      width={32}
                      alt="Delete"
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteStaff(doc.id, doc.staffName)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="container mt-5"></div>
    </>
  );
};

export default AddStaff;
