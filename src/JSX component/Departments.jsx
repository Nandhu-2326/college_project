import React, { useState } from "react";
import { db } from "./Database.js";
import { doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const Departments = () => {
  const field = ["RegularUG", "RegularPG", "SelfPG", "SelfUG"];
  const [rs, setRs] = useState("");
  const [deps, setDeps] = useState("");

  const showError = () => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Please Fill Information",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  const addDep = async () => {
    if (!rs || !deps) {
      showError();
    } else {
      try {
        const docs= doc(db, "Departments", rs)
        await updateDoc(docs,{
            dep: deps
        })
        Swal.fire({
          icon: "success",
          title: "Department Added!",
          showConfirmButton: false,
          timer: 1000,
        });
        setDeps("");
      } catch (error) {
        console.error("Error adding department:", error);
      }
    }
  };

  return (
    <div className="">
      <div className="row g-3 d-flex justify-content-center align-items-center flex-column">
        <div className="col-12 col-sm-4 text-start">
          <label className="fw-bold text-primary">
            Select UG or PG / Regular or Self
          </label>
          <select
            className="form-select mt-3"
            value={rs}
            onChange={(e) => setRs(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {field.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-4 text-start">
          <label className="fw-bold text-primary">Enter Department Name</label>
          <input
            type="text"
            value={deps}
            placeholder="Enter Department"
            className="form-control"
            onChange={(e) => setDeps(e.target.value)}
          />
        </div>
      </div>
      <button className="btn btn-primary px-5 mt-3 mb-5" onClick={addDep}>
        Submit
      </button>
    </div>
  );
};

export default Departments;
