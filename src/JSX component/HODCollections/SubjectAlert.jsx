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

const SubjectAlert = () => {
  const [isLoading, setisLoading] = useState(false);
  const [StaffData, setStaffData] = useState([]);
  const [hodData, setHOD] = useState("");
  const [SubjectData, setSubjectData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [SavedSubjects, setSavedSubjects] = useState([]);

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
  };

  const [state, dispatch] = useReducer(reducer, stateObject);

  const AddStaffData = async () => {
    if (
      !state.subject ||
      !state.year ||
      !state.department ||
      !state.class ||
      !state.TorL ||
      !state.ugorpg
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

      <div className="container mt-5">
        <div className="row mb-5 justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow border-primary">
              <div className="card-header bg-primary text-light text-center text-uppercase fw-bold fs-6">
                Subject Alert <br /> for <br />
                {StaffData.staffName}
              </div>

              <div className="card-body p-4">
                <div className="row">
                  {[1, 2, 3, 4, 5, 6].map((doc) => {
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
                        : "ugorpg";
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
                        : "UG  or PG";
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
                        <th>Department</th>
                        <th>Year</th>
                        <th>Class</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SavedSubjects && SavedSubjects.length > 0 ? (
                        SavedSubjects.map((value, index) => (
                          <tr className="text-center" key={value.id}>
                            <td>{index + 1}</td>
                            <td>{value.subject}</td>
                            <td>{value.department}</td>
                            <td>{value.year}</td>
                            <td>{value.class}</td>
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
