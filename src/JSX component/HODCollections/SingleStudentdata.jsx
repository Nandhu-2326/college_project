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
      <div className="container py-4 mb-5">
        <div
          className="row justify-content-center"
          style={{ marginBottom: "100px" }}
        >
          <div className="col-lg-10">
            <div className="card border-2 rounded-4">
              <div
                className="card-header bg-gradient"
                style={{ background: "#d5181c" }}
              >
                <h4 className="text-uppercase text-center text-light fw-bold py-3 ">
                  Upload Student Information
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  {/* UG / PG */}
                  <div className="col-md-6">
                    <label className="form-label">UG / PG</label>
                    <select
                      className="form-select"
                      value={ugorpg}
                      onChange={(e) => setUgorpg(e.target.value)}
                    >
                      <option>-- Select UG or PG --</option>
                      <option value="ug">UG (Undergraduate)</option>
                      <option value="pg">PG (Postgraduate)</option>
                    </select>
                  </div>

                  {/* Class */}
                  <div className="col-md-6">
                    <label className="form-label">Class</label>
                    <select
                      className="form-select"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                    >
                      <option>-- Select Class --</option>
                      <option value="A">Class A</option>
                      <option value="B">Class B</option>
                    </select>
                  </div>

                  {/* Department */}
                  <div className="col-md-6">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={Departments}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option>-- Select Department --</option>
                      {DepartmentData.length > 0 ? (
                        DepartmentData.map((doc, idx) => (
                          <option key={idx} value={doc}>
                            {doc}
                          </option>
                        ))
                      ) : (
                        <option value="">No Department</option>
                      )}
                    </select>
                  </div>

                  {/* Year */}
                  <div className="col-md-6">
                    <label className="form-label">Year</label>
                    <select
                      className="form-select"
                      value={Year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option>-- Select Year --</option>
                      <option value="1">I Year</option>
                      <option value="2">II Year</option>
                      <option value="3">III Year</option>
                    </select>
                  </div>

                  {/* Self / Regular */}
                  <div className="col-md-6">
                    <label className="form-label">Self / Regular</label>
                    <select
                      className="form-select"
                      value={rs}
                      onChange={(e) => setRs(e.target.value)}
                    >
                      <option>-- Select Self or Regular --</option>
                      <option value="self">Self (SF)</option>
                      <option value="regular">Regular</option>
                    </select>
                  </div>

                  {/* Student Name */}
                  <div className="col-md-6">
                    <label className="form-label">Student Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Student Name"
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Roll Number */}
                  <div className="col-md-6">
                    <label className="form-label">Roll Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Roll Number"
                      value={rollno}
                      onChange={(e) => setRollno(e.target.value.toUpperCase())}
                    />
                  </div>

                  {/* Active */}
                  <div className="col-md-6">
                    <label className="form-label">Active or Not</label>
                    <select
                      className="form-select"
                      value={Actives}
                      onChange={(e) => setActives(e.target.value === "true")}
                    >
                      <option value="">-- Select Status --</option>
                      <option value="true">Active</option>
                      <option value="false">Non Active</option>
                    </select>
                  </div>

                  {/* DOB */}
                  <div className="col-md-6">
                    <label className="form-label">D.O.B</label>
                    <input
                      type="date"
                      className="form-control"
                      value={Dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>

                  {/* Parent Phone Number */}
                  <div className="col-md-6">
                    <label className="form-label">Parent Phone Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Phone Number"
                      value={PNumber}
                      onChange={(e) => setPNumber(e.target.value)}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 text-center mt-4">
                    <button
                      className="btn hodbtn px-5 py-2  rounded-pill"
                      onClick={Add}
                    >
                      Add Student
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleStudentdata;
