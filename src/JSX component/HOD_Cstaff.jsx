import React, { useEffect, useReducer, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { TbPasswordUser } from "react-icons/tb";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";
import { InformationError, loading } from "./SweetAlert";
import { db } from "./Database.js";
import { TbHttpDelete } from "react-icons/tb";
import {
  collection,
  getDoc,
  doc,
  addDoc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { ThreeDot } from "react-loading-indicators";
import { FaUserEdit } from "react-icons/fa";

const HOD_Cstaff = () => {
  const [hodData, setHOD] = useState("");
  const [staffNames, setStaffNames] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [HODinsideStaffs, setHODinsideStaffs] = useState([]);
  const [StaffAllData, setStaffAllData] = useState([]);
  const [btn, setBtn] = useState(false);
  const [StaffidName, setStaffidName] = useState();
  const [Staffid, setStaffid] = useState();
  let { Department, HODName, ugorpg, rs, DepartmentCode } = hodData;

  const reducer = (state, action) => {
    return {
      ...state,
      [action.field]: action.value,
    };
  };

  const initialState = {
    staffName: "",
    staffUserName: "",
    staffPassword: "",
    s1_1: "",
    s1_2: "",
    s1_3: "",
    s2_1: "",
    s2_2: "",
    s2_3: "",
    s3_1: "",
    s3_2: "",
    s3_3: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const AddData = async () => {
    if (
      !state.staffName.trim() ||
      !state.staffUserName.trim() ||
      !state.staffPassword.trim()
    ) {
      let eror = "Please Fill StaffDetails";
      InformationError(eror);
    } else {
      setIsloading(true);

      await addDoc(collection(db, "staffName"), {
        staff_Name: state.staffName,
      });

      const staffAdd = doc(db, "HOD", DepartmentCode);
      const staffCol = doc(collection(staffAdd, state.staffName));
      await setDoc(staffCol, {
        staffname: state.staffName,
        staffuserName: state.staffUserName,
        staffpassword: state.staffPassword,
      });

      (ugorpg === "ug" ? [1, 2, 3] : [1, 2]).map(async (year) => {
        const staffsub = collection(staffCol, `${year}`);
        const staffDoc = doc(staffsub);
        await setDoc(staffDoc, {
          [`s${year}_1`]: state[`s${year}_1`],
          [`s${year}_2`]: state[`s${year}_2`],
          [`s${year}_3`]: state[`s${year}_3`],
        });
      });

      stateUpdate();
      await getStaffNames(); 
      await HODinsideStaff();
      setIsloading(false);
    }
  };

  const Up = async () => {
    if (
      !state.staffName.trim() ||
      !state.staffUserName.trim() ||
      !state.staffPassword.trim()
    ) {
      let eror = "Please Fill StaffDetails";
      InformationError(eror);
    } else {
      setIsloading(true);
      // const staffName = await getDocs(
      //   collection(db, "HOD", DepartmentCode, StaffidName)
      // );
      // const staffNameData = staffName.docs.map((doc) => ({
      //   ...doc.data().staffname,
      // }));
      // console.log(staffNameData);
      const staffDocRef = doc(db, "HOD", DepartmentCode, StaffidName , Staffid);

      await updateDoc(staffDocRef, {
      staffname: state.staffName,
      staffuserName: state.staffUserName,
      staffpassword: state.staffPassword,
    });
    
    await updateDoc(collection(db, "staffName", ), {
      staff_Name: state.staffName,
    });

      // await addDoc(collection(db, "staffName"), {
      //   staff_Name: state.staffName,
      // });

      // const staffAdd = doc(db, "HOD", DepartmentCode);
      // const staffCol = doc(collection(staffAdd, state.staffName));
      // await setDoc(staffCol, {
      //   staffname: state.staffName,
      //   staffuserName: state.staffUserName,
      //   staffpassword: state.staffPassword,
      // });

      // (ugorpg === "ug" ? [1, 2, 3] : [1, 2]).map(async (year) => {
      //   const staffsub = collection(staffCol, `${year}`);
      //   const staffDoc = doc(staffsub);
      //   await setDoc(staffDoc, {
      //     [`s${year}_1`]: state[`s${year}_1`],
      //     [`s${year}_2`]: state[`s${year}_2`],
      //     [`s${year}_3`]: state[`s${year}_3`],
      //   });
      // });

      // stateUpdate();
      // await getStaffNames();
      // await HODinsideStaff();
      setIsloading(false);
    }
  };

  const getStaffNames = async () => {
    const getStaff = await getDocs(collection(db, "staffName"));
    const getStaffData = getStaff.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setStaffNames(getStaffData);
  };

  const HODinsideStaff = async () => {
    try {
      const allStaffData = [];
      const time = 4000;
      loading(time);
      for (const staff of staffNames) {
        const StaffDetailsRef = collection(
          db,
          "HOD",
          DepartmentCode,
          staff.staff_Name
        );
        const StaffDetailsSnap = await getDocs(StaffDetailsRef);
        const data = StaffDetailsSnap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          staff_Name: staff.staff_Name,
        }));

        console.log(`Staff Name: ${staff.staff_Name}`, data);

        allStaffData.push(...data);
      }

      setHODinsideStaffs(allStaffData);
    } catch (e) {
      console.log(e.message);
    }
  };

  const stateUpdate = () => {
    for (let stateClear in initialState) {
      dispatch({ field: stateClear, value: "" });
    }
  };

  const fetchData = () => {
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    console.log(HODdata);
    setHOD(HODdata);
  };

  const UpdateStaff = async (sname, id) => {
    try {
      if (!DepartmentCode) throw new Error("DepartmentCode is undefined");
      if (!sname) throw new Error("sname is undefined");
      if (!id) throw new Error("id is undefined");

      setBtn(true);
      setStaffid(id);
      setStaffidName(sname);
      console.log(
        "sname:",
        sname,
        "id:",
        id,
        "DepartmentCode:",
        DepartmentCode
      );

      const StaffDetailsRef = collection(db, "HOD", DepartmentCode, sname);
      const StaffDetailsSnap = await getDocs(StaffDetailsRef);

      const data = StaffDetailsSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      console.log("Staff Main Info:", data);

      dispatch({ field: "staffName", value: data[0]?.staffname || "" });
      dispatch({ field: "staffUserName", value: data[0]?.staffuserName || "" });
      dispatch({ field: "staffPassword", value: data[0]?.staffpassword || "" });

      const allStaffDatas = [];
      const years = ugorpg === "ug" ? [1, 2, 3] : [1, 2];

      for (const year of years) {
        const staffDocRef = doc(db, "HOD", DepartmentCode, sname, id);
        const nextSubCollection = collection(staffDocRef, String(year));
        const nextSubDataSnap = await getDocs(nextSubCollection);

        const dataYear = nextSubDataSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(`Year ${year} Subjects:`, dataYear);

        allStaffDatas.push(...dataYear);
      }

      setStaffAllData(allStaffDatas);

      years.forEach((year, index) => {
        [1, 2, 3].forEach((sub) => {
          dispatch({
            field: `s${year}_${sub}`,
            value: allStaffDatas[index]?.[`s${year}_${sub}`] || "",
          });
        });
      });
    } catch (e) {
      console.error("Error in UpdateStaff:", e.message);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      fetchData();
      await getStaffNames();
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (staffNames.length > 0) {
      HODinsideStaff();
    }
  }, [staffNames]);

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center ">
        <p className="fw-semibold"> HOD : {HODName}</p>
        <p className="fw-semibold">Department : {Department?.slice(14)}</p>
      </div>

      <div className="container ">
        <h1
          className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px" }}
        >
          Create New Staff
        </h1>

        <div className="row p-1 ">
          {[1, 2, 3].map((value, index) => (
            <div className=" col-sm-4 " key={index}>
              <div className="input-group mt-4">
                <span className="input-group-text text-light bg-primary bg-gradient">
                  {value === 1 ? (
                    <FaUserCircle />
                  ) : value === 2 ? (
                    <FaClipboardUser />
                  ) : (
                    <TbPasswordUser />
                  )}
                </span>
                <input
                  type="text"
                  className="form-control"
                  name={
                    value === 1
                      ? "staffName"
                      : value === 2
                      ? "staffUserName"
                      : "staffPassword"
                  }
                  value={
                    value === 1
                      ? state.staffName
                      : value === 2
                      ? state.staffUserName
                      : state.staffPassword
                  }
                  onChange={(e) => {
                    dispatch({ field: e.target.name, value: e.target.value });
                  }}
                  placeholder={
                    value === 1
                      ? "Staff Name"
                      : value === 2
                      ? "Staff User Name"
                      : "Staff Password"
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <h1
          className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px" }}
        >
          alert Subject
        </h1>
        <h6
          className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px", fontSize: "12px" }}
        >
          for staff
        </h6>

        <div className="row mb-5">
          {(ugorpg === "ug" ? [1, 2, 3] : [1, 2]).map((value) => (
            <div
              key={value}
              className={
                ugorpg === "ug"
                  ? "col-12 col-sm-4 mt-4"
                  : "col-12 col-sm-6 mt-4"
              }
            >
              <span
                className="fw-bold text-uppercase d-flex justify-content-center"
                style={{ letterSpacing: "5px" }}
              >{`${value} - Year `}</span>
              {[1, 2, 3].map((vals) => (
                <div className="input-group mt-3" key={`s${value}_${vals}`}>
                  <span className="input-group-text text-light bg-primary bg-gradient">
                    {vals === 1 ? (
                      <RiNumber1 />
                    ) : vals === 2 ? (
                      <RiNumber2 />
                    ) : (
                      <RiNumber3 />
                    )}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name={`s${value}_${vals}`}
                    value={state[`s${value}_${vals}`]}
                    onChange={(e) => {
                      dispatch({
                        field: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    placeholder={`Subject Name ${vals}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="container d-flex justify-content-center">
          <button
            style={{ letterSpacing: "5px" }}
            className="btn btn-primary fw-semibold mb-5 bg-gradient text-uppercase"
            onClick={
              btn
                ? () => {
                    Up(staffNames.id);
                  }
                : () => {
                    AddData;
                  }
            }
          >
            {isLoading ? (
              <ThreeDot color="#ffffff" size="medium" text="" textColor="" />
            ) : btn ? (
              "Update"
            ) : (
              "save"
            )}
          </button>
        </div>
      </div>

      <div className="container text-center mb-5 ">
        <h6
          className="h6 text-uppercase fw-bold text-primary "
          style={{ letterSpacing: "5px" }}
        >
          {" "}
          staff list{" "}
        </h6>
        <div className="table-responsive mb-5 ">
          <table className="table table-striped table-secondary table-hover mb-5">
            <thead className="text-uppercase " style={{ letterSpacing: "1px" }}>
              <tr>
                <th>S.No</th>
                <th> Staff </th>
                <th> edit </th>
                <th> Delete </th>
              </tr>
            </thead>
            <tbody className="">
              {HODinsideStaffs.length > 0 ? (
                HODinsideStaffs.map((value, index) => {
                  return (
                    <tr key={value.id}>
                      <td> {index + 1} </td>
                      <td> {value.staffname} </td>
                      <td>
                        {" "}
                        <button
                          className="btn btn-outline-dark px-3 "
                          style={{ fontSize: "20px" }}
                          onClick={() => {
                            UpdateStaff(value.staffname, value.id);
                          }}
                        >
                          <FaUserEdit />{" "}
                        </button>{" "}
                      </td>
                      <td>
                        {" "}
                        <button
                          className="btn btn-outline-danger "
                          style={{ fontSize: "20px" }}
                          onClick={() => {
                            DeleteHODsubStaff(value.staffname, value.id);
                          }}
                        >
                          <TbHttpDelete />{" "}
                        </button>{" "}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <p
                  className=" bg-danger text-uppercase text-center text-light"
                  style={{ letterSpacing: "5px" }}
                >
                  No Staff
                </p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HOD_Cstaff;
