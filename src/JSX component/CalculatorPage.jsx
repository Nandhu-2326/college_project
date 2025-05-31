import CollegeLogo from "./CollegeLogo";
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";
import { db } from "./Database.js";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { GiSpellBook } from "react-icons/gi";
import Footer from "./Footer.jsx";
import { TiTick } from "react-icons/ti";

const CalculatorPage = () => {
  const nav = useNavigate();
  const [Modals, setModal] = useState(true);
  const [show, setShow] = useState(false);
  const [result, setResult] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [RightSymble, setRightSymble] = useState([]);
  // Studan Mark
  const [Internal_1, setInternal_1] = useState();
  const [Internal_2, setInternal_2] = useState();
  const [Internal_3, setInternal_3] = useState();
  const [Assignment, setAssignment] = useState();
  const [Seminar, setSeminar] = useState();
  const [semesterFinal, setSemesterFinal] = useState();

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
  const { dep, sem, sub, deg, sec, Year } = location.state;

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
      setModal(false); // Switch to update mode
      setUpDateId(id);

      if (!semesterFinal || !sub) {
        Swal.fire("Error", "Semester or Subject not selected", "error");
        return;
      }

      // 1. Fetch student basic info
      const studentRef = doc(db, "student", id);
      const studentSnap = await getDoc(studentRef);
      if (!studentSnap.exists()) {
        Swal.fire("Error", "Student not found", "error");
        return;
      }

      const studentData = studentSnap.data();
      setStName(studentData.Name || "");
      setStDep(studentData.Department || "");
      setStNumber((studentData.rollno || "").toUpperCase());

      // 2. Fetch marks from /student/{id}/{semesterFinal}/{sub}
      const subjectDoc = doc(db, "student", id);
      const studentDetailsSnap = collection(subjectDoc, semesterFinal);
      const getDatas = doc(studentDetailsSnap, sub);
      const markSnap = await getDoc(getDatas);

      console.log(markSnap);
      if (markSnap.empty) {
        Swal.fire("Info", "No mark data found for this subject", "info");
        handleClose();
        return;
      }

      // 3. Use first document (assuming one doc per subject)
      const markDoc = markSnap.data();
      console.log(markDoc);
      if (deg == "pg") {
        setInternal_1Up(markDoc.OrgId_1 || "");
        setInternal_2Up(markDoc.OrgId_2 || "");
        setInternal_3Up(markDoc.OrgId_3 || "");
        setAssignmentUp(markDoc.AssignmentMark || "");
        setSeminarUp(markDoc.SeminarMark || "");
      } else {
        setInternal_1Up(markDoc.OrgId_1 || "");
        setInternal_2Up(markDoc.OrgId_2 || "");
        setAssignmentUp(markDoc.AssignmentMark || "");
        setSeminarUp(markDoc.SeminarMark || "");
      }
    } catch (error) {
      handleClose();
      Swal.fire("warning", "Please Enter Mark After Check ", "warning");
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
    if (deg === "pg") {
      if (
        !Internal_1Up ||
        !Internal_2Up ||
        !Internal_3Up ||
        !AssignmentUp ||
        !SeminarUp
      ) {
        warning();
        return;
      }

      loading();

      const studentRef = doc(db, "student", UpDataId);
      const resultRef = collection(studentRef, semesterFinal);
      const markRef = doc(resultRef, sub);

      const marksSnap = await getDoc(markRef);
      if (!marksSnap.exists()) {
        Swal.fire(
          "Error",
          "No existing mark document found to update",
          "error"
        );
        handleClose();
        return;
      }

      // Sort top 2 internals
      const array = [
        Number(Internal_1Up),
        Number(Internal_2Up),
        Number(Internal_3Up),
      ];
      array.sort((a, b) => b - a); // Sort descending
      const I1 = array[0] / 2;
      const I2 = array[1] / 2;
      const PGMark = (I1 + I2) / 2;
      const PGTotal = PGMark + Number(AssignmentUp) + Number(SeminarUp);
      if (
        I1 <= 15 &&
        I2 <= 15 &&
        PGMark <= 15 &&
        PGTotal <= 25 &&
        AssignmentUp <= 5 &&
        SeminarUp <= 5
      ) {
        await updateDoc(markRef, {
          subject: sub,
          InternalDB_1: I1,
          InternalDB_2: I2,
          InternalDB_3: array[2],
          AssignmentMark: AssignmentUp,
          SeminarMark: SeminarUp,
          Average: PGMark,
          Total: Math.round(PGTotal),
        });
        success();
        handleClose();
      } else {
        alert(
          "Please Fill less than 30 and Assignment , seminary lessthan or equal 5"
        );
      }
    } else {
      if (!Internal_1Up || !Internal_2Up || !AssignmentUp || !SeminarUp) {
        warning();
        return;
      }

      const studentRef = doc(db, "student", UpDataId);
      const resultRef = collection(studentRef, semesterFinal);
      const markRef = doc(resultRef, sub);
      const marksSnap = await getDoc(markRef);

      if (!marksSnap.exists()) {
        success();
        handleClose();
        return;
      }

      const I1 = Number(Internal_1Up) / 2;
      const I2 = Number(Internal_2Up) / 2;
      const average = (I1 + I2) / 2;
      const total = average + Number(AssignmentUp) + Number(SeminarUp);
      if (
        I1 <= 15 &&
        I2 <= 15 &&
        average <= 15 &&
        AssignmentUp <= 5 &&
        SeminarUp <= 5 &&
        total <= 25
      ) {
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
      } else {
        alert(
          "Please Fill less than 30 and Assignment , seminary lessthan or equal 5"
        );
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
        return val.Department == dep && val.year == Year && val.class == sec;
      });
      console.log(filter);
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

  const semesterDetails = () => {
    console.log(sem);
    const semester = sem >= 1 && sem <= 6 ? `semester_${sem}` : null;
    setSemesterFinal(semester);
  };

  useEffect(() => {
    loading();
    getFilteredStudents();
    semesterDetails();
  }, [dep, sem, Year]);

  const InformationError = () => {
    Swal.fire({
      html: "Please Fill All Information",
      icon: "error",
      timer: 1000,
      timerProgressBar: false,
      didOpen: () => Swal.showLoading(),
    });
  };

  const success = () => {
    Swal.fire({
      html: "Success",
      icon: "success",
      timer: 1500,
      didOpen: () => Swal.showLoading(),
    });
  };

  const Calculate = async (selectedStudent) => {
    if (deg == "pg") {
      if (
        !Internal_1 ||
        !Internal_2 ||
        !Assignment ||
        !Seminar ||
        !Internal_3
      ) {
        InformationError();
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
        const resultRef = collection(studentRef, semesterFinal);
        const subCollections = doc(resultRef, sub);

        await setDoc(subCollections, {
          subject: sub,
          OrgId_1: Internal_1,
          OrgId_2: Internal_2,
          OrgId_3: Internal_3,
          InternalDB_1: I1,
          InternalDB_2: I2,
          InternalDB_3: Internal_3,
          AssignmentMark: Assignment,
          SeminarMark: Seminar,
          Average: PGMark,
          Total: Math.round(PGTotal),
        });
        handleClose();
        setRightSymble((prev) => [...prev, studentId]);
        setInternal_1(" ");
        setInternal_2(" ");
        setInternal_3(" ");
        setAssignment(" ");
        setSeminar(" ");
        success();
      }
    } else {
      if (!Internal_1 || !Internal_2 || !Assignment || !Seminar) {
        InformationError();
      } else {
        if (
          Internal_1 <= 30 &&
          Internal_2 <= 30 &&
          Assignment <= 5 &&
          Seminar <= 5
        ) {
          const InternalMark_1 = Number(Internal_1) / 2;
          const InternalMark_2 = Number(Internal_2) / 2;
          const Mark = (InternalMark_1 + InternalMark_2) / 2;
          const total = Mark + Number(Assignment) + Number(Seminar);
          const studentId = selectedStudent.id;
          const studentRef = doc(db, "student", studentId);
          const resultRef = collection(studentRef, semesterFinal);
          const subCollections = doc(resultRef, sub);

          await setDoc(subCollections, {
            subject: sub,
            OrgId_1: Internal_1,
            OrgId_2: Internal_2,
            InternalDB_1: InternalMark_1,
            InternalDB_2: InternalMark_2,
            AssignmentMark: Assignment,
            SeminarMark: Seminar,
            Average: Mark,
            Total: Math.round(total),
          });
          handleClose();
          setRightSymble((prev) => [...prev, studentId]);
          setInternal_1(" ");
          setInternal_2(" ");
          setInternal_3(" ");
          setAssignment(" ");
          setSeminar(" ");
          success();
        } else {
          alert("Please enter Below 30 or 5");
        }
      }
    }
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
        <div className="d-flex justify-content-end mb-4 ">
          <button
            className="btn btn-outline-success btn-sm "
            onClick={() => {
              nav("/CSVFile", {
                state: {
                  dep: dep,
                  sec: sec,
                  sub: sub,
                  sem: sem,
                  deg: deg,
                  Year: Year,
                },
              });
            }}
          >
            View Result's
          </button>
        </div>

        <div className="row mb-3 d-flex justify-content-center align-items-center">
          <div className="col-12 col-sm-5 ">
            <div className="input-group">
              <input
                type="text"
                placeholder="roll no"
                className="form-control"
                style={{ textTransform: "uppercase" }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value.toUpperCase())}
              />
              <span className="input-group-text bg-primary text-light">
                <FaUserGraduate />
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Student Details List</h2>
        </div>

        <div className="row g-4 mb-5">
          {studentList.filter((student) =>
            student.rollno.toUpperCase().includes(searchText)
          ).length > 0 ? (
            studentList
              .filter((student) =>
                student.rollno.toUpperCase().includes(searchText)
              )
              .map((student) => (
                <div
                  className="col-md-6 col-lg-4 mb-sm-5 mb-5"
                  key={student.id}
                >
                  <div className="card shadow-sm border-primary h-100">
                    <div className="card-body">
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
                        {RightSymble.includes(student.id) ? (
                          <TiTick fontSize={"30px"} color="green" />
                        ) : (
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleShow(student)}
                          >
                            <BiSolidEdit /> Enter Mark
                          </button>
                        )}

                        <button
                          className="btn d-flex align-items-center btn-outline-info"
                          onClick={() => viewResult(student.id)}
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
            <div className="text-center text-muted mt-3">
              No students found.
            </div>
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
