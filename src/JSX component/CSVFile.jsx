import { useLocation } from "react-router-dom";
import CollegeLogo from "./CollegeLogo";
import { useEffect, useState } from "react";
import { db } from "./Database.js";
import { collection, getDocs, doc } from "firebase/firestore";
import Swal from "sweetalert2";

const CSVFile = () => {
  const location = useLocation();
  const { dep, sem, sub, deg } = location.state;
  const [studentDetails, setStudentDetails] = useState([]);

  const loading = () => {
    Swal.fire({
      html: "Please Wait",
      timer: 3000,
      timerProgressBar: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  useEffect(() => {
    loading();
    getData();
  }, [dep, sem, sub, deg]);

  const getData = async () => {
    try {
      const studentSnapshot = await getDocs(collection(db, "student"));
      const allStudents = studentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filterData = allStudents.filter(
        (value) => value.Department === dep && value.ugorpg === deg && value.id
      );

      const BothData = [];
      for (let stu of filterData) {
        const studentDoc = doc(db, "student", stu.id);
        const marksCollection = collection(studentDoc, sub);
        const marksSnapshot = await getDocs(marksCollection);
        const marksData = marksSnapshot.docs.map((doc) => doc.data());
        BothData.push({
          ...stu,
          marks: marksData,
        });
      }

      setStudentDetails(BothData);
    } catch (e) {
      Swal.fire("Error", e.message, "error");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "S.No,Name,Roll No,Department,Subject,Year,Degree,Internal - I,Internal - II,Internal - III,Assignment,Seminary,Average,Total",
    ];

    const rows = studentDetails.map((val, index) => {
      const markObj = val.marks.reduce(
        (acc, item) => ({ ...acc, ...item }),
        {}
      );
      return [
        index + 1,
        val.Name,
        val.rollno.toUpperCase(),
        val.Department,
        markObj.subject || sub,
        val.year,
        val.ugorpg.toUpperCase(),
        markObj.InternalDB_1 || "Not",
        markObj.InternalDB_2 || "Not",
        deg === "pg" ? markObj.InternalDB_3 || "Not" : "---",
        markObj.AssignmentMark || "Not",
        markObj.SeminarMark || "Not",
        markObj.Average || "Not",
        markObj.Total || "Not",
      ].join(",");
    });

    const csv = [...headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Student_Marks_${sub}_${deg}.csv`;
    link.click();
  };

  return (
    <>
      <CollegeLogo />
      <div className="container mt-5">
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-outline-success" onClick={exportToCSV}>
            Download CSV
          </button>
        </div>

        {studentDetails.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-dark table-bordered">
              <caption className="text-center fw-bold text-uppercase fs-5 mb-2">
                Department: {dep} | Subject: {sub} | Degree: {deg} | Semester:{" "}
                {sem}
              </caption>
              <thead>
                <tr>
                  <th className="text-center">S.No</th>
                  <th className="text-center">Name</th>
                  <th className="text-center">Roll No</th>
                  <th className="text-center">Department</th>
                  <th className="text-center">Subject</th>
                  <th className="text-center">Year</th>
                  <th className="text-center">Degree</th>
                  <th className="text-center">Internal - I</th>
                  <th className="text-center">Internal - II</th>
                  <th className="text-center">Internal - III</th>
                  <th className="text-center">Assignment</th>
                  <th className="text-center">Seminary</th>
                  <th className="text-center">Average</th>
                  <th className="text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {studentDetails.map((val, index) => {
                  const markObj = val.marks.reduce(
                    (acc, item) => ({ ...acc, ...item }),
                    {}
                  );
                  return (
                    <tr key={val.id}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{val.Name}</td>
                      <td className="text-center">
                        {val.rollno.toUpperCase()}
                      </td>
                      <td className="text-center">{val.Department}</td>
                      <td className="text-center">{markObj.subject || sub}</td>
                      <td className="text-center">{val.year}</td>
                      <td className="text-center">
                        {val.ugorpg.toUpperCase()}
                      </td>
                      <td className="text-center">
                        {markObj.InternalDB_1 || "Not"}
                      </td>
                      <td className="text-center">
                        {markObj.InternalDB_2 || "Not"}
                      </td>
                      <td className="text-center">
                        {deg === "pg" ? markObj.InternalDB_3 || "Not" : "---"}
                      </td>
                      <td className="text-center">
                        {markObj.AssignmentMark || "Not"}
                      </td>
                      <td className="text-center">
                        {markObj.SeminarMark || "Not"}
                      </td>
                      <td className="text-center">
                        {markObj.Average || "Not"}
                      </td>
                      <td className="text-center">{markObj.Total || "Not"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-danger fw-bold">
            No Student Details. Please Check Marks Entry.
          </p>
        )}
      </div>
    </>
  );
};

export default CSVFile;
