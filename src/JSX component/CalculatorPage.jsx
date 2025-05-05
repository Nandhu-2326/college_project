
import CollegeLogo from "./CollegeLogo";
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlineSystemUpdateAlt } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";

const CalculatorPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Edit</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Nanda Kumar</td>
                <td>22UCS138</td>
                <td>
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleShow}
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
                placeholder="Enter student name"
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Roll Number</label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder="Enter roll number"
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Department</label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder="Enter department"
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
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Assignment Mark</label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder="Enter assignment mark"
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-semibold">Seminar Mark</label>
              <input
                type="text"
                className="form-control border-primary"
                placeholder="Enter seminar mark"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant=" btn btn-outline-danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="btn btn-outline-primary" onClick={handleClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CalculatorPage;

