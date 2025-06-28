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
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// MUI Components
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

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
    setSubjectData(getData.filter((d) => typeof d === "string")); // ensure it's strings

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
          year: Number(state.year),
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

  const DeletSubject = async (idDel, subject) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: `${subject} Will be Removed.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteDoc(doc(db, "Allstaffs", id, "subject", idDel));
          fetchSavedSubjects();
          toast.success(`${subject} is Deleted `);
        }
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <div
        style={{ background: "#d5181c", overflowX: "hidden" }}
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
          <div className="col-4 d-flex justify-content-start align-items-center">
            <Stack direction="row" spacing={2}>
              <Chip
                avatar={
                  <Avatar style={{ color: "white", background: "#d5181c" }}>
                    {HODName?.slice(0, 1)}
                  </Avatar>
                }
                label={HODName}
                sx={{
                  width: 100,
                  bgcolor: "#fff", // white chip background
                  color: "#000", // black text
                  border: "1px solid #ccc", // optional subtle border
                  fontWeight: 500, // optional: stronger text
                }}
              />
            </Stack>
          </div>
          <div className="col-6  d-flex justify-content-center align-items-center ">
            <p className="fw-semibold m-0 text-center">
              {Department?.slice(14)}
            </p>
          </div>
        </div>
      </div>
      <div className="container mt-5 " style={{ marginBottom: "200px" }}>
        <div className="row mb-5 justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow ">
              <div
                className="card-header bg-gradient  text-light text-center text-uppercase fw-bold fs-6"
                style={{ background: "#d5181c", color: "white" }}
              >
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
                        <label
                          className="text-uppercase fw-semibold mb-2"
                          style={{ color: "" }}
                        >
                          {fieldLabel}
                        </label>

                        {fieldName === "subject" ? (
                          <Autocomplete
                            size="small"
                            options={SubjectData}
                            value={state.subject || null}
                            onChange={(e, newValue) =>
                              dispatch({
                                field: "subject",
                                value: newValue || "",
                              })
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Subject"
                                variant="outlined"
                              />
                            )}
                            fullWidth
                            disableClearable
                          />
                        ) : (
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
                              ["ug", "pg"].map((ugorpg, i) => (
                                <option value={ugorpg} key={i}>
                                  {ugorpg.toUpperCase()}
                                </option>
                              ))}
                            {fieldName === "rs" &&
                              ["regular", "self"].map((rs, i) => (
                                <option value={rs} key={i}>
                                  {rs.toUpperCase()}
                                </option>
                              ))}
                            {fieldName === "semester" &&
                              [1, 2, 3, 4, 5, 6].map((sem) => (
                                <option value={`semester_${sem}`} key={sem}>
                                  {sem}
                                </option>
                              ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="card-footer d-flex justify-content-center p-3">
                <button
                  className="btn hodbtn text-uppercase mb-3 px-4 py-2"
                  style={{
                    letterSpacing: "2px",
                    // background: "#d5181c",
                    color: "white",
                  }}
                  onClick={AddStaffData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ThreeDot color="#ffffff" size="medium" />
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
                                onClick={() =>
                                  DeletSubject(value.id, value.subject)
                                }
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
