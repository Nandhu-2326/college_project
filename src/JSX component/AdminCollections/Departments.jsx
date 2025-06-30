import React, { useEffect, useState } from "react";
import { db } from "../Database.js";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import "../Style Component/Admin.css";

const Departments = () => {
  const field = ["RegularUG", "RegularPG", "SelfPG", "SelfUG"];
  const [rs, setRs] = useState("");
  const [deps, setDeps] = useState("");

  useEffect(() => {
    const getDep = async () => {
      const getDeps = await getDocs(collection(db, "Departments"));
      const Datas = getDeps.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    };
    getDep();
  }, []);

  const addDep = async () => {
    if (!rs || !deps) {
      toast.error("Please Fill All Requirement");
    } else {
      try {
        toast.loading("Please Wait");
        await setDoc(
          doc(db, "Departments", rs),
          {
            [deps]: deps, // Add new department field
          },
          { merge: true } // Merge with existing fields
        );
        toast.dismiss();
        toast.success("Department Uploaded");
        setDeps(""); // Clear input
      } catch (error) {
        toast.dismiss();
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="container">
      <div className="row  d-flex justify-content-center align-items-center flex-column">
        <div className="col-12 col-sm-5">
          <div className="card cards ">
            <div className="card-header fw-semibold ">Upload Department</div>
            <div className="card-body text-start">
              <div>
                <label className="">Select Degree</label>
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
              <div className="mt-3">
                <label className="mb-3">Enter Department Name</label>
                <input
                  type="text"
                  value={deps}
                  placeholder="Enter Department"
                  className="form-control"
                  onChange={(e) => setDeps(e.target.value)}
                />
              </div>
            </div>
            <div className="card-footer">
              <button
                className="submit px-5 mt-3 py-2 border-0 rounded"
                onClick={addDep}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Departments;
