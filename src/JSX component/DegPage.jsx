import React, { useState, useEffect } from "react";
import CollegeLogo from "./CollegeLogo";
import { PiStudentBold } from "react-icons/pi";
import { useLocation } from "react-router-dom";
import { SiGoogleclassroom } from "react-icons/si";

const DegPage = () => {
  const location = useLocation();
  const { rs, deg, sem } = location.state;
  const [department, setDepartment] = useState([]);
  const [sems, setSem] = useState();

  const Regulardepartments = [
    "Select Department",
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
    "Select Department",
    "Department of English",
    "Department of Tamil",
    "Department of Hindi",
    "Department of Sanskrit",
    "Department of Biochemistry",
    "Department of Microbiology",
    "Department of Commerce",
    "Department of Computer Science",
    "Department of Information Technology",
    "Department of Computer Applications",
    "Department of Mathematics With Computer Application",
    "Department of Physics",
  ];
  const SelfPGdepartments = [
    "Select Department",
    "Department of Management Studies (M.B.A.)",
    "Department of Computer Application (M.C.A.)",
  ];
  const RegularPGdepartments = ["Select Department", "M.Com"];

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
        setSem("I Year");
      } else if (sem == 3 || sem == 4) {
        setSem("II Year");
      } else if (sem == 5 || sem == 6) {
        setSem("III Year");
      } else {
        setSem("Invalid");
      }
    };
    semester();
  }, [rs, deg, sem]);

  return (
    <>
      <CollegeLogo />
      <div className="container py-4 bg-primary mt-3"></div>
      <div className="container mt-5">
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-5">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <PiStudentBold />
              </span>
              <select className="form-select">
                {department.map((dep, index) => (
                  <option value={dep.trim()} key={index}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <SiGoogleclassroom />
              </span>
              <select className="form-select">
                <option value="">-- Select Class --</option>
                <option value="A">Class A</option>
                <option value="B">Class B</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <PiStudentBold />
              </span>
              <select className="form-select">
                <option value={sems}>{sems}</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <PiStudentBold />
              </span>
              <select className="form-select">
                <option value="">--Select Subject</option>
                <option value="">Tamil</option>
                <option value="">English</option>
                <option value="">Web Technology</option>
                <option value="">Web Design Lab</option>
                <option value="">Data Mining</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DegPage;
