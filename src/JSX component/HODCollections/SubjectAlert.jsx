import React, { useEffect, useReducer, useState } from "react";
import { db } from "../Database";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { ThreeDot } from "react-loading-indicators";
import { showWarning } from "../SweetAlert";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const SubjectAlert = () => {
  const [isLoading, setisLoading] = useState(false);
  const [StaffData, setStaffData] = useState([]);
  const [hodData, setHOD] = useState("");
  const [SubjectData, setSubjectData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [SavedSubjects, setSavedSubjects] = useState([]);

  const nav = useNavigate();
  let { Department, HODName } = hodData;
  const { id } = StaffData;

  const YEAR_OPTIONS = [1, 2, 3];
  const CLASS_OPTIONS = ["A", "B"];

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

  const fetchSavedSubjects = async () => {
    const getCollection = collection(db, "Allstaffs", id, "subject");
    const getSubjectData = await getDocs(getCollection);
    const fetchdata = getSubjectData.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setSavedSubjects(fetchdata);
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
    TorL: "",
    ugorpg: "",
    rs: "",
    semester: "",
  };

  const [state, dispatch] = useReducer(reducer, stateObject);
  console.log(state);
  const AddStaffData = async () => {
    if (
      !state.subject ||
      !state.year ||
      !state.department ||
      !state.class ||
      !state.TorL ||
      !state.ugorpg ||
      !state.rs ||
      !state.semester
    ) {
      showWarning("Please fill all required fields!");
    } else {
      try {
        setisLoading(true);
        const fetchStaff = doc(db, "Allstaffs", id);
        const CreateCollection = doc(
          collection(fetchStaff, "subject"),
          state.subject
        );
        await setDoc(CreateCollection, {
          subject: state.subject,
          year: state.year,
          department: state.department,
          class: state.class,
          TorL: state.TorL,
          ugorpg: state.ugorpg,
          rs: state.rs,
          semester: state.semester,
        });
        toast.success("Subject saved successfully!");
        for (let staffOb in stateObject) {
          dispatch({ field: staffOb, value: "" });
        }
        fetchSavedSubjects();
      } catch (e) {
        toast.error("Error saving subject.");
      } finally {
        setisLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDataFromBrowser();
  }, []);

  useEffect(() => {
    if (id) {
      fetchSavedSubjects();
    }
  }, [id]);

  const DeletSubject = async (idDel) => {
    try {
      await deleteDoc(doc(db, "Allstaffs", id, "subject", idDel));
      toast.success("Subject deleted!");
      fetchSavedSubjects();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center p-3">
        <p className="fw-semibold m-0"> HOD: {HODName}</p>
        <p className="fw-semibold m-0">Department: {Department?.slice(14)}</p>
      </div>

      <div className="container  d-felx p-3 justify-content-start align-items-center">
        <button
          className="btn text-primary border-0 fs-3"
          onClick={() => {
            nav("/HODLayout/StaffDetails");
          }}
        >
          <FaArrowLeftLong /> Back
        </button>
      </div>

      <div className="container ">
        <div className="row mb-5 justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-primary">
              <div className="card-header bg-primary text-light text-center text-uppercase fw-bold fs-6">
                Subject Alert <br /> for <br />
                {StaffData.staffName}
              </div>

              <div className="card-body p-4">
                <div className="row">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((doc) => {
                    const fieldName =
                      doc === 1
                        ? "subject"
                        : doc === 2
                        ? "year"
                        : doc === 3
                        ? "department"
                        : doc == 4
                        ? "class"
                        : doc == 5
                        ? "TorL"
                        : doc == 6
                        ? "ugorpg"
                        : doc == 7
                        ? "rs"
                        : "semester";
                    const fieldLabel =
                      doc === 1
                        ? "Select Subject"
                        : doc === 2
                        ? "Year"
                        : doc === 3
                        ? "Department"
                        : doc == 4
                        ? "Class"
                        : doc == 5
                        ? "Theory or Lab"
                        : doc == 6
                        ? "UG  or PG"
                        : doc == 7
                        ? "Regular or Self"
                        : "Semester";
                    return (
                      <div className="col-md-6 mt-3" key={doc}>
                        <label className="text-uppercase text-primary fw-semibold mb-2">
                          {fieldLabel}
                        </label>
                        <select
                          name={fieldName}
                          value={state[fieldName]}
                          onChange={(e) =>
                            dispatch({
                              field: e.target.name,
                              value: e.target.value,
                            })
                          }
                          className="form-select"
                        >
                          <option value="">-- Select {fieldLabel} --</option>

                          {fieldName === "subject" &&
                            SubjectData.map((doc, index) => (
                              <option value={doc} key={index}>
                                {doc}
                              </option>
                            ))}

                          {fieldName === "year" &&
                            YEAR_OPTIONS.map((no) => (
                              <option value={no} key={no}>
                                {no}
                              </option>
                            ))}

                          {fieldName === "department" &&
                            DepartmentData.map((dep, index) => (
                              <option value={dep} key={index}>
                                {dep}
                              </option>
                            ))}

                          {fieldName === "class" &&
                            CLASS_OPTIONS.map((cls) => (
                              <option value={cls} key={cls}>
                                {cls}
                              </option>
                            ))}
                          {fieldName === "TorL" &&
                            ["Theory", "Lab"].map((subs, index) => (
                              <option value={subs} key={index}>
                                {" "}
                                {subs}{" "}
                              </option>
                            ))}
                          {fieldName === "ugorpg" &&
                            ["ug", "pg"].map((ugorpg) => (
                              <option value={ugorpg}>
                                {" "}
                                {ugorpg.toUpperCase()}{" "}
                              </option>
                            ))}
                          {fieldName === "rs" &&
                            ["regular", "self"].map((rs) => (
                              <option value={rs}> {rs.toUpperCase()} </option>
                            ))}
                          {fieldName === "semester" &&
                            [1, 2, 3, 4, 5, 6].map((sem) => (
                              <option value={`semester_${sem}`}> {sem} </option>
                            ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card-footer d-flex justify-content-center p-3">
                <button
                  className="btn btn-primary text-uppercase mb-3 px-4 py-2"
                  style={{ letterSpacing: "2px" }}
                  onClick={AddStaffData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ThreeDot
                      color="#ffffff"
                      size="medium"
                      text=""
                      textColor=""
                    />
                  ) : (
                    "Save Subject"
                  )}
                </button>
              </div>

              <div className="container mb-5">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead className="table-primary text-center text-uppercase">
                      <tr>
                        <th>S.No</th>
                        <th>Subject</th>
                        <th>Department & sf / regular</th>
                        <th>Year & semester</th>
                        <th>Class & Degree</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SavedSubjects && SavedSubjects.length > 0 ? (
                        SavedSubjects.map((value, index) => (
                          <tr className="text-center" key={value.id}>
                            <td>{index + 1}</td>

                            <td className="fw-semibold">
                              <div className="d-flex flex-column justify-content-around">
                                <div className="text-center">
                                  {value.subject}
                                </div>
                                <div>{value.TorL}</div>
                              </div>
                            </td>

                            <td className="fw-semibold">
                              <div className="d-flex flex-column">
                                <div>{value.department}</div>
                                <div>{value.rs.toUpperCase()}</div>
                              </div>
                            </td>
                            <td className="fw-semibold">
                              <div className="d-flex flex-column ">
                                <div className="border-bottom border-3 border-secondary">
                                  {value.year}
                                </div>
                                <div>{value.semester}</div>
                              </div>
                            </td>

                            <td className="fw-semibold">
                              <div className="d-flex justify-content-around ">
                                <div className="">{value.class}</div>
                                <div>{value.ugorpg.toUpperCase()}</div>
                              </div>
                            </td>

                            <td>
                              <RiDeleteBin3Fill
                                onClick={() => DeletSubject(value.id)}
                                style={{
                                  cursor: "pointer",
                                  color: "#dc3545",
                                  fontSize: "1.3rem",
                                }}
                                title="Delete Subject"
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="fw-semibold text-uppercase text-center py-4"
                          >
                            No Subject Saved for this Staff
                          </td>
                        </tr>
                      )}
                    </tbody>
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
