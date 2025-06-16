import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useReducer, useState } from "react";
import { db } from "../Database";
import { TiTickOutline } from "react-icons/ti";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { FaPencilAlt } from "react-icons/fa";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { GiSpellBook } from "react-icons/gi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

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
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [activeStudent, setActiveStudent] = useState([]);
  const [hodData, setHOD] = useState({});
  const [UpDataStid, setUpStudentid] = useState();
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
      const students = snapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .sort((a, b) =>
          a.rollno?.localeCompare(b.rollno, undefined, { numeric: true })
        );
      dispatch({ type: "SET_STUDENTS", payload: students });
      const activeStudent = students.filter((stu) => {
        return stu.active === true;
      });
      setActiveStudent(activeStudent);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [Department]);

  const UpdateObject = {
    NameUP: "",
    rollnoUP: "",
    DepartmentUP: "",
    ugorpgUP: "",
    rsUP: "",
    yearUP: "",
    classUP: "",
    activeUP: "",
  };

  const inputFields = [
    { label: "Name", name: "NameUP" },
    { label: "Roll No", name: "rollnoUP" },
    { label: "Department", name: "DepartmentUP" },
    { label: "UG or PG", name: "ugorpgUP" },
    { label: "Regular or Self", name: "rsUP" },
    { label: "Year", name: "yearUP" },
    { label: "Class", name: "classUP" },
    { label: "Active", name: "activeUP" },
  ];

  const UpdateReducer = (state, active) => ({
    ...state,
    [active.field]: active.value,
  });

  const [state, dispatch1] = useReducer(UpdateReducer, UpdateObject);

  const handleShowModal = async (idSt) => {
    setShowModal(true);
    const STdata = doc(db, "student", idSt);
    const getDataST = await getDoc(STdata);
    const filterData = getDataST.data();

    setUpStudentid(idSt);
    for (const key in UpdateObject) {
      const originalKey = key.replace("UP", "");
      dispatch1({ field: key, value: filterData[originalKey] });
    }
  };

  const handleCloseModal = () => setShowModal(false);

  const viewStudent = async (idSt) => {
    toast.loading("Please Wait");
    const STdata = doc(db, "student", idSt);
    const getDataST = await getDoc(STdata);
    const filterData = getDataST.data();
    toast.dismiss();
    Swal.fire({
      title: "Student Information",
      html: `
        <div style="text-align: left; line-height: 1.8;">
          <strong>Name:</strong> ${filterData.Name || "-"}<br/>
          <strong>Roll No:</strong> ${filterData.rollno || "-"}<br/>
          <strong>Department:</strong> ${filterData.Department || "-"}<br/>
          <strong>UG/PG:</strong> ${filterData.ugorpg.toUpperCase() || "-"}<br/>
          <strong>Year:</strong> ${filterData.year || "-"}<br/>
          <strong>Class:</strong> ${filterData.class || "-"}<br/>
          <strong>Regular/Self:</strong> ${filterData.rs || "-"}<br/>
          <strong>Active:</strong> ${filterData.active ? "Yes" : "No"}
        </div>
      `,
    });
  };

  const ActiveProcess = (idSt, Names, Rollno) => {
    Swal.fire({
      title: "Are you sure?",
      text: `${Names} ${Rollno}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        UpdateActive(idSt);
        Swal.fire("Updated!", "Status has been changed.", "success");
      }
    });
  };

  const UpdateActive = async (idSt) => {
    const selectedStudent = studentState.find((student) => student.id === idSt);
    if (!selectedStudent) return;

    const studentOf = doc(db, "student", idSt);
    await updateDoc(studentOf, { active: !selectedStudent.active });
    fetchStudents();
  };

  const UpdateAllDetails = async () => {
    if (
      !state.NameUP ||
      !state.rollnoUP ||
      !state.ugorpgUP ||
      !state.DepartmentUP ||
      !state.yearUP ||
      !state.activeUP ||
      !state.rsUP ||
      !state.classUP
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!["ug", "pg"].includes(state.ugorpgUP)) {
      toast.error("Please enter UG or PG only");
      return;
    }

    if (!["A", "B"].includes(state.classUP.toUpperCase())) {
      toast.error("Please enter class A or B only");
      return;
    }

    if (!["true", "false"].includes(state.activeUP)) {
      toast.error("Please enter active as true or false only");
      return;
    }

    const year = parseInt(state.yearUP);
    if (isNaN(year) || year < 1 || year > 3) {
      toast.error("Please enter year between 1 to 3");
      return;
    }

    if (!["regular", "self"].includes(state.rsUP)) {
      toast.error("Please enter regular or self only");
      return;
    }

    try {
      toast.loading("Updating...");
      await updateDoc(doc(db, "student", UpDataStid), {
        Name: state.NameUP,
        rollno: state.rollnoUP.toUpperCase(),
        ugorpg: state.ugorpgUP.toLowerCase(),
        Department: state.DepartmentUP,
        year: year,
        class: state.classUP.toUpperCase(),
        active: state.activeUP === "true",
        rs: state.rsUP.toLowerCase(),
      });
      fetchStudents();
      toast.dismiss();
      toast.success("Updated Student Details");
      setShowModal(false);
    } catch (error) {
      toast.dismiss();
      toast.error("Update failed");
      console.error(error);
    }
  };

  // === Count inactive per year
  const inactiveCounts = {
    1: studentState.filter((s) => s.year === 1 && !s.active).length,
    2: studentState.filter((s) => s.year === 2 && !s.active).length,
    3: studentState.filter((s) => s.year === 3 && !s.active).length,
  };

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center p-3">
        <p className="fw-semibold mb-0">HOD : {HODName}</p>
        <p className="fw-semibold mb-0">Department : {Department?.slice(14)}</p>
      </div>
      <div className="container  d-felx  p-3 justify-content-start align-items-center">
        <button
          className="btn text-primary border-0 fs-3"
          onClick={() => {
            nav("/HODLayout/StaffDetails");
          }}
        >
          <FaArrowLeftLong /> Back
        </button>
      </div>

      <div className="container mt-2">
        <div className="card bg-light">
          <div className="card-header text-center text-primary fs-3 text-uppercase">
            Student Details
          </div>
          <div className="card-body d-flex justify-content-center">
            <div className="row g-2 text-dark text-uppercase fw-semibold text-center">
              <div className="col-12">
                I - Year -{" "}
                {studentState.filter((s) => s.year === 1).length -
                  inactiveCounts[1]}
              </div>
              <div className="col-6">
                II - Year -{" "}
                {studentState.filter((s) => s.year === 2).length -
                  inactiveCounts[2]}
              </div>
              <div className="col-6">
                III - Year -{" "}
                {studentState.filter((s) => s.year === 3).length -
                  inactiveCounts[3]}
              </div>
            </div>
          </div>
          <div className="card-footer text-center fw-semibold text-uppercase">
            Total Student - {activeStudent.length}
          </div>
        </div>
      </div>

      <div className="container mt-5 mb-5 ">
        {(ugorpg === "ug" ? [1, 2, 3] : [1, 2]).map((year) => {
          const studentsOfYear = studentState
            .filter((std) => std.year === year)
            .sort((a, b) =>
              a.rollno?.localeCompare(b.rollno, undefined, { numeric: true })
            );
          return studentsOfYear.length > 0 ? (
            <div key={year} className="mb-4">
              <h5 className="text-center fw-bold">YEAR - {year}</h5>
              <div className="table-responsive">
                <table className="table table-responsive table-bordered table-striped table-secondary shadow table-hover">
                  <thead className="text-center text-uppercase">
                    <tr>
                      <th>S.No</th>
                      <th>View</th>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Year</th>
                      <th>Update</th>
                      <th>Change Active</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsOfYear.map((student, index) => (
                      <tr key={student.id} className="text-center">
                        <td>{index + 1}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => viewStudent(student.id)}
                          >
                            <GiSpellBook />
                          </button>
                        </td>
                        <td>{student.rollno?.toUpperCase()}</td>
                        <td>{student.Name}</td>
                        <td>{student.class}</td>
                        <td>{student.year}</td>
                        <td>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => handleShowModal(student.id)}
                          >
                            <MdOutlinePublishedWithChanges />
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() =>
                              ActiveProcess(
                                student.id,
                                student.Name,
                                student.rollno
                              )
                            }
                          >
                            <FaPencilAlt />
                          </button>
                        </td>
                        <td>
                          {student.active ? (
                            <TiTickOutline className="text-success fs-1" />
                          ) : (
                            <HiOutlineArchiveBoxXMark className="text-danger fs-1" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p key={year} className="text-center fw-semibold">
              No Students Year {year}
            </p>
          );
        })}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="bg-primary text-light">
          <Modal.Title className="text-uppercase text-center">
            Update Student
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {inputFields.map((field, index) => (
            <div key={index} className="mb-3">
              <label
                htmlFor={field.name}
                className="form-label text-uppercase"
                style={{ letterSpacing: "2px" }}
              >
                {field.label}
              </label>
              <input
                type={field.name === "yearUP" ? "number" : "text"}
                id={field.name}
                name={field.name}
                className="form-control"
                value={state[field.name]}
                min={field.name === "yearUP" ? 1 : undefined}
                max={field.name === "yearUP" ? 3 : undefined}
                onChange={(e) => {
                  let value = e.target.value;
                  if (["rollnoUP", "classUP"].includes(field.name)) {
                    value = value.toUpperCase();
                  } else if (
                    ["ugorpgUP", "activeUP", "rsUP"].includes(field.name)
                  ) {
                    value = value.toLowerCase();
                  }
                  dispatch1({ field: field.name, value });
                }}
              />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={UpdateAllDetails}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="container mt-5 py-5"></div>
    </>
  );
};

export default StudentList;
