import React, { useEffect, useReducer, useState } from "react";
import { db } from "../Database";
import { collection, getDocs } from "firebase/firestore";

const SubjectAlert = () => {
  const [StaffData, setStaffData] = useState([]);
  const [hodData, setHOD] = useState("");
  const [SubjectData, setSubjectData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  let { Department, HODName, ugorpg, rs, DepartmentCode } = hodData;

  const fetchDataFromBrowser = () => {
    const StaffDetails = sessionStorage.getItem("staff");
    const StaffDatas = JSON.parse(StaffDetails);
    setStaffData(StaffDatas);
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    setHOD(HODdata);
    fetchSubjectDepartmentData();
  };
  const fetchSubjectDepartmentData = async () => {
    const getSub = await getDocs(collection(db, "Subject"));
    const getData = getSub.docs.flatMap((doc) => Object.values(doc.data()));
    setSubjectData(getData);
    const getDep = await getDocs(collection(db, "Departments"));
    const getDepData = getDep.docs.flatMap((doc) => Object.values(doc.data()));
    setDepartmentData(getDepData);
  };

  const reducer = (state, action) => {
    return {
      ...state,
      [action.field]: action.value,
    };
  };

  const stateObject = {
    subject: "",
    year: "",
    department: "",
    class: "",
  };

  const [state, dispatch] = useReducer(reducer, stateObject);
  const AddStaffData = () => {
    
  };
  useEffect(() => {
    fetchDataFromBrowser();
  }, []);

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center p-3">
        <p className="fw-semibold m-0"> HOD : {HODName}</p>
        <p className="fw-semibold m-0">Department : {Department?.slice(14)}</p>
      </div>

      <div className="container mt-5 ">
        <div className="row mb-5 justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-primary ">
              <div className="card-header bg-primary  text-light text-center text-uppercase fw-bold fs-6">
                Subject Alert <br />
                for <br />
                {StaffData.staffName}
              </div>

              <div className="card-body p-4">
                <div className="row">
                  {[1, 2, 3, 4].map((doc) => {
                    return (
                      <div className="col-md-6 mt-3" key={doc}>
                        <label
                          htmlFor=""
                          className="text-uppercase text-primary fw-semibold mb-2"
                        >
                          {doc === 1
                            ? "Select Subject"
                            : doc === 2
                            ? "Year"
                            : doc === 3
                            ? "Department"
                            : "Class"}
                        </label>

                        <select
                          name={
                            doc === 1
                              ? "subject"
                              : doc === 2
                              ? "year"
                              : doc === 3
                              ? "department"
                              : "class"
                          }
                          onChange={(e) => {
                            dispatch({
                              field: e.target.name,
                              value: e.target.value,
                            });
                          }}
                          className="form-select"
                        >
                          <option>
                            -- Select{" "}
                            {doc === 1
                              ? "Subject"
                              : doc === 2
                              ? "Year"
                              : doc === 3
                              ? "Department"
                              : "Class"}{" "}
                            --
                          </option>

                          {doc === 1 ? (
                            <>
                              {SubjectData &&
                                SubjectData.map((doc) => {
                                  return <option value={doc}> {doc} </option>;
                                })}
                            </>
                          ) : doc === 2 ? (
                            <>
                              {[1, 2, 3].map((no) => {
                                return <option value={no}> {no} </option>;
                              })}
                            </>
                          ) : doc === 3 ? (
                            <>
                              {DepartmentData &&
                                DepartmentData.map((doc) => {
                                  return <option value={doc}> {doc} </option>;
                                })}
                            </>
                          ) : (
                            <>
                              <option value="A">A</option>
                              <option value="B">B</option>
                            </>
                          )}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card-footer  d-flex justify-content-center p-3">
                <button
                  className="btn btn-primary text-uppercase mb-3 px-4 py-2"
                  style={{ letterSpacing: "2px" }}
                >
                  Save Subject Alert
                </button>
              </div>

              <div className="container mb-5">
                <div className="table-responsive">
                  <table className="table table-danger">
                    <thead>
                      <tr className="text-uppercase">
                        <th>s.no</th>
                        <th>subject</th>
                        <th>Department</th>
                        <th>Year</th>
                        <th>delete</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubjectAlert;
