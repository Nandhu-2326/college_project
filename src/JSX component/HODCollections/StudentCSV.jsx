import { useState } from "react";
import { BsUpload } from "react-icons/bs";
import { db } from "../Database";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const StudentCSV = () => {
  const nav = useNavigate();
  const [csvfile, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const InformationError = () => {
    Swal.fire({
      html: "Please select a CSV file",
      timer: 1000,
      icon: "warning",
      showConfirmButton: false,
    });
  };

  const loading = () => {
    Swal.fire({
      html: "Uploading...",
      timer: 5000,
      timerProgressBar: true,
      didOpen: () => Swal.showLoading(),
    });
  };

  const UserAdd = () => {
    Swal.fire({
      icon: "success",
      title: "✅ CSV File Uploaded",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const convertToBoolean = (value) => {
    const lower = value.toLowerCase();
    if (lower === "true") return true;
    if (lower === "false") return false;
    return value; // return as-is if not true/false
  };

  const handleUpload = async () => {
    if (!csvfile) {
      InformationError();
      return;
    }

    try {
      loading();
      const reader = new FileReader();
      reader.readAsText(csvfile);
      reader.onload = async (e) => {
        const text = e.target.result;
        const rows = text.trim().split("\n");
        const headers = rows[0].split(",").map((h) => h.trim());

        for (let i = 1; i < rows.length; i++) {
          const values = rows[i].split(",").map((val) => val.trim());
          const data = {};

          headers.forEach((key, index) => {
            const value = values[index];
            const lowerKey = key.toLowerCase();

            if (lowerKey === "year") {
              const num = parseInt(value);
              data[key] = isNaN(num) ? value : num;
            } else if (lowerKey === "active") {
              data[key] = convertToBoolean(value);
            } else {
              data[key] = value;
            }
          });

          await addDoc(collection(db, "student"), data);
        }

        UserAdd();
        console.log("Upload success:", csvfile.name);
      };
    } catch (err) {
      console.error("Upload failed:", err.message);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center container align-items-center mt-2 mb-5">
      <div className="container p-3 d-flex justify-content-start align-items-center">
        <button
          className="btn text-primary border-0 fs-4"
          onClick={() => nav("/HODLayout/StaffDetails")}
        >
          <FaArrowLeftLong /> Back
        </button>
      </div>

      <div
        className="card p-4 shadow-lg rounded-4 w-100"
        style={{ maxWidth: "500px" }}
      >
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
          <div className="alert alert-success fw-semibold">
            ✅ Selected: {csvfile.name}
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

export default StudentCSV;
