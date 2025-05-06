// import { FaCirclePlus } from "react-icons/fa6";
import { LuUserRoundSearch } from "react-icons/lu";
import { BiSolidEdit } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa6";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
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

const StaffAddorUpdatePage = () => {
  // State's
  const [userName, SetUserName] = useState();
  const [Password, SetPassword] = useState();
  const [data, setData] = useState([]);
  const [btn, setBtn] = useState(true);
  const [currentId, setCurrentId] = useState(null);

  // getUser
  var getUser = async () => {
    let getData = await getDocs(collection(db, "staff"));
    let data = getData.docs.map((val) => ({
      id: val.id,
      ...val.data(),
    }));
    setData(data);
  };

  useEffect(() => {
    getUser();
  }, []);
  console.log(data);
  // Animation's
  const InformationError = () => {
    let timerInterval;
    Swal.fire({
      html: "Please Fill Information",
      timer: 1000,
      icon: "warning",
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  };
  const loading = () => {
    let timerInterval;
    Swal.fire({
      html: "Loading",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
  };
  const UserAdd = () => {
    Swal.fire({
      icon: "success",
      title: "User Add",
      timer: 2000,
    });
  };
  const delSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "User Deleted",
      timer: 1500,
    });
  };
  const del = () => {
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
    });
  };
  //   AddUser
  const AddUser = async () => {
    if (!userName && !Password) {
      InformationError();
    } else {
      try {
        loading();
        await addDoc(collection(db, "staff"), {
          username: userName,
          password: Password,
        });
        SetPassword("");
        SetUserName("");
        UserAdd();
        getUser();
      } catch (e) {
        alert("Error ", e.message);
      }
    }
  };
  //   Delete User
  const deleteUser = async (id) => {
    try {
      const result = await del();
      if (result.isConfirmed) {
        await deleteDoc(doc(db, "staff", id));
        delSuccess();
        getUser();
      }
    } catch (e) {
      alert("Error ", e.message);
    }
  };
  //   EditUser
  const EditUser = async (id) => {
    setBtn(false);
    setCurrentId(id);
    const getEdData = await getDoc(doc(db, "staff", id));
    const EdData = getEdData.data();
    SetUserName(EdData.username);
    SetPassword(EdData.password);
    UpdateUser(currentId);
  };
  const UpdateUser = async () => {
    if(!userName || !Password)
    {

    }
    else
    {
        try {
            loading();
            await updateDoc(doc(db, "staff", currentId), {
                username: userName,
                password: Password,
            });
            SetUserName("");
            SetPassword("");
            setBtn(true);
            setCurrentId(null);
            Update();
            getUser();
        } catch (e) {
            console.log(e.message);
        }
    }
  };

  return (
    <>
      <div className="container  d-flex  justify-content-center mt-4">
        <div className="row d-flex justify-content-center ">
          <div className="col-12 text-primary d-flex  h1 justify-content-center align-items-center">
            {" "}
            User Details - <FaUserTie />
          </div>
          <div className="col-12 text-secondary text-center h6 mt-3 ">
            {" "}
            Search User or Add New User, Delete or Edit User
          </div>

          <div className="col-12 col-sm-5 mt-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search User"
              />
              <span className="input-group-text bg-primary text-light ">
                <LuUserRoundSearch />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-4">
        {/* Header */}
        {/* Login Form */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 col-md-6 col-lg-5 shadow-sm p-4 bg-light rounded">
            <div className="d-flex flex-column gap-4">
              {/* Username */}
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <FaUserCircle />
                </span>
                <input
                  type="text"
                  className="form-control border border-primary "
                  placeholder="Username"
                  value={userName || ""}
                  onChange={(e) => SetUserName(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <RiLockPasswordFill />
                </span>
                <input
                  type="password"
                  className="form-control border border-primary"
                  placeholder="Password"
                  value={Password || ""}
                  onChange={(e) => SetPassword(e.target.value)}
                />
              </div>

              {/* Login Button */}
              {btn ? (
                <button
                  className="btn btn-primary fw-bold py-1"
                  onClick={AddUser}
                >
                  Add User
                </button>
              ) : (
                <button
                  className="btn btn-primary fw-bold py-1"
                  onClick={UpdateUser}
                >
                  Update Data
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
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
              {data.map((value, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StaffAddorUpdatePage;
