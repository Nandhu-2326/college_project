import React, { useEffect, useState } from "react";
import { db } from "../Database.js"; // Make sure this is your Firebase config
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";


const Departments = () => {
  const field = ["RegularUG", "RegularPG", "SelfPG", "SelfUG"];
  const [rs, setRs] = useState(""); // Selected category
  const [sub, setSub] = useState(""); // Department name input
  const [subcode, setSubcode] = useState("");

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



  const addDep = async () => {
    if (!rs || !sub || !subcode) {
      toast.error("Please Fill All Requirement");

    } else {
      try {
        toast.loading("Please Wait");
        await setDoc(
          doc(db, "Subject", rs),
          {
            [sub]: `${subcode} - ${sub}`,
          },
          { merge: true }
        );
        toast.dismiss();
        toast.success("Subject Uploaded");
        setSub("");
        setSubcode("");
      } catch (error) {
        toast.dismiss();
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center d-flex">
        <div className="col-12 col-sm-8 col-md-6 col-lg-5">
          <div className="card  subjectCard">
            {/* Header */}
            <div className="card-header text-center fw-semibold">
              Upload Subject
            </div>

            {/* Body */}
            <div className="card-body text-start">
              {/* Select Degree */}
              <div className="mb-3">
                <label className="form-label">Select Degree</label>
                <select
                  className="form-select"
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

              {/* Subject Name */}
              <div className="mb-3">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  value={sub}
                  placeholder="Enter Subject Name"
                  className="form-control"
                  onChange={(e) => setSub(e.target.value)}
                />
              </div>

              {/* Subject Code */}
              <div className="mb-3">
                <label className="form-label">Subject Code</label>
                <input
                  type="text"
                  value={subcode}
                  placeholder="Enter Subject Code"
                  className="form-control"
                  onChange={(e) => setSubcode(e.target.value)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="card-footer text-center">
              <button
                className="px-4 py-2 submit border-0 rounded"
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
