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

import toast from "react-hot-toast";

import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import { HashLoader } from "react-spinners";

const StaffDetails = () => {
  const nav = useNavigate();
  const [hodData, setHOD] = useState("");
  const [staffData, setStaffData] = useState([]);
  const [PageLoad, setPageLoad] = useState(true);
  let { Department, HODName, DepartmentCode } = hodData;

  const fetchData = () => {
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    setHOD(HODdata);
  };

  const getDataFromAllstaffs = async () => {
    try {
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
      setPageLoad(false);
    } catch (e) {
      setPageLoad(false);
      toast.error("No data");
    }
  };

  const DeletStaffAlert = (id, stName) => {
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
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteStaff(id, stName);
      }
    });
  };

  const DeleteStaff = async (staffid, stName) => {
    await deleteDoc(doc(db, "Allstaffs", staffid));
    toast.success(`${stName} has been permanently removed.`);
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

  // Load HOD data initially
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (DepartmentCode) {
      getDataFromAllstaffs();
      setPageLoad(true);
    }
  }, [DepartmentCode]);

  if (PageLoad) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "75vh" }}
      >
        <HashLoader color="#1e90ff" size={75} />
      </div>
    );
  }

  // Main content
  return (
    <>
      <div
        style={{ background: "#d5181c", overflowX: "hidden" }}
        className="container-fluid d-md-none bg-gradient text-light sticky-top p-1 "
      >
        <div className="row ">
          <div className="col-2 text-sm-end">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/HODLayout");
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
                nav("/HODLayout");
              }}
            >
              <img
                src="/left-chevron.png"
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

      <div className="container mt-4">
        <div className="d-flex flex-column align-items-center mb-4">
          <h3
            style={{ color: "#000" }}
            className="text-center text-uppercase fw-semibold"
          >
            {" "}
            HOD Staff Assigned to Subjects{" "}
          </h3>
        </div>
      </div>

      <div className="container py-4">
        <div className="row gy-3">
          <div className="col-md-3 col-sm-6 d-flex justify-content-center">
            <button
              className=" btnlist w-100 text-uppercase d-flex align-items-center justify-content-center  py-2"
              onClick={AddStfun}
            >
              <img
                src="/addstaff.png"
                alt=""
                className="img img-fluid me-3"
                style={{ width: "30px" }}
              />
              <span className="fw-semibold">Add Staff</span>
            </button>
          </div>
          {/* Students */}
          <div className="col-md-3 col-sm-6 d-flex justify-content-center">
            <button
              className=" btnlist w-100 text-uppercase d-flex align-items-center justify-content-center  py-2"
              onClick={() => {
                nav("/HODLayout/StudentList");
              }}
            >
              <img
                src="/check-list.png"
                alt=""
                className="img img-fluid me-3"
                width={30}
              />
              <span className="fw-semibold"> Students</span>
            </button>
          </div>
          {/* Multiple Students */}
          <div className="col-md-3 col-sm-6 d-flex justify-content-center">
            <button
              className=" btnlist w-100 text-uppercase d-flex align-items-center justify-content-center  py-2"
              onClick={() => {
                nav("/HODLayout/StudentCSV");
              }}
            >
              <img
                src="/college.png"
                alt=""
                className="img img-fluid me-3"
                width={30}
              />
              <span className="fw-semibold">Multiple Students</span>
            </button>
          </div>
          {/* Single Student */}
          <div className="col-md-3 col-sm-6 d-flex justify-content-center">
            <button
              className=" btnlist w-100 text-uppercase d-flex align-items-center justify-content-center gap-2 py-2"
              onClick={() => {
                nav("/HODLayout/SingleStudentdata");
              }}
            >
              <img
                src="/student.png"
                alt=""
                className="img img-fluid me-2"
                width={30}
              />
              <span className="fw-semibold">single Student</span>
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive mt-4 mb-5 shadow-sm container rounded">
        <table className="table table-light  table-hover table-striped table-bordered mb-5">
          <thead className=" text-uppercase  text-center">
            <tr>
              <th>S.No</th>
              <th>Staff Name</th>
              <th>Subject</th>
              <th>Edit Staff</th>
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
                    <div className="d-flex justify-content-center ">
                      <button
                        style={{ color: "rgb(29, 51, 208)" }}
                        className="btn btn-sm border-0 text-uppercase"
                        onClick={() => fetchSubject(value)}
                      >
                        Subject
                      </button>
                    </div>
                  </td>
                  <td className="">
                    <button
                      className="btn  border-0"
                      onClick={() => fetchEdit(value)}
                      title="Edit Staff"
                    >
                      <img
                        src="/noteEdit.png"
                        alt=""
                        className="img img-fluid"
                        width={30}
                      />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn border-0"
                      onClick={() => DeletStaffAlert(value.id, value.staffName)}
                      title="Delete Staff"
                    >
                      <img
                        src="/deletes.png"
                        alt=""
                        className="img img-fluid"
                        width={30}
                      />
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

      {/* </div> */}
    </>
  );
};

export default StaffDetails;
