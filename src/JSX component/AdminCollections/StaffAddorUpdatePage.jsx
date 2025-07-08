import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { db } from "../Database.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import toast from "react-hot-toast";

const StaffAddorUpdatePage = () => {
  // State's
  const [data, setData] = useState([]);
  const [btn, setBtn] = useState(true);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState(false);
  const [user, setUser] = useState();
  const [PasswordEye, SetPasswordEye] = useState(true);
  const [departmentData, setDepartmentData] = useState();

  // FB Add Data
  const [selectDepartment, setSelectDepartment] = useState("");
  const [DepartmentCode, setDepartmentCode] = useState("");
  const [HODName, setHODName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rs, setrs] = useState("");
  const [ugorpg, setugorpg] = useState("");
  console.log(DepartmentCode);
  // Get Users
  const getUser = async () => {
    const depGetData = await getDocs(collection(db, "Departments"));
    const depAllData = depGetData.docs.map((val) => ({
      ...val.data(),
    }));
    setDepartmentData(depAllData);
  };
  const fetchDataFB = () =>{
    const RealTimeData = onSnapshot(collection(db,"HOD"), (data)=>{
      const AllData = data.docs.map((doc)=>({
        id: doc.id,
        ...doc.data(),
      }))
      setTotalHod(AllData.length)
      setData(AllData)
    })
    return RealTimeData
  }
  useEffect(() => {
    const RealtimeFalse = fetchDataFB();
    return () => RealtimeFalse();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  const confirmDelete = () => {
    return Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
  };

  // Add User
  const AddUser = async () => {
    if (
      !userName ||
      !password ||
      !HODName ||
      !DepartmentCode ||
      !selectDepartment ||
      !rs ||
      !ugorpg
    ) {
      toast.error("Fill All Requirements");
    } else {
      try {
        toast.loading("Please Wait");
        const q = query(
          collection(db, "HOD"),
          where("DepartmentCode", "==", DepartmentCode)
        );
        const getCode = await getDocs(q);

        const useData = query(
          collection(db, "HOD"),
          where("username", "==", userName),
          where("password", "==", password)
        );

        const getUserData = await getDocs(useData);

        const useDepartment = query(
          collection(db, "HOD"),
          where("Department", "==", selectDepartment)
        );
        const getDep = await getDocs(useDepartment);

        if (!getCode.empty) {
          toast.dismiss();
          toast.error("Department Code Already Provided");
          return;
        }

        if (!getUserData.empty) {
          toast.dismiss();
          toast.error("Username & Password Already Provided");
          return;
        }

        if (!getDep.empty) {
          toast.dismiss();
          toast.error("This Department Already Provided");
          return;
        }

        const CreateCode = doc(db, "HOD", DepartmentCode);
        await setDoc(CreateCode, {
          username: userName,
          password: password,
          HODName: HODName,
          DepartmentCode: DepartmentCode,
          Department: selectDepartment,
          rs: rs,
          ugorpg: ugorpg,
        });
        setDepartmentCode("");
        setHODName(" ");
        setSelectDepartment(" ");
        setrs(" ");
        setugorpg(" ");
        setUserName("");
        setPassword("");
        if (!currentId) {
          toast.dismiss();
          toast.success("HOD Upload");
        }
        getUser();
      } catch (e) {
        return toast.error(e.message);
      }
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "HOD", id));
        toast.success("HOD Delete");
        getUser();
      } catch (e) {
        return toast.error(e.message);
      }
    }
  };

  // Edit User
  const EditUser = async (id) => {
    setBtn(false);
    setCurrentId(id);
    const getEdData = await getDoc(doc(db, "HOD", id));
    const EdData = getEdData.data();
    setUserName(EdData.username);
    setPassword(EdData.password);
    setDepartmentCode(EdData.DepartmentCode);
    setSelectDepartment(EdData.Department);
    setHODName(EdData.HODName);
    setugorpg(EdData.ugorpg);
    setrs(EdData.rs);
  };

  const UpdateUser = async () => {
    if (
      !userName ||
      !password ||
      !HODName ||
      !DepartmentCode ||
      !selectDepartment ||
      !rs ||
      !ugorpg
    ) {
      toast.error("Fill All Requirement");
    } else {
      try {
        await deleteDoc(doc(db, "HOD", currentId));
        AddUser();
        await getUser();
        toast.dismiss();
        toast.success("HOD Update");
        setUserName("");
        setPassword("");
        setDepartmentCode("");
        setHODName("");
        setSelectDepartment("");
        setrs("");
        setugorpg("");
        setBtn(true);
        setCurrentId(null);
      } catch (e) {
        toast.dismiss();
        return toast.error(e.message);
      }
    }
  };

  // Filtered data
  const filteredData = data.filter((user) =>
    user.HODName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container-fluid mt-3">
        <div className="row d-flex justify-content-between align-items-center">
          <div className="col-12 col-sm-6 text-start">
            <span className=" " style={{ color: "rgb(26, 51, 208)" }}>
              TOTAL HODS - {user}{" "}
            </span>
          </div>
          <div className="col-12 col-sm-4 mt-3 mt-sm-0">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search HOD"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  setSearch(value.trim() !== "");
                }}
              />
              <span className="input-group-text bg-white">
                <img
                  src="/people.png"
                  width={20}
                  alt=""
                  className="img img-fluid"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Form */}
      <div className="d-flex row ">
        <div className="col-sm-6  col-12">
          <div className="container">
            <div className="row justify-content-center mt-5">
              <div className="col-12   p-4 rounded ">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-4 text-center fw-semibold">
                      Add / Update HOD
                    </h5>
                  </div>
                  <div className="card-body text-start">
                    <div className="mb-3">
                      <label className="form-label">Department Code</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Department Code"
                        value={DepartmentCode}
                        onChange={(e) =>
                          setDepartmentCode(e.target.value.toUpperCase())
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">HOD Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="HOD Name"
                        value={HODName}
                        onChange={(e) => setHODName(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label ">Select Department</label>
                      <select
                        className="form-select"
                        value={selectDepartment}
                        onChange={(e) => setSelectDepartment(e.target.value)}
                      >
                        <option value="">-- Select Department --</option>
                        {departmentData &&
                          departmentData.flatMap((doc) =>
                            Object.values(doc).map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))
                          )}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">UG / PG</label>
                      <select
                        className="form-select"
                        value={ugorpg}
                        onChange={(e) => setugorpg(e.target.value)}
                      >
                        <option value="">-- Select UG or PG --</option>
                        <option value="ug">UG</option>
                        <option value="pg">PG</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Regular / Self</label>
                      <select
                        className="form-select"
                        value={rs}
                        onChange={(e) => setrs(e.target.value)}
                      >
                        <option value="">-- Select Regular or Self --</option>
                        <option value="regular">Regular</option>
                        <option value="self">Self</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">User Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="New Username"
                        value={userName}
                        onChange={(e) =>
                          setUserName(e.target.value.toUpperCase())
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type={PasswordEye ? "password" : "text"}
                          className="form-control"
                          placeholder="New Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="input-group-text bg-white">
                          <button
                            type="button "
                            onClick={() => SetPasswordEye((prev) => !prev)}
                            className="btn p-0 border-0"
                          >
                            {PasswordEye ? <FaEyeSlash /> : <FaRegEye />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="text-center">
                      <button
                        className="btn fw-bold px-4 py-2"
                        style={{ backgroundColor: "#0d6efd", color: "#fff" }}
                        onClick={btn ? AddUser : UpdateUser}
                      >
                        {btn ? "Add User" : "Update Data"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="col-sm-6 col-12">
          <div className="container mt-sm-5 mb-5">
            <div className="table-responsive ">
              <table className="table mt-sm-4 mb-5 table-bordered table-hover table-striped align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Department Code</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {(search ? filteredData : data).length > 0 ? (
                    (search ? filteredData : data).map((value, index) => (
                      <tr key={value.id}>
                        <td>{index + 1}</td>
                        <td>{value.HODName}</td>
                        <td>{value.DepartmentCode}</td>
                        <td>
                          <button
                            className="btn border-0"
                            onClick={() => EditUser(value.id)}
                          >
                            <img
                              src="/noteEdit.png"
                              width={25}
                              alt=""
                              className="img img-fluid"
                            />
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn border-0"
                            onClick={() => deleteUser(value.id)}
                          >
                            <img
                              src="/deletes.png"
                              width={20}
                              alt=""
                              className="img img-fluid"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffAddorUpdatePage;
