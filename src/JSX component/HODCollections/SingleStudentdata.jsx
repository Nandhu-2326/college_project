import { useEffect, useState } from "react";
import { db } from "../Database.js";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SingleStudentdata = () => {
  const nav = useNavigate();
  const [rollno, setRollno] = useState();
  const [ugorpg, setUgorpg] = useState();
  const [section, setSection] = useState();
  const [Departments, setDepartment] = useState();
  const [Year, setYear] = useState();
  const [rs, setRs] = useState();
  const [Name, setName] = useState();
  const [DepartmentData, setDepartmentData] = useState([]);
  const [Actives, setActives] = useState(true);
  const [Dob, setDob] = useState();
  const [PNumber, setPNumber] = useState();

  useEffect(() => {
    FetchDepartment();
  }, []);

  const FetchDepartment = async () => {
    const getDep = await getDocs(collection(db, "Departments"));
    const getDepData = getDep.docs.flatMap((doc) => Object.values(doc.data()));
    setDepartmentData(getDepData);
  };

  const Add = async () => {
    if (
      !rollno ||
      !ugorpg ||
      !section ||
      !Departments ||
      !Year ||
      !rs ||
      !Name ||
      !Actives ||
      !Dob ||
      !PNumber
    ) {
      return toast.error("Please fill All Requirement");
    } else {
      if (!PNumber) {
        return toast.error("Phone Number Not");
      } else if (PNumber.length > 10 || PNumber.length < 10) {
        return toast.error("Phone Number 10 Digite Only");
      }
      toast.loading("Please Wait");
      await addDoc(collection(db, "student"), {
        Department: Departments,
        Name: Name,
        class: section,
        rollno: rollno,
        rs: rs,
        ugorpg: ugorpg,
        year: Number(Year),
        active: Boolean(Actives),
        dob: Dob,
        PH: PNumber,
      });
      toast.dismiss();
      toast.success("Student Uploaded");
      setRollno("");
      setDepartment("");
      setName("");
      setRs("");
      setSection("");
      setUgorpg("");
      setYear("");
      setActives("");
      setDob("");
      setPNumber("");
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
      <div className="container py-5 mb-5">
        <div>
          <h4
            className="text-uppercase mb-4 text-center fw-bold"
            style={{ color: "rgb(29, 51, 208)" }}
          >
            Student Information Form
          </h4>

          <div className="row g-4">
            {/* UG / PG */}
            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                style={{ color: "rgb(29, 51, 208)" }}
              >
                UG / PG
              </label>
              <div className="input-group">
                <select
                  className="form-select"
                  onChange={(e) => {
                    setUgorpg(e.target.value);
                  }}
                  value={ugorpg}
                >
                  <option>-- Select UG or PG --</option>
                  <option value="ug">UG (Undergraduate)</option>
                  <option value="pg">PG (Postgraduate)</option>
                </select>
              </div>
            </div>

            {/* Class */}
            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                style={{ color: "rgb(29, 51,208)" }}
              >
                Class
              </label>
              <div className="input-group">
                <select
                  className="form-select"
                  onChange={(e) => {
                    setSection(e.target.value);
                  }}
                  value={section}
                >
                  <option>-- Select Class --</option>
                  <option value="A">Class A</option>
                  <option value="B">Class B</option>
                </select>
              </div>
            </div>

            {/* Department */}
            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                style={{ color: "rgb(29, 51,208)" }}
              >
                Department
              </label>
              <div className="input-group">
                <select
                  className="form-select"
                  onChange={(e) => {
                    setDepartment(e.target.value);
                  }}
                  value={Departments}
                >
                  <option>-- Select Department --</option>
                  {DepartmentData.length > 0 ? (
                    DepartmentData.map((doc) => {
                      return <option value={doc}> {doc} </option>;
                    })
                  ) : (
                    <option value="">No Department</option>
                  )}
                </select>
              </div>
            </div>

            {/* Year */}
            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                style={{ color: "rgb(29, 51,208)" }}
              >
                Year
              </label>
              <div className="input-group">
                <select
                  className="form-select"
                  onChange={(e) => {
                    setYear(e.target.value);
                  }}
                  value={Year}
                >
                  <option>-- Select Year --</option>
                  <option value="1">I Year</option>
                  <option value="2">II Year</option>
                  <option value="3">III Year</option>
                </select>
              </div>
            </div>

            {/* Self or Regular */}
            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                style={{ color: "rgb(29, 51,208)" }}
              >
                Self / Regular
              </label>
              <div className="input-group">
                <select
                  className="form-select"
                  onChange={(e) => {
                    setRs(e.target.value);
                  }}
                  value={rs}
                >
                  <option>-- Select Self or Regular --</option>
                  <option value="self">Self (SF)</option>
                  <option value="regular">Regular</option>
                </select>
              </div>
            </div>

            {/* Student Name */}
            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                style={{ color: "rgb(29, 51,208)" }}
              >
                Student Name
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Student Name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={Name}
                />
              </div>
            </div>

            {/* Roll Number */}
            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                style={{ color: "rgb(29, 51,208)" }}
              >
                Roll Number
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Roll Number"
                  onChange={(e) => {
                    setRollno(e.target.value.toUpperCase());
                  }}
                  value={rollno}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                style={{ color: "rgb(29, 51,208)" }}
              >
                Active or Not
              </label>
              <div className="input-group">
                <select
                  name=""
                  id=""
                  onChange={(e) => {
                    setActives(e.target.value);
                  }}
                  className="form-select"
                  value={Actives}
                >
                  <option value="">--select Active student --</option>
                  <option value={true}> Active </option>
                  <option value={false}> Non Active</option>
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                style={{ color: "rgb(29, 51,208)" }}
              >
                D.O.B
              </label>
              <div className="input-group">
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => {
                    setDob(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                style={{ color: "rgb(29, 51,208)" }}
              >
                Parent Phone Number
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Phone Number"
                  onChange={(e) => {
                    setPNumber(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-12 text-center mt-4">
              <button
                style={{ color: "white", background: "rgb(29, 51, 208)" }}
                className="btn  px-5 shadow-sm rounded"
                onClick={Add}
              >
                Add Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleStudentdata;
