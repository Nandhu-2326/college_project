import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Database";
import {
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { CiEdit } from "react-icons/ci";
import { FcDeleteDatabase } from "react-icons/fc";
import toast from "react-hot-toast";
import { IoPersonAdd } from "react-icons/io5";
import { FaUsersGear } from "react-icons/fa6";

const StaffDetails = () => {
  const nav = useNavigate();
  const [hodData, setHOD] = useState("");
  const [staffData, setStaffData] = useState([]);
  let { Department, HODName, DepartmentCode } = hodData;

  const fetchData = () => {
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    setHOD(HODdata);
  };

  const getDataFromAllstaffs = async () => {
    if (!DepartmentCode) return;
    const q = query(
      collection(db, "Allstaffs"),
      where("DepartmentCode", "==", DepartmentCode)
    );
    const querySnapshot = await getDocs(q);
    const filteredStaff = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStaffData(filteredStaff);
  };

  const DeleteStaff = async (staffid) => {
    await deleteDoc(doc(db, "Allstaffs", staffid));
    toast.success("Staff Deleted");
    getDataFromAllstaffs();
  };

  const BrowerStorage = (value) => {
    sessionStorage.setItem("staff", JSON.stringify(value));
  };

  const fetchSubject = (value) => {
    BrowerStorage(value);
    nav("/HODLayout/SubjectAlert");
  };

  const fetchEdit = (value) => {
    BrowerStorage(value);
    sessionStorage.setItem("state", JSON.stringify(true));
    nav("/HODLayout/AddStaff");
  };

  const AddStfun = () => {
    sessionStorage.setItem("state", JSON.stringify(false));
    nav("/HODLayout/AddStaff");
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
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center p-3">
        <p className="fw-semibold mb-0"> HOD : {HODName}</p>
        <p className="fw-semibold mb-0">Department : {Department?.slice(14)}</p>
      </div>

      <div className="container mt-4">
        <div className="d-flex flex-column align-items-center mb-2">
          <h1 className="h3 text-uppercase text-primary fw-semibold mb-1">
            View Staff
          </h1>
          <h6 className="text-uppercase text-primary fw-semibold mb-0">
            with Alert Subject
          </h6>
        </div>

        <div className="container py-4">
          <div className="row gy-3">
            {/* Add Staff */}
            <div className="col-md-3 col-sm-6 d-flex justify-content-center">
              <button
                className="btn btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={AddStfun}
              >
                <IoPersonAdd />
                Add Staff
              </button>
            </div>

            {/* Students */}
            <div className="col-md-3 col-sm-6 d-flex justify-content-center">
              <button className="btn btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center gap-2 py-2">
                <FaUsersGear />
                Students
              </button>
            </div>

            {/* Multiple Students */}
            <div className="col-md-3 col-sm-6 d-flex justify-content-center">
              <button
                className="btn btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={() => {
                  nav("/HODLayout/StudentCSV");
                }}
              >
                <FaUsersGear />
                Multiple Students
              </button>
            </div>

            {/* Single Student */}
            <div className="col-md-3 col-sm-6 d-flex justify-content-center">
              <button
                className="btn btn-primary w-100 text-uppercase d-flex align-items-center justify-content-center gap-2 py-2"
                onClick={() => {
                  nav("/HODLayout/SingleStudentdata");
                }}
              >
                <IoPersonAdd />
                Single Student
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive mt-4 mb-5 shadow-sm container rounded">
          <table className="table table-striped table-bordered mb-5">
            <thead className="table-primary text-uppercase text-center">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody className="text-center align-middle">
              {staffData.length > 0 ? (
                staffData.map((value, index) => (
                  <tr key={value.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{value.staffName}</td>
                    <td>
                      <button
                        className="btn btn-outline-success text-uppercase"
                        onClick={() => fetchSubject(value)}
                      >
                        Subject
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => fetchEdit(value)}
                        title="Edit Staff"
                      >
                        <CiEdit size={20} />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => DeleteStaff(value.id)}
                        title="Delete Staff"
                      >
                        <FcDeleteDatabase size={22} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="py-4 text-danger fw-bold text-uppercase">
                      No staff records found.
                    </div>
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
