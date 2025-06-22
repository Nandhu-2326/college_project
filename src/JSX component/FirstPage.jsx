import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import CollegeLogo from "./CollegeLogo";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import Footer from "./Footer";
import { RiFileList3Line } from "react-icons/ri";
import { db } from "./Database";
import { collection, getDocs, query, where } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import "./Style Component/firstpage.css";
const FirstPage = () => {
  const [dob, setDob] = useState("");
  const [rollno, setRollno] = useState("");
  const [sem, setSem] = useState("");
  const [result, setResult] = useState([]);
  const [student, setStudent] = useState(null);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Mark Statement",
    removeAfterPrint: true,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        table {
          border-collapse: collapse;
        }
      }
    `,
  });

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
      setStudent(studentData);

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
        setResult(markData);
        console.log(markData);
        console.log(studentData);
        toast.dismiss(loading);
        toast.success("Result");
      } else {
        toast.error("This semester has no result");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <CollegeLogo />
      <div className="container-fluid  min-vh-100 ">
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow rounded-4 border-0">
              <div className="card-header bg-white border-0 text-center">
                <h2 className="fw-bold text-dark text-uppercase">
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
                      <FaRegUserCircle />
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
                      <RiFileList3Line />
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

        {Array.isArray(result) && result.length > 0 && student && (
          <div className="row mt-5 text-dark" ref={componentRef}>
            <div className="col-12  rounded-4 p-4 shadow-sm">
              <h5 className="text-center text-uppercase fw-bold  mb-2">
                {student.Department}
              </h5>
              <div className="row mb-3">
                <div className="col-4 fw-semibold">Year: {student.year}</div>
                <div className="col-4 text-center fw-semibold">
                  Semester: {sem.slice(9)}
                </div>
                <div className="col-4 text-end fw-semibold">
                  Class: {student.class}
                </div>
              </div>
              <div className="text-center fw-bold text-uppercase fs-5">
                {student.Name}
              </div>
              <div className="text-center fw-semibold  mb-3">
                {student.rollno}
              </div>

              <div className="table-responsive">
                <table className="table table-bordered table-hover text-center align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th>S.No</th>
                      <th>Subject</th>
                      <th>Type</th>
                      <th>Internal 1</th>
                      <th>Internal 2</th>
                      <th>Average</th>
                      <th>Lab Record or Assignment</th>

                      <th>Observation or Seminar</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((doc, index) => (
                      <tr key={doc.id}>
                        <td>{index + 1}</td>
                        <td>{doc.id}</td>
                        <td>{doc.TorL}</td>
                        <td>
                          {doc.Internal_1Og != null
                            ? doc.Internal_1Og
                            : "Absent"}
                        </td>
                        <td>
                          {doc.Internal_2Og != null
                            ? doc.Internal_2Og
                            : "Absent"}
                        </td>
                        <td>
                          {doc.TorL != "Lab"
                            ? doc.BothInternal != null
                              ? doc.BothInternal
                              : "Absent"
                            : doc.AverageMark != null
                            ? doc.AverageMark
                            : "Absent"}
                        </td>
                        <td>
                          {doc.TorL != "Lab"
                            ? doc.Assignment != null
                              ? doc.Assignment
                              : "Absent"
                            : doc.LabRecord != null
                              ? doc.LabRecord
                              : "Absent"}
                        </td>
                        <td>
                          {doc.TorL != "Lab"
                            ? doc.Seminar != null
                              ? doc.Seminar
                              : "Absent"
                            : doc.Observation != null
                              ? doc.Observation
                              : "Absent"}
                        </td>
                        <td>
                          {doc.TorL !== "Lab" ? doc.NeetMark : doc.Totalmark}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex w-100 justify-content-center mb-3">
                <button
                  className="btn btn-dark text-uppercase"
                  style={{ letterSpacing: "2px" }}
                  onClick={handlePrint}
                >
                  PRINT
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-5">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default FirstPage;
