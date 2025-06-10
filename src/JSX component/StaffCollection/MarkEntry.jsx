import React, { useEffect, useState } from "react";
import { db } from "../Database";
import { collection, getDocs, query, where } from "firebase/firestore";

const MarkEntry = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [staffData, setStaffData] = useState({});
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Fetch and parse staff and subject data
        const staff = JSON.parse(sessionStorage.getItem("staff_Data") || "{}");
        const subject = JSON.parse(sessionStorage.getItem("Subject") || "{}");

        setStaffData(staff);
        setSelectedSubject(subject);

        if (
          staff?.department &&
          staff?.class &&
          staff?.ugorpg &&
          staff?.year &&
          staff?.rs
        ) {
          const q = query(
            collection(db, "student"),
            where("Department", "==", staff.department),
            where("class", "==", staff.class),
            where("ugorpg", "==", staff.ugorpg),
            where("year", "==", staff.year),
            where("rs", "==", staff.rs)
          );

          const snapshot = await getDocs(q);
          const studentList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log(studentList);
          setStudents(studentList);
          console.log("Fetched students:", studentList);
        } else {
          console.warn("Incomplete staff data for querying students.");
        }
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    loadInitialData();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center p-3">
        <p className="fw-semibold mb-0">STAFF : {staffData?.staffName || ""}</p>
        <p className="fw-semibold mb-0">
          D-Code : {staffData?.DepartmentCode || ""}
        </p>
      </div>

      {/* Title */}
      <h2 className="text-center text-primary mt-4 text-uppercase">
        Mark Entry <br /> in
      </h2>

      {/* Subject Info */}
      <div className="container p-2 bg-primary rounded d-flex justify-content-center align-items-center flex-column">
        <h6
          className="h4 text-light text-uppercase text-center"
          style={{ letterSpacing: "2px" }}
        >
          {selectedSubject?.department || "Department"}
        </h6>
        <strong
          className="text-light text-uppercase"
          style={{ letterSpacing: "2px" }}
        >
          Subject : {selectedSubject?.subject || "Subject"}
        </strong>
        <strong
          className="text-light text-uppercase"
          style={{ letterSpacing: "2px" }}
        >
          Theory / Lab : {selectedSubject?.TorL || "T/L"}
        </strong>
        <div className="d-flex justify-content-between mt-2 w-100 px-3">
          <strong
            className="me-3 text-light text-uppercase"
            style={{ letterSpacing: "1px" }}
          >
            Class : {selectedSubject?.class || "Class"}
          </strong>
          <strong
            className="me-3 text-light text-uppercase"
            style={{ letterSpacing: "1px" }}
          >
            Year : {selectedSubject?.year || "Year"}
          </strong>
          <strong
            className="text-light text-uppercase"
            style={{ letterSpacing: "1px" }}
          >
            Degree : {selectedSubject?.ugorpg || "UG/PG"}
          </strong>
        </div>
      </div>

      {/* Student List */}
      <div className="container mt-4 mb-5">
        <h4 className="text-center mb-3">Students</h4>
        {students.length > 0 ? (
          <table className="table table-bordered">
            <thead className="table-primary">
              <tr>
                <th>Roll No</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.rollno || "N/A"}</td>
                  <td>{student.Name || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-muted">No students found.</p>
        )}
      </div>
    </>
  );
};

export default MarkEntry;
