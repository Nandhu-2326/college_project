import CollegeLogo from "./CollegeLogo";
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "./Database.js";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

const CalculatorPage = () => {
  const [show, setShow] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [Internal_1, setInternal_1] = useState();
  const [Internal_2, setInternal_2] = useState();
  const [Internal_3, setInternal_3] = useState();
  const [Assignment, setAssignment] = useState();
  const [Seminar, setSeminar] = useState();
  // const [id, setId ] = useState()
  const handleClose = () => {
    setShow(false);
    setSelectedStudent(null);
  };

  const handleShow = (student) => {
    setSelectedStudent(student);
    setShow(true);
    // setId(id)
  };

  const location = useLocation();
  const { dep, sem, sub, deg } = location.state;

  const getFilteredStudents = async () => {
    try {
      const getData = await getDocs(collection(db, "student"));
      const filteredData = getData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filter = filteredData.filter((val) => {
        return val.Department == dep && val.year == sem;
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
      timer: 1000,
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
      if (!Internal_1 || !Internal_2 || !Assignment || !Seminar) {
        Swal.fire("Error", "Please enter valid numeric values", "error");
        return;
      } else {
        const array = [Internal_1, Internal_2, Internal_3];
        var temp = 0;
        for (var i = 0; i < array.length; i++) {
          for (var j = 0; j <= array.length; j++) {
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
        console.log(PGTotal);
        const studentId = selectedStudent.id;
        const studentRef = doc(db, "student", studentId);
        const resultRef = collection(studentRef, sub); // subcollection
        await addDoc(resultRef, {
          subject: sub,
          InternalDB_1: I1,
          InternalDB_2: I2,
          AssignmentMark: Assignment,
          SeminarMark: Seminar,
          Average: PGMark,
          Total: PGTotal,
        });
      }
    } else {
      if (!Internal_1 || !Internal_2 || !Assignment || !Seminar) {
        Swal.fire("Error", "Please enter valid numeric values", "error");
        return;
      } else {
        const InternalMark_1 = Number(Internal_1) / 2;
        const InternalMark_2 = Number(Internal_2) / 2;
        const Mark = (Number(InternalMark_1) + Number(InternalMark_2)) / 2;
        const total = Number(Mark) + Number(Assignment) + Number(Seminar);
        console.log(total);
        const studentId = selectedStudent.id;
        const studentRef = doc(db, "student", studentId);
        const resultRef = collection(studentRef, sub); // subcollection
        await addDoc(resultRef, {
          subject: sub,
          InternalDB_1: InternalMark_1,
          InternalDB_2: InternalMark_2,
          AssignmentMark: Assignment,
          SeminarMark: Seminar,
          Average: Mark,
          Total: total,
        });
        alert("Calculation Success");
      }
    }
    handleClose();
  };

  return (
    <>
      <CollegeLogo />
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Student Details List</h2>
        </div>

        <div className="table-responsive shadow-sm">
          <table className="table table-bordered table-hover table-striped align-middle text-center">
            <thead className="table-primary">
              <tr className="">
                <th>S.No</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Subject</th>
                <th>Student Mark</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {studentList.length > 0 ? (
                studentList.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.Name}</td>
                    <td>{student.rollno.toUpperCase()}</td>
                    <td>{sub} </td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleShow(student)}
                      >
                        <BiSolidEdit />
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-outline-success">
                        <MdOutlineSystemUpdateAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-muted">
                    No students found for the selected department and semester.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title className="w-100 text-center">
            Fill Student Marks
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-semibold">Student Name</label>
              <input
                type="text"
                className="form-control border-primary"
                defaultValue={selectedStudent?.Name}
                readOnly
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Roll Number</label>
              <input
                type="text"
                className="form-control border-primary"
                defaultValue={selectedStudent?.rollno.toUpperCase()}
                readOnly
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Department</label>
              <input
                type="text"
                className="form-control border-primary"
                defaultValue={selectedStudent?.Department}
                readOnly
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">
                Internal - I Mark
              </label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder="Enter Internal - I mark"
                onChange={(e) => {
                  setInternal_1(e.target.value);
                }}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">
                Internal - II Mark
              </label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder="Enter Internal - II mark"
                onChange={(e) => {
                  setInternal_2(e.target.value);
                }}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">
                Internal - III Mark
              </label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder="Enter Internal - III mark"
                onChange={(e) => {
                  setInternal_3(e.target.value);
                }}
                disabled={deg !== "pg"}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Assignment Mark</label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder="Enter assignment mark"
                onChange={(e) => {
                  setAssignment(e.target.value);
                }}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Seminar Mark</label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder="Enter seminar mark"
                onChange={(e) => {
                  setSeminar(e.target.value);
                }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-outline-danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="btn btn-outline-primary"
            onClick={() => {
              Calculate(selectedStudent);
            }}
          >
            submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CalculatorPage;
