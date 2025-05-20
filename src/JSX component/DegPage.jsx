import React, { useState, useEffect } from "react";
import CollegeLogo from "./CollegeLogo";
import { useLocation, useNavigate } from "react-router-dom";
import { SiGoogleclassroom } from "react-icons/si";
import { IoSchoolSharp } from "react-icons/io5";
import { LiaSchoolSolid } from "react-icons/lia";
import { FaSchool } from "react-icons/fa";
import Swal from "sweetalert2";
import CalculatorPage from "./CalculatorPage";

const DegPage = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { rs, deg, sem } = location.state;
  const [department, setDepartment] = useState([]);
  const [sems, setSem] = useState();
  const [section, setSection] = useState();
  const [subject, setSubject] = useState();
  const [dep, setDep] = useState();

  const Regulardepartments = [
    "Department of English",
    "Department of Tamil",
    "Department of Hindi",
    "Department of Sanskrit",
    "Department of Commerce and Research Centre",
    "Department of Business Administration",
    "Department of Economics",
    "Department of Mathematics",
    "Department of Physics",
    "Department of Chemistry",
    "Department of Botany",
    "Department of Corporate Secretaryship",
    "Department of Computer Science",
    "Department of Library",
    "Department of Physical Education",
  ];
  const Selfdepartments = [
    "Department of English (SF)",
    "Department of Tamil (SF)",
    "Department of Hindi (SF)",
    "Department of Sanskrit (SF)",
    "Department of Biochemistry (SF)",
    "Department of Microbiology (SF)",
    "Department of Commerce (SF)",
    "Department of Computer Science (SF)",
    "Department of Information Technology (SF)",
    "Department of Computer Applications (SF)",
    "Department of Mathematics With Computer Application (SF)",
    "Department of Physics (SF)",
  ];

  const SelfPGdepartments = [
    "Department of Management Studies (M.B.A.) (SF)",
    "Department of Computer Application (M.C.A.) (SF)",
  ];

  const RegularPGdepartments = ["M.Com"];

  useEffect(() => {
    const all = () => {
      if (rs === "self" && deg === "ug") {
        setDepartment(Selfdepartments);
      } else if (rs === "regular" && deg === "ug") {
        setDepartment(Regulardepartments);
      } else if (rs === "self" && deg === "pg") {
        setDepartment(SelfPGdepartments);
      } else if (rs === "regular" && deg === "pg") {
        setDepartment(RegularPGdepartments);
      } else {
        setDepartment([]);
      }
    };

    all();
    const semester = () => {
      if (sem == 1 || sem == 2) {
        setSem(1);
      } else if (sem == 3 || sem == 4) {
        setSem(2);
      } else if (sem == 5 || sem == 6) {
        setSem(3);
      } else {
        setSem("Invalid");
      }
    };
    semester();
  }, [rs, deg, sem]);

  const InformationError = () => {
    Swal.fire({
      html: "Please Fill Information",
      timer: 1000,
      icon: "warning",
      showConfirmButton: false,
    });
  };

  function SubmitPage() {
    if (!department || !section || !subject || !sems) {
      InformationError();
    } else {
      nav("/CalculatorPage", {
        state: {
          dep: dep,
          sec: section,
          sub: subject,
          sem: sems,
          deg: deg,
        },
      });
    }
  }

  return (
    <>
      <CollegeLogo />
      <div className="container py-4 bg-primary mt-3"></div>
      <div className="container mt-5">
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-5">
            <lable htmlFor="" className="fw-semibold">Department</lable>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <FaSchool />
              </span>
              <select
                className="form-select"
                onChange={(e) => {
                  setDep(e.target.value);
                }}
              >
                {department.map((dep, index) => (
                  <option value={dep.trim()} key={index}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <label htmlFor="" className="fw-semibold">
              Class
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <SiGoogleclassroom />
              </span>
              <select
                className="form-select"
                onChange={(e) => {
                  setSection(e.target.value);
                }}
              >
                <option value="">-- Select Class --</option>
                <option value="A">Class A</option>
                <option value="B">Class B</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <label htmlFor="" className="fw-semibold">
              Year
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <IoSchoolSharp />
              </span>
              <select className="form-select">
                <option value={sems}>{sems}</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <label htmlFor="" className="fw-semibold">
              Subject
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <LiaSchoolSolid />
              </span>
              <select
                className="form-select"
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">--Select Subject</option>
                <option value="Tamil">Tamil</option>
                <option value="English">English</option>
                <option value="Web Technology">Web Technology</option>
                <option value="Web Design Lab">Web Design Lab</option>
                <option value="Data Mining">Data Mining</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-center mb-5">
            <button className="btn btn-primary px-5" onClick={SubmitPage}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DegPage;
