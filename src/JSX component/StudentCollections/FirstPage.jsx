import React, { useState } from "react";

import CollegeLogo from "../CollegeLogo";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import Footer from "../Footer";
import { RiFileList3Line } from "react-icons/ri";
import { db } from "../Database";
import { collection, getDocs, query, where } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import "../Style Component/firstpage.css";
import { useNavigate } from "react-router-dom";

const FirstPage = () => {
  const [dob, setDob] = useState("");
  const [rollno, setRollno] = useState("");
  const [sem, setSem] = useState("");

  const nav = useNavigate();

  const getResult = async () => {
    if (!rollno || !dob || !sem) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const loading = toast.loading("Please Wait");
      const rollQuery = query(
        collection(db, "student"),
        where("rollno", "==", rollno.trim().toUpperCase())
      );
      const rollSnap = await getDocs(rollQuery);

      if (rollSnap.empty) {
        toast.dismiss(loading);
        toast.error("Roll number not found");
        return;
      }

      const studentDoc = rollSnap.docs[0];
      const studentData = studentDoc.data();
      const formatDOB = (inputDate) => {
        const [year, month, day] = inputDate.split("-");
        return `${day}-${month}-${year}`;
      };

      const formattedDob = formatDOB(dob);

      if (studentData.dob !== formattedDob) {
        toast.dismiss(loading);
        toast.error("Date of Birth does not match");
        return;
      }

      const markRef = collection(db, "student", studentDoc.id, sem);
      const markSnap = await getDocs(markRef);

      if (!markSnap.empty) {
        const markData = markSnap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        sessionStorage.setItem("student", JSON.stringify(studentData));
        sessionStorage.setItem("Marks", JSON.stringify(markData));
        sessionStorage.setItem("sem", JSON.stringify(sem));
        toast.dismiss(loading);
        toast.success("Result");
        nav("/SecondPage");
      } else {
        toast.dismiss();
        toast.error("This semester has no result");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <CollegeLogo />
      <div className="container-fluid  min-vh-100" style={{ width: "90%" }}>
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-5 col-lg-4">
            <div className="card shadow rounded-4 border-0">
              <div className="card-header bg-white border-0 text-center">
                <h2
                  className="fw-bold text-uppercase"
                  style={{ color: "rgb(29,51,208)" }}
                >
                  View Result
                </h2>
                <p
                  className="text-secondary fw-semibold fs-6 text-uppercase mb-0"
                  style={{ letterSpacing: "2px" }}
                >
                  Enter your Roll No and DOB to view marks
                </p>
              </div>
              <div className="card-body">
                <div className="d-flex flex-column gap-4">
                  {/* Roll No */}
                  <label htmlFor="" className="label">
                    Roll Number
                  </label>
                  <div className="input-group">
                    <span className="input-group-text icons">
                      <img
                        src="/student.png"
                        width={20}
                        alt=""
                        className="img img-fluid"
                      />
                    </span>
                    <input
                      type="text"
                      className="form-control "
                      placeholder="EX: 22UCS138"
                      onChange={(e) => setRollno(e.target.value)}
                    />
                  </div>

                  {/* Semester */}
                  <label htmlFor="" className="label">
                    Semester
                  </label>
                  <div className="input-group">
                    <span className="input-group-text icons">
                   <img src="" alt="" className="img img-fluid" />
                    </span>
                    <select
                      onChange={(e) => setSem(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select Semester</option>
                      {[
                        "semester_1",
                        "semester_2",
                        "semester_3",
                        "semester_4",
                        "semester_5",
                        "semester_6",
                      ].map((value, index) => (
                        <option key={index} value={value}>
                          Semester {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* DOB */}
                  <label htmlFor="" className="label">
                    D.O.B
                  </label>
                  <div className="input-group">
                    <span className="input-group-text icons ">
                      <CiCalendarDate />
                    </span>
                    <input
                      type="date"
                      className="form-control "
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>

                  {/* Button */}
                  <button
                    className="logbtn rounded fw-bold py-2"
                    onClick={getResult}
                  >
                    View Result
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default FirstPage;
