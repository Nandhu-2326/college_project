import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useReducer, useState } from "react";
import { db } from "../Database";
import { TiTickOutline } from "react-icons/ti";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const initialStudentState = [];
const studentReducer = (state, action) => {
  switch (action.type) {
    case "SET_STUDENTS":
      return action.payload;
    default:
      return state;
  }
};

const StudentList = () => {
  const [hodData, setHOD] = useState({});
  const [studentState, dispatch] = useReducer(
    studentReducer,
    initialStudentState
  );

  const { Department, HODName, ugorpg } = hodData;

  useEffect(() => {
    const data = sessionStorage.getItem("HOD_Data");
    if (data) {
      const HODdata = JSON.parse(data);
      setHOD(HODdata);
    }
  }, []);

  const fetchStudents = async () => {
    if (!Department) return;
    const q = query(
      collection(db, "student"),
      where("Department", "==", Department)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const students = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(students);
      dispatch({ type: "SET_STUDENTS", payload: students });
    } else {
      console.log("No students found.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [Department]);
  const ActiveProcess = (idSt, Names, Rollno) => {
    Swal.fire({
      title: "Are you sure? ",
      text: "You won't be able to revert this!",
      text: `${Names}`,
      text: `${Rollno}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        UpdateActive(idSt);
        Swal.fire({
          title: "Complite!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };
  const UpdateActive = async (idSt) => {
    const selectedStudent = studentState.find((student) => student.id === idSt);
    if (!selectedStudent) return;

    const studentOf = doc(db, "student", idSt);
    
    await updateDoc(studentOf, {
      active: !selectedStudent.active,
    });

    fetchStudents();
  };

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center p-3">
        <p className="fw-semibold mb-0">HOD : {HODName}</p>
        <p className="fw-semibold mb-0">Department : {Department?.slice(14)}</p>
      </div>

      <div className="container mt-2">
        <div className="card bg-light">
          <div className="card-header">
            <div
              className="card-title text-primary text-center fs-3 text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              student Details
            </div>
          </div>
          <div className="card-body  d-flex justify-content-center text-light">
            <div className="row  g-2">
              <div className="col-12 text-center ">
                <span
                  className="text-dark fw-semibold text-uppercase"
                  style={{ letterSpacing: "0.5px" }}
                >
                  I - Year -{" "}
                  {studentState.filter((student) => student.year == 1).length}
                </span>
              </div>
              <div className="col-6 text-center">
                <span
                  className="text-dark fw-semibold text-uppercase"
                  style={{ letterSpacing: "0.5px" }}
                >
                  II - Year{" "}
                  {studentState.filter((student) => student.year == 2).length}
                </span>
              </div>
              <div className="col-6 text-center">
                <span
                  className="text-dark fw-semibold text-uppercase"
                  style={{ letterSpacing: "0.5px" }}
                >
                  III - Year -
                  {studentState.filter((student) => student.year == 3).length}
                </span>
              </div>
            </div>
          </div>
          <div
            className="card-footer text-center fw-semibold text-uppercase"
            style={{ letterSpacing: "2.5px" }}
          >
            Total Student - {studentState.length}
          </div>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="table-responsive mb-5">
          {(ugorpg == "ug" ? [1, 2, 3] : [1, 2]).map((year) => {
            const studentsOfYear = studentState.filter(
              (std) => std.year == year
            );
            return studentsOfYear.length > 0 ? (
              <div key={year} className="mb-4">
                <h5 className="text-center fw-bold">YEAR - {year}</h5>
                <table className="table table-bordered table-striped table-light shadow">
                  <thead className=" text-center">
                    <tr>
                      <th>S.No</th>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Year</th>
                      <th>Edit</th>
                      <th>Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsOfYear.map((student, index) => (
                      <tr key={student.id} className="text-center">
                        <td>{index + 1}</td>
                        <td>{student.rollno?.toUpperCase()}</td>
                        <td>{student.Name}</td>
                        <td>{student.class}</td>
                        <td>{student.year}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              ActiveProcess(
                                student.id,
                                student.Name,
                                student.rollno
                              );
                            }}
                          >
                            <FaPencilAlt />
                          </button>
                        </td>
                        <td>
                          <span className="" disabled>
                            {student.active ? (
                              <TiTickOutline className="text-success fs-1" />
                            ) : (
                              <HiOutlineArchiveBoxXMark className="text-danger fs-1" />
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center fw-semibold">
                No Students Year {year}{" "}
              </p>
            );
          })}
        </div>
      </div>
      <div className="container mt-5 p-5"></div>
    </>
  );
};

export default StudentList;
