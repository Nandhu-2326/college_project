import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaUserLock } from "react-icons/fa6";
import { InformationError, UserAdd, showWarning } from "../SweetAlert";
import { db } from "../Database";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { ThreeDot } from "react-loading-indicators";
import toast from "react-hot-toast";

const AddStaff = () => {
  const nav = useNavigate();

  const [hodData, setHOD] = useState("");
  const [StaffData, setStaffData] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [isUpdate, setisUpdate] = useState(false);
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

  let { Department, HODName, ugorpg, rs, DepartmentCode } = hodData;
  let staffid = StaffData.id;

  const fetchData = () => {
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    setHOD(HODdata);

    const StaffDetails = sessionStorage.getItem("staff");
    const StaffDatas = JSON.parse(StaffDetails);
    setStaffData(StaffDatas);

    const States = sessionStorage.getItem("state");
    const boolenState = JSON.parse(States);
    setisUpdate(boolenState);
  };

  const fetchStaffDetails = async (staffId) => {
    const getStaffDetails = doc(db, "Allstaffs", staffId);
    const AfterFetch = await getDoc(getStaffDetails);
    const AllData = AfterFetch.data();
    console.log(AllData);
    if (isUpdate) {
      for (let staffField in initialState) {
        dispatch({ field: staffField, value: AllData[staffField] });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (staffid) {
      fetchStaffDetails(staffid);
    }
  }, [staffid]);

  const AddStaff = async () => {
    if (!state.staffName || !state.UserName || !state.Password) {
      showWarning("Please Fill All requirement")
    } else {
      setisloading(true);
      await addDoc(collection(db, "Allstaffs"), {
        staffName: state.staffName,
        UserName: state.UserName,
        Password: state.Password,
        DepartmentCode: DepartmentCode,
      });
      toast.success("Staff Save")
      setisloading(false);
      nav("/HODLayout/StaffDetails");
    }
  };
  const UpdateStaff = async (staffid) => {
    if (!state.staffName || !state.UserName || !state.Password) {
      showWarning("Please Fill All requirement")
    } else {
      setisloading(true);
      await updateDoc(doc(db, "Allstaffs", staffid), {
        staffName: state.staffName,
        UserName: state.UserName,
        Password: state.Password,
        DepartmentCode: DepartmentCode,
      });
      toast.success("Update Staff Details")
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
              <div
                className="d-flex justify-content-center align-items-center flex-column"
                key={staff}
              >
                <div className="col-12 col-sm-5" key={index}>
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-light">
                      {staff === 1 ? (
                        <FaUser />
                      ) : staff === 2 ? (
                        <FaUser />
                      ) : (
                        <FaUserLock />
                      )}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={
                        staff === 1
                          ? "staffName"
                          : staff === 2
                          ? "UserName"
                          : "Password"
                      }
                      name={
                        staff === 1
                          ? "staffName"
                          : staff === 2
                          ? "UserName"
                          : "Password"
                      }
                      value={
                        staff === 1
                          ? state.staffName
                          : staff === 2
                          ? state.UserName
                          : state.Password
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

          <div className="container d-flex mt-3 justify-content-center align-items-center">
            <button
              className="btn btn-primary me-3 text-uppercase bg-gradient mb-5"
              onClick={isUpdate ? ()=>{UpdateStaff(staffid)} : AddStaff}
            >
              {isloading ? (
                <ThreeDot color="#ffffff" size="medium" text="" textColor="" />
              ) : isUpdate ? (
                "Update"
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
