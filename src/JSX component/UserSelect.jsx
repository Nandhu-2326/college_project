import { useState } from "react";
import Footer from "./Footer";
import CollegeLogo from "./CollegeLogo";

import { PiStudentBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserSelect = () => {
  const nav = useNavigate();

  // state for selections
  const [selectRs, setSelectRs] = useState("");
  const [selectDeg, setSelectDeg] = useState("");
  const [selectSem, setSelectSem] = useState("");

  // static list of semesters
  const semesterList = ["1", "2", "3", "4", "5", "6"];

  const InformationError = () => {
    Swal.fire({
      html: "Please Fill Information",
      timer: 1000,
      icon: "warning",
      showConfirmButton: false,
    });
  };

  const next = () => {
    if (!selectDeg || !selectRs || !selectSem) {
      InformationError();
    } else {
      nav("/DegPage", {
        state: {
          rs: selectRs,
          deg: selectDeg,
          sem: selectSem,
        },
      });
    }
  };

  return (
    <>
      <CollegeLogo />
      <div className="container mb-5">
        <div className="text-center mt-5 mb-4">
          <h2 className="fw-bold text-primary">Select Student Details</h2>
          <p className="text-muted">Please choose all the required fields below</p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* UG or PG */}
          <div className="col-12 col-md-5">
            <label className="fw-semibold">UG or PG</label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <PiStudentBold />
              </span>
              <select
                className="form-select"
                value={selectDeg}
                onChange={(e) => setSelectDeg(e.target.value)}
              >
                <option value="">-- Select UG or PG --</option>
                <option value="ug">UG</option>
                <option value="pg">PG</option>
              </select>
            </div>
          </div>

          {/* Regular or Self */}
          <div className="col-12 col-md-5">
            <label className="fw-semibold">Regular or Self</label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">RS</span>
              <select
                className="form-select"
                value={selectRs}
                onChange={(e) => setSelectRs(e.target.value)}
              >
                <option value="">-- Select Regular or Self --</option>
                <option value="regular">Regular</option>
                <option value="self">Self</option>
              </select>
            </div>
          </div>

          {/* Semester */}
          <div className="col-12 col-md-5">
            <label className="fw-semibold">Semester</label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">Sem</span>
              <select
                className="form-select"
                value={selectSem}
                onChange={(e) => setSelectSem(e.target.value)}
              >
                <option value="">--Select Semester--</option>
                {semesterList.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button className="btn btn-primary mt-5 mb-5" onClick={next}>
            Submit
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserSelect;
