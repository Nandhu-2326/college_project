import CollegeLogo from "./CollegeLogo";
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "./Database.js";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";

const CalculatorPage = () => {
  const [Modals, setModal] = useState(true);
  const [show, setShow] = useState(false);
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

  const handleClose = () => {
    setShow(false);
    setSelectedStudent(null);
    setInternal_1Up(null);
    setInternal_2Up(null);
    setAssignmentUp(null);
    setSeminarUp(null);
  };
  const handleShow = (student) => {
    setSelectedStudent(student);
    setShow(true);
    setModal(true);
  };
  const UpdateStudent = async (id) => {
    console.log(id);
    setShow(true);
    setModal(false);
    const Update = doc(db, "student", id);
    const GetCollection = collection(Update, sub);
    const GetValue = await getDocs(GetCollection);
    const IdCollection = GetValue.docs.map((doc) => ({
      ...doc.data(),
    }));
    console.log(IdCollection);
    console.log(GetCollection)
    IdCollection.map((value) => {
      if (deg == "pg") {
        setInternal_1Up(value.InternalDB_1);
        setInternal_2Up(value.InternalDB_2);
        setInternal_3Up(value.InternalDB_3);
        setAssignmentUp(value.AssignmentMark);
        setSeminarUp(value.SeminarMark);
      } else {
        setInternal_1Up(value.InternalDB_1);
        setInternal_2Up(value.InternalDB_2);
        setAssignmentUp(value.AssignmentMark);
        setSeminarUp(value.SeminarMark);
      }
    });
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

        <div className="row g-4">
          {studentList.length > 0 ? (
            studentList.map((student, index) => (
              <div className="col-md-6 col-lg-4" key={student.id}>
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
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleShow(student)}
                      >
                        <BiSolidEdit /> Enter Mark
                      </button>
                      <button
                        className="btn btn-outline-danger"
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

      {/* Modal */}
      {Modals ? (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title className="w-100 text-center">
              Fill Student Mark
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
                <label className="form-label fw-semibold">Subject</label>
                <input
                  type="text"
                  className="form-control border-primary"
                  defaultValue={sub}
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
                  onChange={(e) => setInternal_1(e.target.value)}
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
                  onChange={(e) => setInternal_2(e.target.value)}
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
                  onChange={(e) => setInternal_3(e.target.value)}
                  disabled={deg !== "pg"}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Assignment Mark
                </label>
                <input
                  type="text"
                  className="form-control border-primary"
                  placeholder="Enter assignment mark"
                  onChange={(e) => setAssignment(e.target.value)}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Seminar Mark</label>
                <input
                  type="text"
                  className="form-control border-primary"
                  placeholder="Enter seminar mark"
                  onChange={(e) => setSeminar(e.target.value)}
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
              onClick={() => Calculate(selectedStudent)}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title className="w-100 text-center">Update Mark</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">Student Name</label>
                <input
                  type="text"
                  className="form-control border-primary"
                  readOnly
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Roll Number</label>
                <input
                  type="text"
                  className="form-control border-primary"
                  readOnly
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Department</label>
                <input
                  type="text"
                  className="form-control border-primary"
                  readOnly
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Subject</label>
                <input
                  type="text"
                  className="form-control border-primary"
                  defaultValue={sub}
                  readOnly
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Internal - I Mark
                </label>
                <input
                  type="number"
                  className="form-control border-primary"
                  placeholder="Enter Internal - I mark"
                  value={Internal_1Up}
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
                  value={Internal_2Up}
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
                  value={Internal_3Up}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Assignment Mark
                </label>
                <input
                  type="number"
                  className="form-control border-primary"
                  placeholder="Enter assignment mark"
                  value={AssignmentUp}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Seminar Mark</label>
                <input
                  type="number"
                  className="form-control border-primary"
                  placeholder="Enter seminar mark"
                  value={SeminarUp}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="btn btn-outline-danger" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="btn btn-outline-success"
              // onClick={() => }
            >
              Update Mark
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default CalculatorPage;
