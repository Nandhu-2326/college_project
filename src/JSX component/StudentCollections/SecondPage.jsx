import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import CollegeLogo from "../CollegeLogo";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

const SecondPage = () => {
  const pdfRef = useRef();
  const nav = useNavigate();
  const [result, setResult] = useState([]);
  const [student, setStudent] = useState(null);
  const [sem, setSem] = useState("");
  const [logo, setLogo] = useState(false);
  useEffect(() => {
    const marks = sessionStorage.getItem("Marks");
    const AllMark = marks ? JSON.parse(marks) : [];
    setResult(AllMark);

    const studentData = sessionStorage.getItem("student");
    const Alldata = studentData ? JSON.parse(studentData) : null;
    setStudent(Alldata);

    const semVal = sessionStorage.getItem("sem");
    setSem(semVal || "");
    console.log(semVal);
  }, []);

  const handleDownloadPDF = () => {
    setLogo(true);
    setTimeout(() => {
      const element = pdfRef.current;
      const opt = {
        margin: 0.3,
        filename: `InternalMarks_${sem}_${student?.Name}_${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
      };
      html2pdf().set(opt).from(element).save();
      setLogo(false);
    }, 500);
  };

  return (
    <>
      <CollegeLogo />

      <div className="container mb-5" style={{ width: "100%" }}>
        {result.length > 0 && student && (
          <div className="row mt-5  rounded  text-dark  p-1">
            <div className="col-12 rounded-4 p-4 " ref={pdfRef}>
              {logo && (
                <div className="container">
                  <img
                    src="/collegeLogo.png"
                    alt=""
                    className="img img-fluid"
                  />
                </div>
              )}
              <h5 className="text-center text-uppercase fw-bold mb-2">
                {student.Department}
              </h5>
              <div className="row mb-3">
                <div className="col-4 text-end fw-semibold">
                  Year: {student.year}
                </div>
                <div className="col-4 text-center fw-semibold">
                  Semester: {sem?.slice(10, 11)}
                </div>
                <div className="col-4 text-start fw-semibold">
                  Class: {student.class}
                </div>
              </div>
              <div className="text-center fw-bold text-uppercase fs-5">
                {student.Name}
              </div>
              <div className="text-center fw-semibold mb-3">
                {student.rollno}
              </div>

              <div className="table-responsive">
                <table
                  style={{ borderCollapse: "collapse" }}
                  className="table table-bordered border border-1 border-dark table-hover text-center align-middle"
                >
                  <thead className="table-primary border-1 border-dark">
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
                      <tr
                        key={doc.id || index}
                        className="border border-dark border-1"
                      >
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
            </div>

            <div className="d-flex  w-100 mt-3 justify-content-center  align-items-center mb-5">
              <div className="">
                <button
                  className="btn me-3 "
                  onClick={() => {
                    nav("/");
                  }}
                  style={{
                    letterSpacing: "2px",
                    background: "black",
                    color: "white",
                  }}
                >
                  Back
                </button>
              </div>
              <div>
                <button
                  className="btn text-uppercase d-flex align-items-center px-3 gap-2"
                  style={{
                    letterSpacing: "2px",
                    background: "rgb(29, 56, 208)",
                    color: "white",
                  }}
                  onClick={handleDownloadPDF}
                >
                  <img
                    src="/download.png"
                    width={20}
                    alt=""
                    className="img img-fluid"
                  />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SecondPage;
