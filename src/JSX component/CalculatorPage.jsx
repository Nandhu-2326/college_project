import CollegeLogo from "./CollegeLogo";
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { use, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "./Database.js";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { GiSpellBook } from "react-icons/gi";
import Footer from "./Footer.jsx";

const CalculatorPage = () => {
  const [Modals, setModal] = useState(true);
  const [show, setShow] = useState(false);
  const [result, setResult] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  // Studan Mark
  const [Internal_1, setInternal_1] = useState();
  const [Internal_2, setInternal_2] = useState();
  const [Internal_3, setInternal_3] = useState();
  const [Assignment, setAssignment] = useState();
  const [Seminar, setSeminar] = useState();

  // Update Mark
  const [Internal_1Up, setInternal_1Up] = useState();
  const [Internal_2Up, setInternal_2Up] = useState();
  const [Internal_3Up, setInternal_3Up] = useState();
  const [AssignmentUp, setAssignmentUp] = useState();
  const [SeminarUp, setSeminarUp] = useState();
  const [stName, setStName] = useState();
  const [stDep, setStDep] = useState();
  const [stNumber, setStNumber] = useState();
  const [UpDataId, setUpDateId] = useState();
  // Result Data
  const [ResultData, setResultData] = useState();
  const [studentResulstData, setStudentResultData] = useState([]);
  // function's
  const location = useLocation();
  const { dep, sem, sub, deg, sec } = location.state;
  const handleClose = () => {
    setShow(false);
    setResult(false);
    setSelectedStudent(null);
    setInternal_1Up(null);
    setInternal_2Up(null);
    setInternal_3Up(null);
    setAssignmentUp(null);
    setSeminarUp(null);
  };

  const handleShow = (student) => {
    setSelectedStudent(student);
    setShow(true);
    setModal(true);
  };

  const UpdateStudent = async (id) => {
    try {
      loading();
      setShow(true);
      setModal(false); // Switching to Update Mode
      setUpDateId(id);
      const studentRef = doc(db, "student", id);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        const studentData = studentSnap.data();
        setStName(studentData.Name);
        setStDep(studentData.Department);
        setStNumber(studentData.rollno.toUpperCase());
      } else {
        Swal.fire("Error", "Student not found", "error");
        return;
      }

      const subjectCollection = collection(studentRef, sub);
      const marksSnap = await getDocs(subjectCollection);

      if (!marksSnap.empty) {
        const markDoc = marksSnap.docs[0].data(); // Assuming one record per subject

        // Set form values for update
        if (deg == "pg") {
          setInternal_1Up(markDoc.InternalDB_1);
          setInternal_2Up(markDoc.InternalDB_2);
          setInternal_3Up(markDoc.InternalDB_3);
          setAssignmentUp(markDoc.AssignmentMark);
          setSeminarUp(markDoc.SeminarMark);
        } else {
          {
            setInternal_1Up(markDoc.InternalDB_1);
            setInternal_2Up(markDoc.InternalDB_2);
            setAssignmentUp(markDoc.AssignmentMark);
            setSeminarUp(markDoc.SeminarMark);
          }
        }
      } else {
        Swal.fire("Info", "No mark data found for this subject", "info");
      }
    } catch (error) {
      console.error("Error fetching student marks:", error);
      Swal.fire("Error", "Failed to load marks", "error");
    }
  };

  const warning = () => {
    Swal.fire({
      title: "Oops",
      icon: "error",
      html: "Please Enter All Field",
      timer: 2000,
      timerProgressBar: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  const UpDBdata = async () => {
    if (deg == "pg") {
      if (
        !Internal_1Up ||
        !Internal_2Up ||
        !Internal_3Up ||
        !AssignmentUp ||
        !SeminarUp
      ) {
        warning();
      } else {
        loading();
        const studentRef = doc(db, "student", UpDataId);
        const subjectCollectionRef = collection(studentRef, sub);
        const marksSnap = await getDocs(subjectCollectionRef);

        if (marksSnap.empty) {
          Swal.fire(
            "Error",
            "No existing mark document found to update",
            "error"
          );
          return;
        }
        const markDoc = marksSnap.docs[0];
        const markRef = markDoc.ref;

        const array = [Internal_1Up, Internal_2Up, Internal_3Up];
        let temp = 0;
        for (let i = 0; i < array.length; i++) {
          for (let j = 0; j <= array.length; j++) {
            if (array[i] > array[j]) {
              temp = array[i];
              array[i] = array[j];
              array[j] = temp;
            }
          }
        }
        const I1 = array[0] / 2;
        const I2 = array[1] / 2;
        const PGMark = (I1 + I2) / 2;
        const PGTotal =
          Number(PGMark) + Number(AssignmentUp) + Number(SeminarUp);

        await updateDoc(markRef, {
          subject: sub,
          InternalDB_1: I1,
          InternalDB_2: I2,
          InternalDB_3: Internal_3Up,
          AssignmentMark: AssignmentUp,
          SeminarMark: SeminarUp,
          Average: PGMark,
          Total: Math.round(PGTotal),
        });
        Swal.fire("Success", "Marks updated successfully", "success");
        handleClose();
      }
    } else {
      if (!Internal_1Up || !Internal_2Up || !AssignmentUp || !SeminarUp) {
        warning();
      } else {
        const studentRef = doc(db, "student", UpDataId);
        const subjectCollectionRef = collection(studentRef, sub);
        const marksSnap = await getDocs(subjectCollectionRef);

        if (marksSnap.empty) {
          Swal.fire(
            "Error",
            "No existing mark document found to update",
            "error"
          );
          return;
        }
        const markDoc = marksSnap.docs[0];
        const markRef = markDoc.ref;

        const I1 = Number(Internal_1Up) / 2;
        const I2 = Number(Internal_2Up) / 2;
        const average = (I1 + I2) / 2;
        const total = average + Number(AssignmentUp) + Number(SeminarUp);

        await updateDoc(markRef, {
          subject: sub,
          InternalDB_1: I1,
          InternalDB_2: I2,
          AssignmentMark: AssignmentUp,
          SeminarMark: SeminarUp,
          Average: average,
          Total: Math.round(total),
        });
        Swal.fire("Success", "Marks updated successfully", "success");
        handleClose();
      }
    }
    getFilteredStudents();
  };

  const getFilteredStudents = async () => {
    try {
      const getData = await getDocs(collection(db, "student"));
      const filteredData = getData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filter = filteredData.filter((val) => {
        return val.Department == dep && val.year == sem && val.class == sec;
      });
      setStudentList(filter);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      Swal.fire("Error", "Failed to load students", "error");
    }
  };

  const loading = () => {
    Swal.fire({
      html: "Loading...",
      timer: 2000,
      timerProgressBar: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  useEffect(() => {
    loading();
    getFilteredStudents();
  }, [dep, sem]);

  const Calculate = async (selectedStudent) => {
    if (deg == "pg") {
      if (
        !Internal_1 ||
        !Internal_2 ||
        !Assignment ||
        !Seminar ||
        !Internal_3
      ) {
        Swal.fire("Error", "Please enter valid numeric values", "error");
        return;
      } else {
        const array = [Internal_1, Internal_2, Internal_3];
        let temp = 0;
        for (let i = 0; i < array.length; i++) {
          for (let j = 0; j <= array.length; j++) {
            if (array[i] > array[j]) {
              temp = array[i];
              array[i] = array[j];
              array[j] = temp;
            }
          }
        }
        const I1 = array[0] / 2;
        const I2 = array[1] / 2;
        const PGMark = (I1 + I2) / 2;
        const PGTotal = Number(PGMark) + Number(Assignment) + Number(Seminar);
        const studentId = selectedStudent.id;
        const studentRef = doc(db, "student", studentId);
        const resultRef = collection(studentRef, sub);
        await addDoc(resultRef, {
          subject: sub,
          InternalDB_1: I1,
          InternalDB_2: I2,
          InternalDB_3: Internal_3,
          AssignmentMark: Assignment,
          SeminarMark: Seminar,
          Average: PGMark,
          Total: Math.round(PGTotal),
        });

        Swal.fire("Success", "Successfully Upload Student Mark's", "Success");
      }
    } else {
      if (!Internal_1 || !Internal_2 || !Assignment || !Seminar) {
        Swal.fire("Error", "Please enter valid numeric values", "error");
        return;
      } else {
        const InternalMark_1 = Number(Internal_1) / 2;
        const InternalMark_2 = Number(Internal_2) / 2;
        const Mark = (InternalMark_1 + InternalMark_2) / 2;
        const total = Mark + Number(Assignment) + Number(Seminar);
        const studentId = selectedStudent.id;
        const studentRef = doc(db, "student", studentId);
        const resultRef = collection(studentRef, sub);
        await addDoc(resultRef, {
          subject: sub,
          InternalDB_1: InternalMark_1,
          InternalDB_2: InternalMark_2,
          AssignmentMark: Assignment,
          SeminarMark: Seminar,
          Average: Mark,
          Total: Math.round(total),
        });
        Swal.fire("Success", "Successfully Upload Student Mark's", "Success");
      }
    }
    handleClose();
  };

  const viewResult = async (id) => {
    try {
      setResult(true);
      // Mark and Subject
      const ResultData = doc(db, "student", id);
      const DBFetch = collection(ResultData, sub);
      const ResultDB = await getDocs(DBFetch);
      const ResultAllData = ResultDB.docs.map((doc) => ({
        ...doc.data(),
      }));
      setResultData(ResultAllData);
      console.log(ResultAllData);
      // Student Details
      const studentRef = doc(db, "student", id);
      const studentSnap = await getDoc(studentRef);
      const studentAllData = studentSnap.data();
      setStudentResultData([studentAllData]);
      console.log(studentAllData);
    } catch (e) {
      alert("Error", e.message);
    }
  };
  return (
    <>
      <CollegeLogo />
      <div className="container mt-5 ">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Student Details List</h2>
        </div>

        <div className="row g-4 mb-5">
          {studentList.length > 0 ? (
            studentList.map((student) => (
              <div className="col-md-6 col-lg-4 " key={student.id}>
                <div className="card shadow-sm border-primary h-100 ">
                  <div className="card-body ">
                    <h5 className="card-title fw-bold text-primary">
                      {student.Name}
                    </h5>
                    <p className="card-text mb-1">
                      <strong>Roll No:</strong> {student.rollno.toUpperCase()}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Department:</strong> {student.Department}
                    </p>
                    <p className="card-text mb-2">
                      <strong>Subject:</strong> {sub}
                    </p>
                    <div className="d-flex justify-content-between mt-3">
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleShow(student)}
                      >
                        <BiSolidEdit /> Enter Mark
                      </button>
                      <button
                        className="btn d-flex align-items-center btn-outline-info "
                        onClick={() => {
                          viewResult(student.id);
                        }}
                      >
                        <GiSpellBook /> Result
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => UpdateStudent(student.id)}
                      >
                        <MdOutlineSystemUpdateAlt /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-muted text-center">No students found.</div>
          )}
        </div>
      </div>
      <Modal show={result} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title className="w-100 text-center">
            Student Result
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ResultData && studentResulstData ? (
            <div>
              {studentResulstData.map((value) => (
                <div
                  key={value.id}
                  className="border border-3 border-info p-2 rounded"
                >
                  <p
                    className="text-center bg-primary text-white text-uppercase"
                    style={{ letterSpacing: "5px" }}
                  >
                    {" "}
                    Student Details
                  </p>
                  <p
                    className="text-primary fw-bold"
                    style={{ letterSpacing: "3px" }}
                  >
                    {value.Name.toUpperCase()}{" "}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Rollno </strong> :
                    {value.rollno.toUpperCase()}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Degree </strong> :
                    {value.ugorpg.toUpperCase()}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Department </strong> :
                    {value.Department}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> R / S </strong> :
                    {value.rs.toUpperCase()}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Year </strong> :
                    {value.year.toUpperCase()}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Class </strong> :
                    {value.class.toUpperCase()}
                  </p>
                </div>
              ))}
              {ResultData.map((value) => (
                <div
                  key={value.id}
                  className="border border-3 border-info p-2 rounded mt-2"
                >
                  <p
                    className="text-center bg-primary text-white text-uppercase"
                    style={{ letterSpacing: "5px" }}
                  >
                    {" "}
                    Mark Details
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Subject </strong> :
                    {value.subject}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Internal - I </strong> :
                    {value.InternalDB_1}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Internal - II </strong> :
                    {value.InternalDB_2}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Internal - III </strong> :
                    {deg == "pg" ? value.InternalDB_3 : "---"}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Assignment </strong> :
                    {value.AssignmentMark}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Seminar </strong> :
                    {value.SeminarMark}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Average </strong> :
                    {value.Average}
                  </p>
                  <p>
                    {" "}
                    <strong className="text-info"> Total </strong> :
                    {value.Total}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center text-primary">
              No Result, Please Enter Mark After Check Result
            </div>
          )}
        </Modal.Body>
      </Modal>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="w-100 text-center">
            {Modals ? "Fill Student Mark" : "Update Mark"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-semibold">Student Name</label>
              <input
                type="text"
                className="form-control border-primary"
                readOnly
                value={Modals ? selectedStudent?.Name : stName}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Roll Number</label>
              <input
                type="text"
                className="form-control border-primary"
                readOnly
                value={
                  Modals ? selectedStudent?.rollno.toUpperCase() : stNumber
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Department</label>
              <input
                type="text"
                className="form-control border-primary"
                readOnly
                value={Modals ? selectedStudent?.Department : stDep}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Subject</label>
              <input
                type="text"
                className="form-control border-primary"
                readOnly
                value={sub}
              />
            </div>

            {/* Internal Marks */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                Internal - I Mark
              </label>
              <input
                type="number"
                className="form-control border-primary"
                placeholder="Enter Internal - I mark"
                value={Modals ? Internal_1 : Internal_1Up}
                onChange={(e) =>
                  Modals
                    ? setInternal_1(e.target.value)
                    : setInternal_1Up(e.target.value)
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">
                Internal - II Mark
              </label>
              <input
                type="number"
                className="form-control border-primary"
                placeholder="Enter Internal - II mark"
                value={Modals ? Internal_2 : Internal_2Up}
                onChange={(e) =>
                  Modals
                    ? setInternal_2(e.target.value)
                    : setInternal_2Up(e.target.value)
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">
                Internal - III Mark
              </label>
              <input
                type="number"
                className="form-control border-primary"
                placeholder="Enter Internal - III mark"
                disabled={deg !== "pg"}
                value={Modals ? Internal_3 : Internal_3Up}
                onChange={(e) =>
                  Modals
                    ? setInternal_3(e.target.value)
                    : setInternal_3Up(e.target.value)
                }
              />
            </div>

            {/* Assignment and Seminar */}
            <div className="col-12">
              <label className="form-label fw-semibold">Assignment Mark</label>
              <input
                type="number"
                className="form-control border-primary"
                placeholder="Enter assignment mark"
                value={Modals ? Assignment : AssignmentUp}
                onChange={(e) =>
                  Modals
                    ? setAssignment(e.target.value)
                    : setAssignmentUp(e.target.value)
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Seminar Mark</label>
              <input
                type="number"
                className="form-control border-primary"
                placeholder="Enter seminar mark"
                value={Modals ? Seminar : SeminarUp}
                onChange={(e) =>
                  Modals
                    ? setSeminar(e.target.value)
                    : setSeminarUp(e.target.value)
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-outline-danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant={
              Modals ? "btn btn-outline-primary" : "btn btn-outline-success"
            }
            onClick={() => (Modals ? Calculate(selectedStudent) : UpDBdata())}
          >
            {Modals ? "Submit" : "Update Mark"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </>
  );
};

export default CalculatorPage;
