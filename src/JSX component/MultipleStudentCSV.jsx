import { useState } from "react";
import { BsUpload } from "react-icons/bs";

const MultipleStudentCSV = () => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }
    // Handle your upload logic here
    console.log("Uploading:", file.name);
  };

  return (
    <div className="d-flex  justify-content-center align-items-center bg-light">
      <div className="card p-5 shadow-lg rounded-4">
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

        {file && (
          <div className="alert alert-success ">
            <strong>Selected:</strong> {file.name}
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
