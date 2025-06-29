import React, { useEffect, useState, useRef } from "react";
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
import { HashLoader } from "react-spinners";

const PDFResult = () => {
  const nav = useNavigate();
  const [staffData, setStaffData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [studentDetails, setStudentDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [times, setTimes] = useState("");
  const pdfRef = useRef();
  const [logo, setLogo] = useState(false);

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
      setIsLoading(false);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const TimeStamp = () => {
    var CurrentDataTime = new Date().toLocaleString();
    setTimes(CurrentDataTime);
  };

  useEffect(() => {
    TimeStamp();
  }, [TimeStamp]);
  setInterval(TimeStamp, 1000);

  const handleDownloadPDF = () => {
    setLogo(true);
    setTimeout(() => {
      const element = pdfRef.current;
      const opt = {
        margin: 0.3,
        filename: `MarkSheet_${selectedSubject?.subject}_${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };
      html2pdf().set(opt).from(element).save();
      setLogo(false);
    }, 1);
  };

  const firstStudent = studentDetails[0] || {};
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "75vh" }}
      >
        <HashLoader color="#1e90ff" size={75} />
      </div>
    );
  }
  return (
    <>
      <div
        style={{ background: "#d5181c", overflowX: "hidden" }}
        className="container-fluid d-md-none bg-gradient text-light sticky-top p-2 "
      >
        <div className="row d-flex align-items-center justify-content-between">
          <div className="col-2 ">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/StaffLayout/MarkEntry");
              }}
            >
              <img src="/back.png" width={25} alt="" className="img img-flui" />
            </button>
          </div>
          <div className="col-6 justify-content-end d-flex">
            <button
              className="btn btn-success bg-gradient d-flex align-items-center"
              // style={{ background: "rgb(290,101,20)", color: "white" }}
              onClick={handleDownloadPDF}
            >
              <img
                src="/download.png"
                width={20}
                alt=""
                className="img img-fluid"
              />{" "}
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
      <div
        style={{ overflowX: "hidden" }}
        className="container-fluid d-none bg-light d-md-block bg-gradient text-light sticky-top p-2 "
      >
        <div className="row d-flex align-items-center justify-content-between">
          <div className="col-2 ">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/StaffLayout/MarkEntry");
              }}
            >
              <img
                src="/arrow-left.png"
                width={25}
                alt=""
                className="img img-flui"
              />
            </button>
          </div>
          <div className="col-6 justify-content-end d-flex">
            <button
              className="btn btn-success bg-gradient d-flex align-items-center"
              // style={{ background: "rgb(290,101,20)", color: "white" }}
              onClick={handleDownloadPDF}
            >
              <img
                src="/download.png"
                width={20}
                alt=""
                className="img img-fluid"
              />{" "}
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-2">
        <div
          className="container border border-dark border-1 mb-5 mt-5"
          ref={pdfRef}
        >
          {logo && <CollegeLogo />}

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
              Date: {times}
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive mt-4">
            <table className="table table-bordered table-hover text-center align-middle">
              <thead className="table-dark text-uppercase border border-2 border-dark">
                <tr className="border border-2 border-dark">
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
                  <tr key={student.id} className="border border-2 border-dark">
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

          <div className="mt-5 py-3">
            <div className="row">
              <div className="col-4 text-end">STAFF</div>
              <div className="col-4 text-center">HOD </div>
              <div className="col-4">PRINCIPAL</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container p-5"></div>
    </>
  );
};

export default PDFResult;
