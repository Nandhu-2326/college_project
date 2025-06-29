import { useState } from "react";
import { db } from "../Database";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const StudentCSV = () => {
  const nav = useNavigate();
  const [csvfile, setFile] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const convertToBoolean = (value) => {
    const lower = value.toLowerCase();
    if (lower === "true") return true;
    if (lower === "false") return false;
    return value; // return as-is if not true/false
  };

  const handleUpload = async () => {
    if (!csvfile) {
      toast.error("Please Select File");
      return;
    }

    try {
      toast.loading("Please Wait ");
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
        toast.dismiss();
        toast.success("successfully Uploaded");
      };
    } catch (err) {
      toast.error("Upload Faild");
    }
  };

  return (
    <>
      <div
        style={{ background: "#d5181c", overflowX: "hidden" }}
        className="container-fluid d-md-none bg-gradient text-light sticky-top p-1 "
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

      <div className="container d-none d-md-block">
        <div className="row  d-flex align-items-center">
          <div className="col-2">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/HODLayout/StaffDetails");
              }}
            >
              <img
                src="/arrow-left.png"
                width={25}
                alt=""
                className="img img-flui"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="container " style={{ width: "90%" }}>
        <div className="row d-flex justify-content-center align-items-center mt-3">
          <div className="col-12 col-md-5 col-lg-4 ">
            <div
              className="card p-4 border border-2 rounded-4 w-100"
              style={{ maxWidth: "500px" }}
            >
              <div className="d-flex align-items-center justify-content-center text-uppercase fw-bold mb-4">
                <img
                  src="/upload.png"
                  width={40}
                  alt=""
                  className="img img-fluid"
                />
                <h5 className="mt-2" style={{ color: "rgb(26, 51, 208)" }}>
                  Upload CSV file
                </h5>
              </div>

              <div className="mb-3">
                <label
                  htmlFor="csvUpload"
                  style={{ color: "rgb(26, 51, 208)" }}
                  className="form-label fw-semibold"
                >
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
                  <img
                    src="/check-mark.png"
                    width={20}
                    alt=""
                    className="img img-fluid"
                  />{" "}
                  Selected: {csvfile.name}
                </div>
              )}

              <button
                style={{ backgroundColor: "rgb(26, 51, 208)", color: "white" }}
                className="btn border-0 w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
                onClick={handleUpload}
              >
                <img
                  src="/upload.png"
                  width={25}
                  alt=""
                  className="img img-flui"
                />
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentCSV;
