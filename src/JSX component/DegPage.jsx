import React, { useState, useEffect } from "react";
import CollegeLogo from "./CollegeLogo";
import { PiStudentBold } from "react-icons/pi";
import { useLocation } from "react-router-dom";
import { SiGoogleclassroom } from "react-icons/si";

const DegPage = () => {
  const location = useLocation();
  const { rs, deg } = location.state;
  const [department, setDepartment] = useState([]);

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
  }, [rs, deg]);

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
                <option value="">-- Select Year --</option>
                <option value="1">I Year</option>
                <option value="2">II Year</option>
                <option value="3">III Year</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <PiStudentBold />
              </span>
              <select className="form-select"></select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DegPage;
