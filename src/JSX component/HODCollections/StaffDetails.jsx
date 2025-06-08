import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Database";
import { getDocs, collection } from "firebase/firestore";
import { CiEdit } from "react-icons/ci";
import { FcDeleteDatabase } from "react-icons/fc";

const StaffDetails = () => {
  const nav = useNavigate();
  const [hodData, setHOD] = useState("");
  const [staffData, setStaffData] = useState([]);
  let { Department, HODName, ugorpg, rs, DepartmentCode } = hodData;
  console.log(HODName);

  const fetchData = () => {
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    console.log(HODdata);
    setHOD(HODdata);
  };

  const getDataFromAllstaffs = async () => {
    const staffDoc = await getDocs(collection(db, "Allstaffs"));
    const getStaffDoc = staffDoc.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const filterData = getStaffDoc.filter((value) => {
      return value.DepartmentCode == DepartmentCode;
    });
    setStaffData(filterData);
  };

  const fetchSubject = (value) => {
    sessionStorage.setItem("staff", JSON.stringify(value));
    nav("/HODLayout/SubjectAlert");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (DepartmentCode) {
      getDataFromAllstaffs();
    }
  }, [DepartmentCode]);

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center ">
        <p className="fw-semibold"> HOD : {HODName}</p>
        <p className="fw-semibold">Department : {Department?.slice(14)}</p>
      </div>

      <div className="container ">
        <h1
          className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px" }}
        >
          view staff
        </h1>
        <h6
          className="h6 text-uppercase  text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px" }}
        >
          with
        </h6>
        <h4
          className="h4 text-uppercase mt-1 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px" }}
        >
          alert subject
        </h4>
      </div>

      <div className="container d-flex mt-3  justify-content-end align-items-center">
        <button
          className="btn btn-primary me-3 text-uppercase bg-gradient"
          onClick={() => {
            nav("/HODLayout/AddStaff");
          }}
        >
          Add staff
        </button>
      </div>

      <div className="container mt-4 d-flex mb-5 justify-content-center ">
        <div className="table-responsive mb-5">
          <table className="table table-secondary">
            <thead className="text-uppercase ">
              <tr>
                <th>s.no</th>
                <th>name</th>
                <th>subject</th>
                <th>edit</th>
                <th>delete</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {staffData.length > 0 ? (
                staffData.map((value, index) => {
                  return (
                    <tr key={value.id}>
                      <td>{index + 1}</td>
                      <td>{value.staffName}</td>
                      <td>
                        <button
                          className="btn btn-outline-success text-uppercase"
                          onClick={() => {
                            fetchSubject(value);
                          }}
                        >
                          subject
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-outline-dark">
                          <CiEdit />
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-dark">
                          <FcDeleteDatabase />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="bg-danger opacity-50">
                  <td colSpan={5}>
                    <p className="p text-center fw-bold text-uppercase">
                      no staff's
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StaffDetails;
