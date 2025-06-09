import React, { useEffect, useState } from "react";
import { db } from "../Database";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { FaPenAlt } from "react-icons/fa";

const StaffSubjects = () => {
  const [StaffData, setStaffData] = useState({});
  const [STsubject, setSTsubject] = useState([]);
  const fetchData = () => {
    const data = sessionStorage.getItem("staff_Data");
    const staffdata = JSON.parse(data);
    setStaffData(staffdata);
  };
  const getSTubject = async (id) => {
    const stDoc = doc(db, "Allstaffs", id);
    const stCollection = await getDocs(collection(stDoc, "subject"));
    const stData = stCollection.docs.map((doc) => ({
      ...doc.data(),
    }));
    setSTsubject(stData);
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (StaffData.id) {
      getSTubject(StaffData.id);
    }
  }, [StaffData]);
  return (
    <>
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center p-3">
        <p className="fw-semibold mb-0">
          {" "}
          STAFF : {StaffData?.staffName || ""}
        </p>
        <p className="fw-semibold mb-0">
          D-Code : {StaffData?.DepartmentCode || ""}
        </p>
      </div>

      <div className="container mt-4 p-2">
        <h3
          className="h3 text-uppercase text-center text-primary fw-semibold"
          style={{ letterSpacing: "2px" }}
        >
          {" "}
          Your Subjects{" "}
        </h3>
      </div>
      <div className="table-responsive mt-4 mb-5 shadow-sm container rounded">
        <table className="table table-striped table-bordered mb-5">
          <thead className="table-primary text-uppercase text-center">
            <tr>
              <th>S.No</th>
              <th>Subject</th>
              <th>Department</th>
              <th>Year</th>
              <th>Class & Degree</th>
              <th>Enter Mark</th>
            </tr>
          </thead>

          <tbody className="text-center align-middle">
            {STsubject.length > 0 ? (
              STsubject.map((value, index) => {
                return (
                  <tr key={value.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">
                      <tr className="d-flex flex-column justify-content-around">
                        <td className="text-center">{value.subject} </td>{" "}
                        <td className=" "> {value.TorL}</td>
                      </tr>
                    </td>
                    <td className="fw-semibold">{value.department}</td>
                    <td className="fw-semibold">{value.year}</td>
                    <td className="fw-semibold">
                      <tr className="d-flex justify-content-around">
                        <td>{value.class}</td>
                        <td>{value.ugorpg.toUpperCase()}</td>
                      </tr>
                    </td>
                    <td>
                      <button className="btn btn-outline-success ">
                        <FaPenAlt />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr key={0}>
                <td colSpan={6}>
                  <div className="py-4 text-danger fw-bold text-uppercase">
                    No subject records found.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StaffSubjects;
