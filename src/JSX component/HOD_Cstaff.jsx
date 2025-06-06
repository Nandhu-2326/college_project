import React, { useEffect, useReducer, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { TbPasswordUser } from "react-icons/tb";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";
import { InformationError } from "./SweetAlert";
import { db } from "./Database.js";
import {
  collection,
  getDoc,
  doc,
  addDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";

const HOD_Cstaff = () => {
  const [hodData, setHOD] = useState("");
  const [staffNames, setStaffNames] = useState([]);
  let { Department, HODName, ugorpg, rs, DepartmentCode } = hodData;

  const reducer = (state, action) => {
    return {
      ...state,
      [action.field]: action.value,
    };
  };

  // Initial state - always a good practice!
  const initialState = {
    staffName: "",
    staffUserName: "",
    staffPassword: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const AddData = async () => {
    if (
      !state.staffName.trim() ||
      !state.staffUserName.trim() ||
      !state.staffPassword.trim()
    ) {
      let eror = "Please Fill StaffDetails";
      InformationError(eror);
    } else {
      await addDoc(collection(db, "staffName"), {
        staff_Name: state.staffName,
      });
      const staffData_s = await getDocs(collection(db, "staffName"));
      const staffDocs = staffData_s.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setStaffNames(staffDocs);
      const staffAdd = doc(db, "HOD", DepartmentCode);
      const staffCol = doc(collection(staffAdd, state.staffName));
      await setDoc(staffCol, {
        staffname: state.staffName,
        staffuserName: state.staffUserName,
        staffpassword: state.staffPassword,
      });
      for (let stateClear in initialState) {
        dispatch({ field: stateClear, value: "" });
      }
      alert("Add Staff");
    }
  };

  const fetchData = () => {
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    console.log(HODdata);
    setHOD(HODdata);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center ">
        <p className="fw-semibold"> HOD : {HODName}</p>
        <p className="fw-semibold">Department : {Department?.slice(14)}</p>
      </div>

      <div className="container mb-5">
        <h1
          className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px" }}
        >
          Create New Staff
        </h1>

        <div className="row p-1 ">
          {[1, 2, 3].map((value, index) => (
            <div className=" col-sm-4 " key={index}>
              <div className="input-group mt-4">
                <span className="input-group-text text-light bg-primary bg-gradient">
                  {value === 1 ? (
                    <FaUserCircle />
                  ) : value === 2 ? (
                    <FaClipboardUser />
                  ) : (
                    <TbPasswordUser />
                  )}
                </span>
                <input
                  type="text"
                  className="form-control"
                  name={
                    value === 1
                      ? "staffName"
                      : value === 2
                      ? "staffUserName"
                      : "staffPassword"
                  }
                  value={
                    value === 1
                      ? state.staffName
                      : value === 2
                      ? state.staffUserName
                      : state.staffPassword
                  }
                  onChange={(e) => {
                    dispatch({ field: e.target.name, value: e.target.value });
                  }}
                  placeholder={
                    value === 1
                      ? "Staff Name"
                      : value === 2
                      ? "Staff User Name"
                      : "Staff Password"
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <h1
          className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px" }}
        >
          alert Subject
        </h1>
        <h6
          className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px", fontSize: "12px" }}
        >
          for staff
        </h6>

        <div className="row mb-5">
          {(ugorpg === "ug" ? [1, 2, 3] : [1, 2]).map((value) => (
            <div
              key={value}
              className={
                ugorpg === "ug"
                  ? "col-12 col-sm-4 mt-4"
                  : "col-12 col-sm-6 mt-4"
              }
            >
              <span
                className="fw-bold text-uppercase d-flex justify-content-center"
                style={{ letterSpacing: "5px" }}
              >{`${value} - Year `}</span>
              {[1, 2, 3].map((vals) => (
                <div className="input-group mt-3" key={`s${value}_${vals}`}>
                  <span className="input-group-text text-light bg-primary bg-gradient">
                    {vals === 1 ? (
                      <RiNumber1 />
                    ) : vals === 2 ? (
                      <RiNumber2 />
                    ) : (
                      <RiNumber3 />
                    )}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name={`s${value}_${vals}`}
                    onChange={(e) => {
                      dispatch({
                        field: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    placeholder={`Subject Name ${vals}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="container  d-flex justify-content-center">
          <button
            style={{ letterSpacing: "5px" }}
            className="btn btn-primary fw-semibold mb-5 bg-gradient text-uppercase"
            onClick={AddData}
          >
            save
          </button>
        </div>
      </div>
    </>
  );
};

export default HOD_Cstaff;
