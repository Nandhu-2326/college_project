import React, { useEffect, useReducer, useState } from "react";
import { db } from "../Database";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";

const MarkEntry = () => {
  // useState
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [staffData, setStaffData] = useState({});
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const initialize = {
    check1: false,
    check2: false,
    check3: false,
    mark1: "",
    mark2: "",
    mark3: "",
    Assignment: "",
    Seminar: "",
  };

  const checkReducer = (state, action) => {
    return {
      ...state,
      [action.field]: action.value,
    };
  };
  const [state, dispatch] = useReducer(checkReducer, initialize);
  // console.log(state);

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
    studentData();
  }, [selectedSubject]);

  const studentData = async () => {
    if (
      selectedSubject?.department &&
      selectedSubject?.class &&
      selectedSubject?.ugorpg &&
      selectedSubject?.year &&
      selectedSubject?.rs
    ) {
      const q = query(
        collection(db, "student"),
        where("Department", "==", selectedSubject.department),
        where("class", "==", selectedSubject.class),
        where("ugorpg", "==", selectedSubject.ugorpg),
        where("year", "==", selectedSubject.year),
        where("rs", "==", selectedSubject.rs)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const studentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentList);
        console.log(studentList);
      } else {
        setStudents([]);
      }
    }
  };

  const handleShowModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const SubmiteSubjectMark = async (IdSt) => {
    // console.log(IdSt);
    if(selectedSubject.ugorpg == "ug")
    {

    if (!state.mark1 || !state.mark2 || !state.Assignment || !state.Seminar) {
      toast.error("Please Fill All Requirements");
      return;
    }

    let dbmark1 = state.mark1 === "Absent" ? null : Number(state.mark1);
    let dbmark2 = state.mark2 === "Absent" ? null : Number(state.mark2);

    const dbAssignment = Number(state.Assignment);
    const dbSeminar = Number(state.Seminar);

    if (
      (dbmark1 !== null && (dbmark1 < 0 || dbmark1 > 30)) ||
      (dbmark2 !== null && (dbmark2 < 0 || dbmark2 > 30))
    ) {
      toast.error("Mark1 and Mark2 must be between 0 and 30 ");
      return;
    }

    if (
      dbAssignment < 0 ||
      dbAssignment > 5 ||
      dbSeminar < 0 ||
      dbSeminar > 5
    ) {
      toast.error("Assignment and Seminar marks must be between 0 and 5");
      return;
    }

    try {
      toast.loading("Uploading...");
      const Internal_1Og = dbmark1;
      const Internal_2Og = dbmark2;
      const Internal_1 = dbmark1 / 2;
      const Internal_2 = dbmark2 / 2;
      const BothInternal = Math.round(Internal_1 + Internal_2);
      const TotalInternal = Math.round(BothInternal / 2);
      const NeetMark = Math.round(TotalInternal + dbAssignment + dbSeminar);

      const dbSetMark = doc(db, "student", IdSt);
      const dbCollection = doc(
        collection(dbSetMark, selectedSubject.semester),
        selectedSubject.subject
      );

      await setDoc(dbCollection, {
        Internal_1Og: Internal_1Og,
        Internal_2Og: Internal_2Og,
        Internal_1: Internal_1,
        Internal_2: Internal_2,
        BothInternal: BothInternal,
        TotalInternal: TotalInternal,
        NeetMark: NeetMark,
        Assignment: dbAssignment,
        Seminar: dbSeminar,
      });
      toast.dismiss()
      toast.success("Mark Successfully Complited");
    } catch (e) {
      toast.error(e.message);
    }
      }
      else{
        
    if (!state.mark1 || !state.mark2 || !state.mark3 || !state.Assignment || !state.Seminar) {
      toast.error("Please Fill All Requirements");
      return;
    }


    let dbmark1 = state.mark1 === "Absent" ? null : Number(state.mark1);
    let dbmark2 = state.mark2 === "Absent" ? null : Number(state.mark2);
    let dbmark3 = state.mark3 === "Absent" ? null : Number(state.mark3);
    const dbAssignment = Number(state.Assignment);
    const dbSeminar = Number(state.Seminar);
    let MarkArray = [dbmark1, dbmark2, dbmark3]
    

    if (
      (dbmark1 !== null && (dbmark1 < 0 || dbmark1 > 30)) ||
      (dbmark2 !== null && (dbmark2 < 0 || dbmark2 > 30))
    ) {
      toast.error("Mark1 and Mark2 must be between 0 and 30 ");
      return;
    }

    if (
      dbAssignment < 0 ||
      dbAssignment > 5 ||
      dbSeminar < 0 ||
      dbSeminar > 5
    ) {
      toast.error("Assignment and Seminar marks must be between 0 and 5");
      return;
    }

    try {
      toast.loading("Uploading...");
      const Internal_1Og = dbmark1;
      const Internal_2Og = dbmark2;
      const Internal_1 = dbmark1 / 2;
      const Internal_2 = dbmark2 / 2;
      const BothInternal = Math.round(Internal_1 + Internal_2);
      const TotalInternal = Math.round(BothInternal / 2);
      const NeetMark = Math.round(TotalInternal + dbAssignment + dbSeminar);

      const dbSetMark = doc(db, "student", IdSt);
      const dbCollection = doc(
        collection(dbSetMark, selectedSubject.semester),
        selectedSubject.subject
      );

      await setDoc(dbCollection, {
        Internal_1Og: Internal_1Og,
        Internal_2Og: Internal_2Og,
        Internal_1: Internal_1,
        Internal_2: Internal_2,
        BothInternal: BothInternal,
        TotalInternal: TotalInternal,
        NeetMark: NeetMark,
        Assignment: dbAssignment,
        Seminar: dbSeminar,
      });
      toast.dismiss()
      toast.success("Mark Successfully Complited");
    } catch (e) {
      toast.error(e.message);
    }
      }
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <header className="bg-primary text-light sticky-top py-3 px-4 d-flex justify-content-between align-items-center">
        <h6 className="mb-0">STAFF: {staffData?.staffName || "N/A"}</h6>
        <h6 className="mb-0">D-Code: {staffData?.DepartmentCode || "N/A"}</h6>
      </header>

      {/* Title */}
      <div className="text-center my-4">
        <h2 className="text-uppercase text-primary fw-bold">Mark Entry</h2>
      </div>

      {/* Subject Info */}
      <div className="container mb-4">
        <div className="bg-primary text-light rounded p-3 text-center">
          <h5 className="text-uppercase mb-2">
            {selectedSubject?.department || "Department"}
          </h5>
          <p className="mb-1 fw-bold text-uppercase">
            Subject: {selectedSubject?.subject || "Subject"}
          </p>
          <p className="mb-1 fw-bold text-uppercase">
            Semester: {selectedSubject?.semester || "--"}
          </p>
          <p className="mb-1 fw-bold text-uppercase">
            Type: {selectedSubject?.TorL || "Theory/Lab"}
          </p>
          <div className="d-flex justify-content-around mt-3 flex-wrap">
            <p className="mb-0 fw-semibold text-uppercase">
              Class: {selectedSubject?.class || "-"}
            </p>
            <p className="mb-0 fw-semibold text-uppercase">
              Year: {selectedSubject?.year || "-"}
            </p>
            <p className="mb-0 fw-semibold text-uppercase">
              Degree: {selectedSubject?.ugorpg || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="container">
        <h3 className="text-center text-primary text-uppercase mb-4">
          Student List
        </h3>
        <div className="row g-4">
          {students.length > 0 ? (
            students.map((student) => (
              <div className="col-12 col-md-6 col-lg-4" key={student.id}>
                <div
                  className={
                    student.active
                      ? "card shadow-sm border-0 h-100"
                      : "card shadow-sm border-2 border-danger opacity-50 "
                  }
                >
                  <div className="card-header bg-white d-flex justify-content-center align-items-center border-bottom">
                    {!student.active ? (
                      <h3 className="h5 text-uppercase text-danger ">
                        Don't Enter Mark
                      </h3>
                    ) : (
                      <div className="w-100">
                        <button className="btn btn-sm btn-outline-success">
                          Result
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title text-primary">{student.Name}</h5>
                    <p className="card-text fw-semibold">
                      Roll No: {student.rollno.toUpperCase()}
                    </p>
                    <p className="text-muted fs-5">
                      Subject: {selectedSubject?.subject}
                    </p>
                  </div>
                  {!student.active ? (
                    <h3 className="h3 text-uppercase text-danger text-center">
                      Non active Student
                    </h3>
                  ) : (
                    <div className="card-footer bg-white d-flex justify-content-between">
                      <button
                        className="btn btn-success btn-sm px-3"
                        onClick={() => handleShowModal(student)}
                      >
                        Set Mark
                      </button>
                      <button className="btn btn-danger btn-sm px-3">
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">
              <h5 className="text-secondary">No students found.</h5>
            </div>
          )}
        </div>
      </div>

      <div className="container mt-5 py-5"></div>
      {/* Modal */}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          className="bg-primary text-light d-flex justify-content-center align-items-center fw-bold"
        >
          <Modal.Title className="text-center">Set Marks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent ? (
            <>
              <div className="d-flex justify-content-between align-items-center ">
                <p>
                  {" "}
                  <strong>Name: </strong> {selectedStudent.Name}{" "}
                </p>
                <p>
                  {" "}
                  <strong>Roll No: </strong>{" "}
                  {selectedStudent.rollno.toUpperCase()}{" "}
                </p>
              </div>

              {(selectedStudent.ugorpg == "ug" ? [1, 2] : [1, 2, 3]).map(
                (no) => {
                  const checkField = `check${no}`;
                  const markField = `mark${no}`;

                  return (
                    <div className="mt-3 mb-4" key={no}>
                      <label htmlFor="" className="text-uppercase fw-bold">
                        {no === 1
                          ? "Internal - I"
                          : no === 2
                          ? "Internal - II"
                          : "Internal - III"}
                      </label>
                      <input
                        type={state[checkField] ? "text" : "number"}
                        className="form-control"
                        placeholder={`Internal - ${no}`}
                        value={state[markField]}
                        onChange={(e) =>
                          dispatch({
                            field: markField,
                            value: e.target.value,
                          })
                        }
                        disabled={state[checkField]}
                        min={0}
                        max={30}
                      />
                      <div className="form-check mt-2">
                        <input
                          type="checkbox"
                          id={checkField}
                          className="form-check-input"
                          name={checkField}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            dispatch({ field: checkField, value: isChecked });
                            dispatch({
                              field: markField,
                              value: isChecked ? "Absent" : "",
                            });
                          }}
                          checked={state[checkField]}
                        />
                        <label
                          htmlFor={checkField}
                          className="fw-semibold ms-2 text-danger"
                          style={{ letterSpacing: "3px" }}
                        >
                          Absent
                        </label>
                      </div>
                    </div>
                  );
                }
              )}

              {[1, 2].map((no) => {
                return (
                  <div className={no == 1 ? "" : "mt-4"} key={no}>
                    <label
                      htmlFor={no == 1 ? "Assignment" : "Seminar"}
                      className="fw-bold text-uppercase"
                      style={{ letterSpacing: "2px" }}
                    >
                      {" "}
                      {no == 1 ? "Assignment" : "Seminar"}{" "}
                    </label>
                    <input
                      type="number"
                      id={no == 1 ? "Assignment" : "Seminar"}
                      className="form-control"
                      placeholder={no == 1 ? "Assignment" : "Seminar"}
                      name={no == 1 ? "Assignment" : "Seminar"}
                      onChange={(e) => {
                        dispatch({
                          field: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      value={no == 1 ? state.Assignment : state.Seminar}
                      max={5}
                      min={0}
                    />
                  </div>
                );
              })}
              <div className="d-flex justify-content-around mt-3">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    SubmiteSubjectMark(selectedStudent.id);
                  }}
                >
                  Save
                </Button>
              </div>
            </>
          ) : (
            <p>Loading student data...</p>
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default MarkEntry;
