import React, { useState, useEffect } from "react";
import CollegeLogo from "./CollegeLogo";
import { useLocation, useNavigate } from "react-router-dom";
import { SiGoogleclassroom } from "react-icons/si";
import { IoSchoolSharp } from "react-icons/io5";
import { LiaSchoolSolid } from "react-icons/lia";
import { FaSchool } from "react-icons/fa";
import Swal from "sweetalert2";
import Footer from "./Footer";
import { db } from "./Database.js"; // Make sure this is your Firebase config
import { collection, getDocs } from "firebase/firestore";

const DegPage = () => {
  const nav = useNavigate();
  const location = useLocation();
  const { rs, deg, sem } = location.state;
  const [department, setDepartment] = useState([]);
  const [sems, setSem] = useState();
  const [section, setSection] = useState();
  const [subject, setSubject] = useState([]);
  const [dep, setDep] = useState();
  const [selectedSubject, setSelectedSubject] = useState();

  useEffect(() => {
    const all = async () => {
      let depDegree = "";

      try {
        if (rs === "self" && deg === "ug") {
          depDegree = "SelfUG";
        } else if (rs === "regular" && deg === "ug") {
          depDegree = "RegularUG";
        } else if (rs === "self" && deg === "pg") {
          depDegree = "SelfPG";
        } else if (rs === "regular" && deg === "pg") {
          depDegree = "RegularPG";
        } else {
          setDepartment([]);
          return;
        }

        const getDeps = await getDocs(collection(db, "Departments"));
        const Datas = getDeps.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const findData = Datas.find((item) => item.id === depDegree);
        if (findData) {
          const departmentNames = Object.keys(findData).filter(
            (key) => key !== "id"
          );
          setDepartment(departmentNames);
        } else {
          setDepartment([]);
        }

        const subgetDeps = await getDocs(collection(db, "Subject"));
        const subDatas = subgetDeps.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const subfindData = subDatas.find((item) => item.id === depDegree);
        if (subfindData) {
          const SubjectNames = Object.keys(subfindData).filter(
            (key) => key !== "id"
          );
          setSubject(SubjectNames);
        } else {
          setSubject([]);
        }
      } catch (e) {
        alert("Error fetching departments: " + e.message);
      }
    };

    all();
  }, [rs, deg]);

  useEffect(() => {
    if (sem == 1 || sem == 2) {
      setSem(1);
    } else if (sem == 3 || sem == 4) {
      setSem(2);
    } else if (sem == 5 || sem == 6) {
      setSem(3);
    } else {
      setSem("Invalid");
    }
  }, [sem]);

  const InformationError = () => {
    Swal.fire({
      html: "Please Fill Information",
      timer: 1000,
      icon: "warning",
      showConfirmButton: false,
    });
  };

  function SubmitPage() {
    if (!dep || !section || !selectedSubject || !sems) {
      InformationError();
    } else {
      nav("/CalculatorPage", {
        state: {
          dep: dep,
          sec: section,
          sub: selectedSubject,
          sem: sems,
          deg: deg,
        },
      });
    }
  }

  return (
    <>
      <CollegeLogo />
      <Footer />
      <div className="container mt-5">
        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-5">
            <label htmlFor="" className="fw-semibold">
              Department
            </label>
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
                <option value="">-- Select Department --</option>
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
              <select className="form-select" disabled>
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
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">-- Select Subject --</option>
                {subject.map((subs, index) => (
                  <option value={subs} key={index}>
                    {subs}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-center mb-5">
            <button className="btn btn-primary px-5 mb-5" onClick={SubmitPage}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DegPage;
