import { useState } from "react";
import { BsUpload } from "react-icons/bs";
import { db } from "../Database.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

const MultipleStudentCSV = () => {
  const [csvfile, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };
  const InformationError = () => {
    Swal.fire({
      html: "Please Fill Information",
      timer: 1000,
      icon: "warning",
      showConfirmButton: false,
    });
  };

  const loading = () => {
    Swal.fire({
      html: "Loading...",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => Swal.showLoading(),
    });
  };

  const UserAdd = () => {
    Swal.fire({
      icon: "success",
      title: "CSV File Upload",
      timer: 2000,
      showConfirmButton: false,
    });
  };
  const handleUpload = async () => {
    if (!csvfile) {
      InformationError();
      return;
    } else {
      try {
        loading();
        const reader = new FileReader();
        reader.readAsText(csvfile);
        reader.onload = async (e) => {
          const text = e.target.result;
          const rows = text.trim().split("\n");
          const headers = rows[0].split(",").map((head) => head.trim());

          for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(",").map((val) => val.trim());
            const data = {};
            headers.forEach((val, index) => {
              data[val] = values[index];
            });
            await addDoc(collection(db, "student"), data);
          }
          UserAdd();
          console.log("Uploading:", csvfile.name);
        };
      } catch (e) {
        console.log(e.message);
      }
    }
    // Handle your upload logic here
  };

  return (
    <div className="d-flex  justify-content-center align-items-center bg-light mb-5">
      <div className="card p-3 shadow-lg rounded-4">
        <h3 className="text-primary text-center fw-bold mb-4">
          📄 Upload CSV File
        </h3>

        <div className="mb-3">
          <label htmlFor="csvUpload" className="form-label fw-semibold">
            Select CSV File
          </label>
          <input
            className="form-control"
            type="file"
            id="csvUpload"
            accept=".csv"
            onChange={handleChange}
          />
        </div>

        {csvfile && (
          <div className="alert alert-success ">
            <strong>Selected:</strong> {csvfile.name}
          </div>
        )}

        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
          onClick={handleUpload}
        >
          <BsUpload />
          Upload
        </button>
      </div>
    </div>
  );
};

export default MultipleStudentCSV;
