import React, { useEffect, useState } from "react";
import { db } from "./Database.js"; // Make sure this is your Firebase config
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";

const Departments = () => {
  const field = ["RegularUG", "RegularPG", "SelfPG", "SelfUG"];
  const [rs, setRs] = useState(""); // Selected category
  const [sub, setSub] = useState(""); // Department name input

  useEffect(() => {
    const getDep = async () => {
      const getDeps = await getDocs(collection(db, "Subject"));
      const Datas = getDeps.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    };
    getDep();
  }, []);

  const showError = () => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Please Fill Information",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  const showSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Subject Added!",
      showConfirmButton: false,
      timer: 1000,
    });
  };

  const addDep = async () => {
    if (!rs || !sub) {
      showError();
    } else {
      try {
        await setDoc(
          doc(db, "Subject", rs),
          {
            [sub]: sub,
          },
          { merge: true }
        );
        showSuccess();
        setSub("");
      } catch (error) {
        console.error("Error adding department:", error.message);
      }
    }
  };

  return (
    <div className="container mt-5 mb-3">
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
          <label className="fw-bold text-primary">Enter Subject Name</label>
          <input
            type="text"
            value={sub}
            placeholder="Enter Subject Name"
            className="form-control"
            onChange={(e) => setSub(e.target.value)}
          />
        </div>

        <div className="col-12 col-sm-4 text-center">
          <button className="btn btn-primary px-5 mt-3" onClick={addDep}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Departments;
