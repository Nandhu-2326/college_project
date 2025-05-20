import { useEffect, useState } from "react";
import CollegeLogo from "./CollegeLogo";
import { CiLogout } from "react-icons/ci";
import { PiStudentBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserSelect = () => {
  let nav = useNavigate();
  // state
  const [selectRs, setSelectRs] = useState();
  const [selectDeg, setSelectDeg] = useState();
  const [selectSem, setSelectSem] = useState();

  const InformationError = () => {
    Swal.fire({
      html: "Please Fill Information",
      timer: 1000,
      icon: "warning",
      showConfirmButton: false,
    });
  };

  // function's
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
      <div className="container my-4">
        <div className="d-flex justify-content-end bg-primary p-3 rounded shadow-sm">
          <button
            onClick={() => nav("/")}
            className="btn btn-outline-light d-flex align-items-center gap-2 fw-semibold"
          >
            Logout <CiLogout size={20} />
          </button>
        </div>
        <div className="text-center mt-5 mb-4">
          <h2 className="fw-bold text-primary">Select Student Details</h2>
          <p className="text-muted">
            Please choose all the required fields below
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Regular/Self */}
          <div className="col-12 col-md-5">
            <label htmlFor="" className="fw-semibold">
              UG or PG
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <PiStudentBold />
              </span>

              <select
                className="form-select"
                onChange={(e) => setSelectDeg(e.target.value)}
              >
                <option value="">-- Select UG or PG --</option>
                <option value="ug">UG</option>
                <option value="pg">PG</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <label htmlFor="" className="fw-semibold">
              Regular or Self
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                RS
              </span>

              <select
                className="form-select"
                onChange={(e) => setSelectRs(e.target.value)}
              >
                <option value="">-- Select Regular or Self --</option>
                <option value="regular">Regular</option>
                <option value="self">Self</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <label htmlFor="" className="fw-semibold">
              Semester
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                Sem
              </span>
              <select
                className="form-select"
                onChange={(e) => setSelectSem(e.target.value)}
              >
                <option value="">--Select Semester--</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary mt-5 " onClick={next}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default UserSelect;
