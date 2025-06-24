import { useState } from "react";
import { db } from "../Database";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
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
    <>
      <div
        style={{ backgroundColor: "rgb(26, 51, 208)", overflowX: "hidden" }}
        className="container-fluid  bg-gradient text-light sticky-top p-2 "
      >
        <div className="row ">
          <div className="col-2 text-sm-end">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/HODLayout/StaffDetails");
              }}
            >
              <img src="/back.png" width={25} alt="" className="img img-flui" />
            </button>
          </div>
        </div>
      </div>
      <div className="container d-flex justify-content-center align-items-center">
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
            style={{ backgroundColor: "rgb(26, 51, 208)", color: "white" }}
            className="btn border-0 w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
            onClick={handleUpload}
          >
            <img src="/upload.png" width={25} alt="" className="img img-flui" />
            Upload
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentCSV;
