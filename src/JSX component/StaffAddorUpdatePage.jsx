import { LuUserRoundSearch } from "react-icons/lu";
import { BiSolidEdit } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa6";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "./Database.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Footer from "./Footer.jsx";

const StaffAddorUpdatePage = () => {
  // State's
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
    const getData = await getDocs(collection(db, "staff"));
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

  const UserAdd = () => {
    Swal.fire({
      icon: "success",
      title: "User Added",
      timer: 2000,
      showConfirmButton: false,
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
      InformationError();
    } else {
      try {
        loading();
        await addDoc(collection(db, "staff"), {
          username: userName,
          password: password,
        });
        setUserName("");
        setPassword("");
        UserAdd();
        getUser();
      } catch (e) {
        alert("Error: ", e.message);
      }
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "staff", id));
        delSuccess();
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
    const getEdData = await getDoc(doc(db, "staff", id));
    const EdData = getEdData.data();
    setUserName(EdData.username);
    setPassword(EdData.password);
  };

  const UpdateUser = async () => {
    if (!userName || !password) {
      InformationError();
    } else {
      try {
        loading();
        await updateDoc(doc(db, "staff", currentId), {
          username: userName,
          password: password,
        });
        setUserName("");
        setPassword("");
        setBtn(true);
        setCurrentId(null);
        Update();
        getUser();
      } catch (e) {
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
      <div className="container d-flex justify-content-center mt-4">
        <div className="row d-flex justify-content-center">
          <div className="col-12 text-primary d-flex h1 justify-content-center align-items-center">
            User Details - <FaUserTie />
          </div>
          <div className="col-12 text-secondary text-center h6 mt-3">
            Search User or Add New User, Delete or Edit User
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

      {/* User Form */}
      <div className="container my-4">
        <span className="text-primary h1 ">Total User - {user} </span>
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-6 col-lg-5 shadow-sm p-4 bg-light rounded">
            <div className="d-flex flex-column gap-4">
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <FaUserTie />
                </span>
                <input
                  type="text"
                  className="form-control border border-primary"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <RiLockPasswordFill />
                </span>
                <input
                  type={PasswordEye ? "password" : "text"}
                  className="form-control border border-primary"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="input-group-text bg-primary text-light">
                  {PasswordEye ? (
                    <FaEyeSlash
                      onClick={() => {
                        SetPasswordEye(false);
                      }}
                    />
                  ) : (
                    <FaRegEye
                      onClick={() => {
                        SetPasswordEye(true);
                      }}
                    />
                  )}
                </span>
              </div>

              <button
                className="btn btn-primary fw-bold py-1"
                onClick={btn ? AddUser : UpdateUser}
              >
                {btn ? "Add User" : "Update Data"}
              </button>
            </div>
          </div>
        </div>
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
                  <td colSpan="4">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default StaffAddorUpdatePage;
