import { LuUserRoundSearch } from "react-icons/lu";
import { BiSolidEdit } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa6";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "../Database.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminUserDetails = () => {
  // State's
  const [isloading, setisLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);
  const [btn, setBtn] = useState(true);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState(false);
  const [user, setUser] = useState();
  const [PasswordEye, SetPasswordEye] = useState(true);

  // Get Users
  const getUser = async () => {
    const getData = await getDocs(collection(db, "Admin"));
    const allData = getData.docs.map((val) => ({
      id: val.id,
      ...val.data(),
    }));
    setUser(allData.length);
    setData(allData);
  };

  useEffect(() => {
    getUser();
  }, []);

  // SweetAlerts
  const InformationError = () => {
    Swal.fire({
      html: "Please Fill Information",
      timer: 1000,
      icon: "warning",
      showConfirmButton: false,
    });
  };

  const loading = () => {
    Swal.fire({
      html: "Loading...",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => Swal.showLoading(),
    });
  };

  const delSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "User Deleted",
      timer: 1500,
      showConfirmButton: false,
    });
  };

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

  const Update = () => {
    Swal.fire({
      icon: "success",
      title: "User Updated",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Add User
  const AddUser = async () => {
    if (!userName || !password) {
      toast.error("Please Fill All Requirement");
    } else {
      try {
        setisLoading(true);
        await addDoc(collection(db, "Admin"), {
          username: userName,
          password: password,
        });
        setUserName("");
        setPassword("");
        setisLoading(false);
        getUser();
      } catch (e) {
        setisLoading(false);
        alert("Error: ", e.message);
      }
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "Admin", id));
        toast.success("Admin Deleted");
        getUser();
      } catch (e) {
        alert("Error: ", e.message);
      }
    }
  };

  // Edit User
  const EditUser = async (id) => {
    setBtn(false);
    setCurrentId(id);
    const getEdData = await getDoc(doc(db, "Admin", id));
    const EdData = getEdData.data();
    setUserName(EdData.username);
    setPassword(EdData.password);
  };

  const UpdateUser = async () => {
    if (!userName || !password) {
      toast.error("Please Fill All Requirement");
    } else {
      try {
        setisLoading(true);
        await updateDoc(doc(db, "Admin", currentId), {
          username: userName,
          password: password,
        });
        setUserName("");
        setPassword("");
        setBtn(true);
        setCurrentId(null);
        toast.success("Update Admin");
        setisLoading(false);
        getUser();
      } catch (e) {
        setisLoading(false);
        console.log(e.message);
      }
    }
  };

  // Filtered data
  const filteredData = data.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container d-flex  justify-content-center mt-4">
        <div className="row d-flex justify-content-center">
          <div className="col-12 text-primary d-flex h1 justify-content-center align-items-center">
            Admin Details - <FaUserTie />
          </div>

          <div className="col-12 text-secondary text-center h6 mt-3">
            Search Admin or Add New Admin, Delete or Edit Admin
          </div>
          <div className="col-12 col-sm-5 mt-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search User"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);
                  setSearch(value.trim() !== "");
                }}
              />
              <span className="input-group-text bg-primary text-light">
                <LuUserRoundSearch />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5" style={{ width: "90%" }}>
        <div className="row justify-content-center d-flex mt-xm-5 mt-md-0">
          <div className="col-12 col-md-6 col-lg-5 mt-4 mt-md-0">
            <div className="cards card shadow-sm rounded-4 border-0">
              <div className="card-header border-0 text-center bg-transparent">
                <h4
                  className="fw-bold h5 text-uppercase"
                  style={{ letterSpacing: "1.5px" }}
                >
                  Admin Panel
                </h4>
              </div>

              <div className="card-body d-flex flex-column gap-3">
                {/* Admin Name */}
                <label className="">Admin Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Admin Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />

                {/* Password */}
                <label className="">Password</label>
                <div className="input-group">
                  <input
                    type={PasswordEye ? "password" : "text"}
                    className="form-control"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text icons rounded-end"
                    style={{ cursor: "pointer" }}
                    onClick={() => SetPasswordEye(!PasswordEye)}
                  >
                    {PasswordEye ? <FaEyeSlash /> : <FaRegEye />}
                  </span>
                </div>
              </div>

              <div className="card-footer border-0 text-center">
                <button
                  className="rounded hodbtn text-uppercase fw-bold w-100 py-2"
                  onClick={btn ? AddUser : UpdateUser}
                >
                  {isloading ? (
                    <ThreeDot color="#ffffff" size="medium" text="" />
                  ) : btn ? (
                    "Add User"
                  ) : (
                    "Update User"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-footer"></div>

      {/* User Form */}
      <div className="container my-4">
        <span className="text-primary h1 ">Total Admin - {user} </span>
      </div>

      {/* User Table */}
      <div className="container mt-4 mb-5">
        <div className="table-responsive shadow-sm">
          <table className="table table-bordered table-hover table-striped align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {(search ? filteredData : data).length > 0 ? (
                (search ? filteredData : data).map((value, index) => (
                  <tr key={value.id}>
                    <td>{index + 1}</td>
                    <td>{value.username}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => EditUser(value.id)}
                      >
                        <BiSolidEdit />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => deleteUser(value.id)}
                      >
                        <MdOutlineDeleteOutline />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Admin found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminUserDetails;
