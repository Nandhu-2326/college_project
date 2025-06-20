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
      toast.loading("Please Wait");
      const rollQuery = query(
        collection(db, "student"),
        where("rollno", "==", rollno.trim().toUpperCase())
      );
      const rollSnap = await getDocs(rollQuery);

      if (rollSnap.empty) {
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
        toast.dismiss();
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
      <div
        className="container-fluid  min-vh-100 "
        style={{
          backgroundImage: "url(/campus.jpg)",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="row justify-content-center ">
          <div className="col-12 text-center mb-4 mt-2">
            <h2 className="fw-bold text-light text-uppercase">View Result</h2>
            <p className="text-light fw-semibold fs-6">
              Enter your Roll No and DOB to view marks
            </p>
          </div>

          <div className="col-12 col-md-6 col-lg-4  mt-3 mt-sm-0 rounded-4  p-4">
            <div className="d-flex flex-column gap-4">
              <div className="input-group">
                <span className="input-group-text border-0 bg-primary text-white">
                  <FaRegUserCircle />
                </span>
                <input
                  type="text"
                  className="form-control border border-primary"
                  placeholder="EX: 22UCS138"
                  onChange={(e) => setRollno(e.target.value)}
                />
              </div>

              <div className="input-group">
                <span className="input-group-text border-0 bg-primary text-white">
                  <RiFileList3Line />
                </span>
                <select
                  onChange={(e) => setSem(e.target.value)}
                  className="form-select border border-primary"
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

              <div className="input-group">
                <span className="input-group-text border-0 bg-primary text-white">
                  <CiCalendarDate />
                </span>
                <input
                  type="date"
                  className="form-control border border-primary"
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary fw-bold py-2 mt-2"
                onClick={getResult}
              >
                View Result
              </button>
            </div>
          </div>
        </div>

        {Array.isArray(result) && result.length > 0 && student && (
          <div className="row mt-5 text-light " ref={componentRef}>
            <div className="col-12  rounded-4 p-4 shadow-sm">
              <h5 className="text-center text-uppercase  mb-2">
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
                          {doc.TorL !== "Lab"
                            ? doc.BothInternal != null
                              ? doc.BothInternal
                              : "Absent"
                            : doc.AverageMark != null
                            ? doc.AverageMark
                            : "Absent"}
                        </td>
                        <td>
                          {doc.TorL !== "Lab"
                            ? doc.Assignment != null
                              ? doc.Assignment
                              : "Absent"
                            : doc.LabRecord != null
                            ? doc.LabRecord
                            : "Absent"}
                        </td>
                        <td>
                          {doc.TorL !== "Lab"
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
