import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { db } from "../Database";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  getDoc,
  orderBy,
} from "firebase/firestore";
import CollegeLogo from "../CollegeLogo";
import toast from "react-hot-toast";
import html2pdf from "html2pdf.js";
import { ThreeDot } from "react-loading-indicators";

const PDFResult = () => {
  const nav = useNavigate();
  const [staffData, setStaffData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [studentDetails, setStudentDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const pdfRef = useRef();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const staff = JSON.parse(sessionStorage.getItem("staff_Data") || "{}");
        const subject = JSON.parse(sessionStorage.getItem("Subject") || "{}");
        setStaffData(staff);
        setSelectedSubject(subject);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudentMark();
    }
  }, [selectedSubject]);

  const fetchStudentMark = async () => {
    try {
      const querys = query(
        collection(db, "student"),
        where("Department", "==", selectedSubject.department),
        where("class", "==", selectedSubject.class),
        where("ugorpg", "==", selectedSubject.ugorpg),
        where("year", "==", Number(selectedSubject.year)),
        where("rs", "==", selectedSubject.rs)
      );

      const studentData = await getDocs(querys);
      const allStudentData = [];

      for (let studentDoc of studentData.docs) {
        const studentInfo = studentDoc.data();
        const studentId = studentDoc.id;

        const markDocRef = doc(
          db,
          "student",
          studentId,
          selectedSubject.semester,
          selectedSubject.subject
        );

        const markSnap = await getDoc(markDocRef);
        const markData = markSnap.exists() ? markSnap.data() : {};

        allStudentData.push({
          ...studentInfo,
          id: studentId,
          markDetails: markData,
        });
      }

      // 🔽 Sort by roll number (alphanumeric safe)
      allStudentData.sort((a, b) =>
        a.rollno.localeCompare(b.rollno, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      );

      setStudentDetails(allStudentData);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const CurrentDataTime = new Date().toLocaleString();

  const handleDownloadPDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.3,
      filename: `MarkSheet_${selectedSubject?.subject}_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200); // 2s delay
    return () => clearTimeout(timer);
  }, []);

  const firstStudent = studentDetails[0] || {};
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center flex-column align-items-center"
        style={{
          height: "100vh",
          background: "rgba(25, 150, 25, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <ThreeDot
          variant="bounce"
          color="#111111"
          size="medium"
          text=""
          textColor=""
        />
        <h1
          className="mt-4 fw-bold"
          style={{
            color: "#000001", // Deep Sky Blue
            letterSpacing: "4px",
            fontSize: "2rem",
            textShadow: "0 0 10px rgba(0, 0, 1, 0.7)",
          }}
        >
          RESULT PLEASE WAIT
        </h1>
      </div>
    );
  }
  return (
    <>
      <div className="container d-flex p-3 justify-content-start align-items-center">
        <button
          className="btn text-primary border-0 fs-3"
          onClick={() => nav("/StaffLayout/MarkEntry")}
        >
          <FaArrowLeftLong /> Back
        </button>
      </div>

      <div className="container my-3 p-2">
        <button className="btn btn-outline-success" onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>

      <div className="container border p-3 mb-5" ref={pdfRef}>
        <CollegeLogo />

        {/* Header Info */}
        <div className="row mt-3 g-2">
          <div className="col-12 text-center">
            <h4 className="fw-bold text-uppercase">
              {selectedSubject?.department}
            </h4>
          </div>
          <div className="col-6 text-uppercase fw-semibold">
            Subject: {selectedSubject?.subject}
          </div>
          <div className="col-6 text-uppercase fw-semibold text-end">
            Year: {selectedSubject?.year}
          </div>
          <div className="col-4 text-uppercase fw-semibold">
            Semester: {selectedSubject?.semester?.slice(9)}
          </div>
          <div className="col-4 text-uppercase fw-semibold text-center">
            Degree: {firstStudent.ugorpg || "-"}
          </div>
          <div className="col-4 text-uppercase fw-semibold text-end">
            R/S: {firstStudent.rs || "-"}
          </div>
          <div
            className="col-12 text-end fw-semibold"
            style={{ letterSpacing: "1.5px" }}
          >
            Date: {CurrentDataTime}
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-hover text-center align-middle">
            <thead className="table-dark text-uppercase">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Internal - 1</th>
                <th>Internal - 2</th>
                <th>Average</th>
                {selectedSubject?.TorL == "Lab" ? (
                  <th> LabRecord </th>
                ) : (
                  <th> Assignment </th>
                )}
                {selectedSubject?.TorL == "Lab" ? (
                  <th> Observation </th>
                ) : (
                  <th> Seminar </th>
                )}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {studentDetails.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.Name}</td>
                  <td>{student.rollno.toUpperCase()}</td>

                  <td>
                    {selectedSubject?.TorL != "Lab"
                      ? student.markDetails?.Internal_1Og == null
                        ? "Absent"
                        : student.markDetails?.Internal_1Og
                      : selectedSubject?.TorL == "Lab"
                      ? student.markDetails.Internal_1Og == null
                        ? "Absent"
                        : student.markDetails.Internal_1Og
                      : " - "}
                  </td>
                  <td>
                    {selectedSubject?.TorL != "Lab"
                      ? student.markDetails?.Internal_2Og == null
                        ? "Absent"
                        : student.markDetails?.Internal_2Og
                      : selectedSubject?.TorL == "Lab"
                      ? student.markDetails.Internal_2Og == null
                        ? "Absent"
                        : student.markDetails.Internal_2Og
                      : " -"}
                  </td>

                  {selectedSubject?.TorL != "Lab" ? (
                    <td>
                      {student.markDetails?.TotalInternal == null
                        ? "Absent"
                        : student.markDetails?.TotalInternal}
                    </td>
                  ) : (
                    <td>
                      {student.markDetails?.AverageMark == null
                        ? "Absent"
                        : student.markDetails?.AverageMark}
                    </td>
                  )}

                  {selectedSubject?.TorL != "Lab" ? (
                    <td>
                      {student.markDetails?.Assignment == null
                        ? "Absent"
                        : student.markDetails?.Assignment}
                    </td>
                  ) : (
                    <td>
                      {student.markDetails?.LabRecord == null
                        ? "Absent"
                        : student.markDetails?.LabRecord}
                    </td>
                  )}
                  {selectedSubject?.TorL != "Lab" ? (
                    <td>
                      {student.markDetails?.Seminar == null
                        ? "Absent"
                        : student.markDetails?.Seminar}
                    </td>
                  ) : (
                    <td>
                      {student.markDetails?.Observation == null
                        ? "Absent"
                        : student.markDetails?.Observation}
                    </td>
                  )}
                  {selectedSubject?.TorL != "Lab" ? (
                    <td>
                      {student.markDetails?.NeetMark == null
                        ? "Absent"
                        : student.markDetails?.NeetMark}
                    </td>
                  ) : (
                    <td>
                      {student.markDetails?.Totalmark == null
                        ? "Absent"
                        : student.markDetails?.Totalmark}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PDFResult;
