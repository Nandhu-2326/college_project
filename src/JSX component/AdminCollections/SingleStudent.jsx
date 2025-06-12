import { FaUsers, FaUser, FaUserGraduate } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { FcDepartment } from "react-icons/fc";
import { TbNumber } from "react-icons/tb";
import { useState } from "react";
import { db } from "../Database.js";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const SingleStudent = () => {
  const [rollno, setRollno] = useState();
  const [ugorpg, setUgorpg] = useState();
  const [section, setSection] = useState();
  const [Departments, setDepartment] = useState();
  const [Year, setYear] = useState();
  const [rs, setRs] = useState();
  const [Name, setName] = useState();

  const loading = () => {
    Swal.fire({
      html: "Loading...",
      timer: 2000,
      timerProgressBar: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  const InformationError = () => {
    Swal.fire({
      html: "Please Fill All Information",
      icon: "error",
      timer: 1000,
      didOpen: () => Swal.showLoading(),
    });
  };

  const success = () => {
    Swal.fire({
      html: "Success",
      icon: "success",
      timer: 1000,
    });
  };

  const Add = async () => {
    if (
      !rollno &&
      !ugorpg &&
      !section &&
      !Departments &&
      !Year &&
      !rs &&
      !Name
    ) {
      InformationError();
    } else {
      loading();
      await addDoc(collection(db, "student"), {
        Department: Departments,
        Name: Name,
        class: section,
        rollno: rollno,
        rs: rs,
        ugorpg: ugorpg,
        year: Year,
      });
      success();
      setRollno(null)
      setDepartment(null)
      setName(null)
      setRs(null)
      setSection(null)
      setUgorpg(null)
      setYear(null)
    }
  };
  
  return (
    <div className="container py-5 mb-5">
      <div className="bg-light ">
        <h4 className="text-primary mb-4 text-center fw-bold">
          🎓 Student Information Form
        </h4>

        <div className="row g-4">
          {/* UG / PG */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">UG / PG</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaUserGraduate />
              </span>
              <select
                className="form-select"
                onChange={(e) => {
                  setUgorpg(e.target.value);
                }}
              >
                <option>-- Select UG or PG --</option>
                <option value="ug">UG (Undergraduate)</option>
                <option value="pg">PG (Postgraduate)</option>
              </select>
            </div>
          </div>

          {/* Class */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Class</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <SiGoogleclassroom />
              </span>
              <select
                className="form-select"
                onChange={(e) => {
                  setSection(e.target.value);
                }}
              >
                <option>-- Select Class --</option>
                <option value="A">Class A</option>
                <option value="B">Class B</option>
              </select>
            </div>
          </div>

          {/* Department */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Department</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FcDepartment />
              </span>
              <select
                className="form-select"
                onChange={(e) => {
                  setDepartment(e.target.value);
                }}
              >
                <option>-- Select Department --</option>
                <option value="Department of IOT">Department of IOT</option>
              </select>
            </div>
          </div>

          {/* Year */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Year</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaUsers />
              </span>
              <select
                className="form-select"
                onChange={(e) => {
                  setYear(e.target.value);
                }}
              >
                <option>-- Select Year --</option>
                <option value="1">I Year</option>
                <option value="2">II Year</option>
                <option value="3">III Year</option>
              </select>
            </div>
          </div>

          {/* Self or Regular */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Self / Regular</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white fw-bold">
                RS
              </span>
              <select
                className="form-select"
                onChange={(e) => {
                  setRs(e.target.value);
                }}
              >
                <option>-- Select Self or Regular --</option>
                <option value="self">Self (SF)</option>
                <option value="regular">Regular</option>
              </select>
            </div>
          </div>

          {/* Student Name */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Student Name</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaUser />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Student Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Roll Number */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Roll Number</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <TbNumber />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Roll Number"
                onChange={(e) => {
                  setRollno(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center mt-4">
            <button
              className="btn btn-primary  px-5 shadow-sm rounded"
              onClick={Add}
            >
              Add Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleStudent;
