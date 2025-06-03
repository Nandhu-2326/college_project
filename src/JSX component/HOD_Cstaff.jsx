import React, { useContext, useReducer } from "react";
import { FaSchool } from "react-icons/fa";
import CreateStaffContext from "./CreateStaffContext";
import { db } from "./Database.js";
import { collection, doc, setDoc } from "firebase/firestore";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiNumber1 } from "react-icons/ri";
import { RiNumber2 } from "react-icons/ri";
import { RiNumber3 } from "react-icons/ri";
import { RiShieldUserFill } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";
import { UserAdd, loading } from "./SweetAlert.jsx";

const HOD_Cstaff = () => {
  let { staffData } = useContext(CreateStaffContext);
  let { Department, rs, ugorpg, HODName, DepartmentCode } = staffData || {};
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
    return {
      ...state,
      [action.type]: action.value,
    };
  };
  const [state, dispatch] = useReducer(reducerFunction, initialState);

  const AddStaff = async () => {
    try {
      loading();
      const getHOD = doc(db, "HOD", DepartmentCode);
      const newCollection = collection(getHOD, state.Name);
      const subCollections = doc(newCollection);
      const StaffDetails = await setDoc(subCollections, {
        Name: state.Name,
        username: state.username,
        password: state.password,
      });
      const Year_1 = collection(subCollections, "1");
      const subjectDoc1 = doc(Year_1);
      const SubDetails1 = await setDoc(subjectDoc1, {
        sub1_1: state.sub1_1,
        sub1_2: state.sub1_2,
        sub1_3: state.sub1_3,
      });
      const Year_2 = collection(subCollections, "2");
      const subjectDoc2 = doc(Year_2);
      const SubDetails2 = await setDoc(subjectDoc2, {
        sub2_1: state.sub2_1,
        sub2_2: state.sub2_2,
        sub2_3: state.sub2_3,
      });
      const Year_3 = collection(subCollections, "3");
      const subjectDoc3 = doc(Year_3);
      const SubDetails3 = await setDoc(subjectDoc3, {
        sub3_1: state.sub3_1,
        sub3_2: state.sub3_2,
        sub3_3: state.sub3_3,
      });
      UserAdd();
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <>
      <div className="container shadow mt-sm-2 p-3 d-flex justify-content-between">
        <div>
          <span
            className="shadow p-2 rounded-pill fw-semibold   border  border-secondary"
            style={{ letterSpacing: "3px" }}
          >
            <span className="fw-semibold bg-primary text-light rounded rounded-circle px-2 py-1 ">
              {HODName.slice(0, 1)}
            </span>
            {HODName}
          </span>
        </div>
        <div>
          <span className="fw-semibold" style={{ fontSize: "11px" }}>
            {Department.slice(14)}
          </span>
        </div>
      </div>

      <div className="container py-5">
        <h3 className="mb-4 text-center text-primary fw-bold t">
          CREATE STAFF
        </h3>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <span className="fw-semibold">Department</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <FaSchool />
              </div>
              <select name="" id="" className="form-control" disabled>
                <option value={Department}> {Department} </option>
              </select>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <span className="fw-semibold"> Regular or Self</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <span className="fw-bold">RS</span>
              </div>
              <select name="" id="" className="form-control" disabled>
                <option value={rs}> {rs} </option>
              </select>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <span className="fw-semibold">UG / PG</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <FaRegCircleUser />
              </div>
              <select name="" id="" className="form-control" disabled>
                <option value={ugorpg}> {ugorpg} </option>
              </select>
            </div>
          </div>

          <div className="col-md-4 mt-5 mb-5">
            <div className="row d-flex flex-column bg-light shadow">
              <span className="fw-bold text-center">I - Year</span>
              <div className="col">
                <span className="fw-semibold">Subject - I</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber1 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                    value={state.sub1_1}
                    name="sub1_1"
                    onChange={(e) =>
                      dispatch({ type: e.target.name, value: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - II</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber2 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                    value={state.sub1_2}
                    name="sub1_2"
                    onChange={(e) =>
                      dispatch({ type: e.target.name, value: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - III</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber3 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                    value={state.sub1_3}
                    name="sub1_3"
                    onChange={(e) =>
                      dispatch({ type: e.target.name, value: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-5 mb-5 ">
            <div className="row d-flex flex-column bg-light shadow">
              <span className="fw-bold text-center">II - Year</span>
              <div className="col">
                <span className="fw-semibold">Subject - I</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber1 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                    value={state.sub2_1}
                    name="sub2_1"
                    onChange={(e) =>
                      dispatch({ type: e.target.name, value: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - II</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber2 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                    value={state.sub2_2}
                    name="sub2_2"
                    onChange={(e) =>
                      dispatch({ type: e.target.name, value: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - III</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber3 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                    value={state.sub2_3}
                    name="sub2_3"
                    onChange={(e) =>
                      dispatch({ type: e.target.name, value: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-5 mb-5">
            <div className="row d-flex flex-column  bg-light shadow">
              <span className="fw-bold text-center">III - Year</span>
              <div className="col ">
                <span className="fw-semibold">Subject - I</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber1 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                    value={state.sub3_1}
                    name="sub3_1"
                    onChange={(e) =>
                      dispatch({ type: e.target.name, value: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - II</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber2 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                    value={state.sub3_2}
                    name="sub3_2"
                    onChange={(e) =>
                      dispatch({ type: e.target.name, value: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="col">
                <span className="fw-semibold">Subject - III</span>
                <div className="input-group mb-3">
                  <div className="input-group-text bg-primary text-light">
                    <RiNumber3 />
                  </div>
                  <input
                    type="text"
                    placeholder="Subject Name"
                    className="form-control"
                    value={state.sub3_3}
                    name="sub3_3"
                    onChange={(e) =>
                      dispatch({ type: e.target.name, value: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <span className="fw-semibold">Staff Name</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <FaRegCircleUser />
              </div>
              <input
                type="text"
                placeholder="Staff Name"
                className="form-control"
                value={state.Name}
                name="Name"
                onChange={(e) =>
                  dispatch({ type: e.target.name, value: e.target.value })
                }
              />
            </div>
          </div>

          <div className="col-md-4">
            <span className="fw-semibold">Staff User Name</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <RiShieldUserFill />
              </div>
              <input
                type="text"
                placeholder="Staff User Name"
                className="form-control"
                name="username"
                value={state.username}
                onChange={(e) =>
                  dispatch({ type: e.target.name, value: e.target.value })
                }
              />
            </div>
          </div>

          <div className="col-md-4">
            <span className="fw-semibold">Staff Password</span>
            <div className="input-group mb-3">
              <div className="input-group-text bg-primary text-light">
                <TbPasswordUser />
              </div>
              <input
                type="text"
                placeholder="Staff Password"
                className="form-control"
                value={state.password}
                name="password"
                onChange={(e) =>
                  dispatch({ type: e.target.name, value: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center mb-5">
          <button className="btn btn-primary fw-bold" onClick={AddStaff}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default HOD_Cstaff;
