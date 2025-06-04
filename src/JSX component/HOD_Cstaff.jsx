import React, { useContext, useEffect, useReducer, useState } from "react";
import { FaSchool } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import {
  RiNumber1,
  RiNumber2,
  RiNumber3,
  RiShieldUserFill,
} from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";
import CreateStaffContext from "./CreateStaffContext";
import { db } from "./Database.js";
import { collection, doc, setDoc, getDocs, addDoc } from "firebase/firestore";
import { UserAdd, loading } from "./SweetAlert.jsx";

const HOD_Cstaff = () => {
  const { staffData } = useContext(CreateStaffContext);
  const { Department, rs, ugorpg, HODName, DepartmentCode } = staffData || {};
  const [btn, setBtn] = useState(false);

  const initialState = {
    Name: "",
    username: "",
    password: "",
    sub1_1: "",
    sub1_2: "",
    sub1_3: "",
    sub2_1: "",
    sub2_2: "",
    sub2_3: "",
    sub3_1: "",
    sub3_2: "",
    sub3_3: "",
  };

  const reducerFunction = (state, action) => {
    switch (action.type) {
      case "SET_ALL":
        return {
          ...state,
          ...action.value,
        };
      default:
        return {
          ...state,
          [action.type]: action.value,
        };
    }
  };

  const [state, dispatch] = useReducer(reducerFunction, initialState);

  const GetAllData = async () => {
    try {
      const getNames = await getDocs(collection(db, "staffNames"));
      const allNames = getNames.docs.map((doc) => doc.data().staffName);
      for (let staff of allNames) {
        const StaffCollection = collection(db, "HOD", DepartmentCode, staff);
        const staffDocs = await getDocs(StaffCollection);
        const staffDetails = staffDocs.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(staffDetails);
        staffDocs.forEach(async (docSnap) => {
          const staffDocRef = docSnap.ref;
          for (let year of [1, 2, 3]) {
            const yearSubCollection = collection(staffDocRef, String(year));
            const yearDocs = await getDocs(yearSubCollection);
            const YearData = yearDocs.docs.map((doc) => ({
              ...doc.data(),
            }));
            if (YearData[0]) {
              dispatch({
                type: "SET_ALL",
                value: {
                  ...YearData[0],
                  Name: staffDetails[0]?.Name || "",
                  username: staffDetails[0]?.username || "",
                  password: staffDetails[0]?.password || "",
                },
              });
            }
          }
        });
      }

      console.log(allNames);
    } catch (err) {
      console.error("Error fetching staff names:", err);
    }
  };
  useEffect(() => {
    GetAllData();
  }, []);

  const AddStaff = async () => {
    try {
      loading();

      const getHOD = doc(db, "HOD", DepartmentCode);
      const newCollection = collection(getHOD, state.Name);
      const staffDoc = doc(newCollection);

      // Add staff info
      await setDoc(staffDoc, {
        Name: state.Name,
        username: state.username,
        password: state.password,
      });

      // Add year-wise subjects
      await setDoc(doc(collection(staffDoc, "1")), {
        sub1_1: state.sub1_1,
        sub1_2: state.sub1_2,
        sub1_3: state.sub1_3,
      });

      await setDoc(doc(collection(staffDoc, "2")), {
        sub2_1: state.sub2_1,
        sub2_2: state.sub2_2,
        sub2_3: state.sub2_3,
      });

      await setDoc(doc(collection(staffDoc, "3")), {
        sub3_1: state.sub3_1,
        sub3_2: state.sub3_2,
        sub3_3: state.sub3_3,
      });

      // Add to staffNames collection
      await addDoc(collection(db, "staffNames"), {
        staffName: state.Name,
      });

      // Refresh staff name list
      GetAllData();

      UserAdd();
    } catch (e) {
      console.error("Error adding staff:", e.message);
    }
  };

  return (
    <>
      <div className="container shadow mt-sm-2 p-3 d-flex sticky-top bg-light justify-content-between">
        <div>
          <span
            className="p-2 rounded-pill fw-semibold"
            style={{ letterSpacing: "3px" }}
          >
            <span
              className="fw-semibold bg-primary text-light rounded-circle px-2 py-1"
              data-toggle="tooltip"
              data-placement="top"
              title={HODName}
              style={{ cursor: "pointer" }}
            >
              {HODName?.[0]}
            </span>
          </span>
        </div>
        <div>
          <span className="fw-semibold" style={{ fontSize: "11px" }}>
            {Department?.slice(14)}
          </span>
        </div>
      </div>

      <div className="container py-5">
        <h3 className="mb-4 text-center text-primary fw-bold">CREATE STAFF</h3>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <span className="fw-semibold">Department</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <FaSchool />
              </div>
              <select className="form-control" disabled>
                <option value={Department}>{Department}</option>
              </select>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <span className="fw-semibold">Regular or Self</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">RS</div>
              <select className="form-control" disabled>
                <option value={rs}>{rs}</option>
              </select>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <span className="fw-semibold">UG / PG</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <FaRegCircleUser />
              </div>
              <select className="form-control" disabled>
                <option value={ugorpg}>{ugorpg}</option>
              </select>
            </div>
          </div>

          {/* Form Inputs for Staff and Subjects */}
          {ugorpg == "ug"
            ? ["1", "2", "3"].map((year) => (
                <div className="col-md-4 mt-5 mb-5" key={year}>
                  <div className="row d-flex flex-column bg-light shadow">
                    <span className="fw-bold text-center">{year} - Year</span>
                    {[1, 2, 3].map((sub) => (
                      <div className="col" key={sub}>
                        <span className="fw-semibold">Subject - {sub}</span>
                        <div className="input-group mb-3">
                          <div className="input-group-text bg-primary text-light">
                            {sub === 1 ? (
                              <RiNumber1 />
                            ) : sub === 2 ? (
                              <RiNumber2 />
                            ) : (
                              <RiNumber3 />
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Subject Name"
                            className="form-control"
                            name={`sub${year}_${sub}`}
                            value={state[`sub${year}_${sub}`]}
                            onChange={(e) =>
                              dispatch({
                                type: e.target.name,
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : ["1", "2"].map((year) => (
                <div className="col-md-6 mt-5 mb-5" key={year}>
                  <div className="row d-flex flex-column bg-light shadow">
                    <span className="fw-bold text-center">{year} - Year</span>
                    {[1, 2, 3].map((sub) => (
                      <div className="col" key={sub}>
                        <span className="fw-semibold">Subject - {sub}</span>
                        <div className="input-group mb-3">
                          <div className="input-group-text bg-primary text-light">
                            {sub === 1 ? (
                              <RiNumber1 />
                            ) : sub === 2 ? (
                              <RiNumber2 />
                            ) : (
                              <RiNumber3 />
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder="Subject Name"
                            className="form-control"
                            name={`sub${year}_${sub}`}
                            value={state[`sub${year}_${sub}`]}
                            onChange={(e) =>
                              dispatch({
                                type: e.target.name,
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

          {/* Staff Info Inputs */}
          {[
            { name: "Name", icon: <FaRegCircleUser />, label: "Staff Name" },
            {
              name: "username",
              icon: <RiShieldUserFill />,
              label: "Staff User Name",
            },
            {
              name: "password",
              icon: <TbPasswordUser />,
              label: "Staff Password",
            },
          ].map(({ name, icon, label }) => (
            <div className="col-md-4" key={name}>
              <span className="fw-semibold">{label}</span>
              <div className="input-group mb-3">
                <div className="input-group-text bg-primary text-light">
                  {icon}
                </div>
                <input
                  type="text"
                  placeholder={label}
                  className="form-control"
                  name={name}
                  value={state[name]}
                  onChange={(e) =>
                    dispatch({ type: e.target.name, value: e.target.value })
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-center mb-5">
          <button className="btn btn-primary fw-bold" onClick={AddStaff}>
            {btn ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </>
  );
};

export default HOD_Cstaff;
