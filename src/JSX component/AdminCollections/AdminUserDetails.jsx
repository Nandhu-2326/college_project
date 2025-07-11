import bcrypt from "bcryptjs";
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { db } from "../Database.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";

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
  const [TotalAdmin, setTotalAdmin] = useState();
  const [PasswordEye, SetPasswordEye] = useState(true);

  //  fetch Admin
  const fetchAdmin = () => {
    const RealTimeFetchData = onSnapshot(
      collection(db, "Admin"),
      (RealData) => {
        const AllData = RealData.docs.map((val) => ({
          id: val.id,
          ...val.data(),
        }));
        setTotalAdmin(AllData.length);
        setData(AllData);
      }
    );
    return RealTimeFetchData;
  };

  useEffect(() => {
    const RealtimeFalse = fetchAdmin();
    return () => RealtimeFalse();
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
    if (!userName || !password) {
      return toast.error("Please Fill All Requirement");
    }
    setisLoading(true);
    const checkuser = query(
      collection(db, "Admin"),
      where("username", "==", userName)
    );
    const duplicateuser = await getDocs(checkuser);
    if (!duplicateuser.empty) {
      toast.error("username Already taken");
      setisLoading(false);
      return;
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await addDoc(collection(db, "Admin"), {
        username: userName,
        password: hashedPassword,
        OrgPassword: password,
      });
      setUserName("");
      setPassword("");
      toast.success("Admin Uploaded");
    } catch (e) {
      alert(`Error: , ${e.message}`);
    } finally {
      setisLoading(false);
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    const result = await confirmDelete();
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "Admin", id));
        toast.success("Admin Deleted");
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
    setPassword(EdData.OrgPassword);
  };

  const UpdateUser = async () => {
    if (!userName || !password) {
      return toast.error("Please Fill All Requirement");
    }

    try {
      setisLoading(true);
      console.log(currentId);

      const checkuser = query(
        collection(db, "Admin"),
        where("username", "==", userName)
      );
      const fetchuser = await getDocs(checkuser);

      if (!fetchuser.empty) {
        const datacheck = fetchuser.docs.map((doc) => ({
          id: doc.id,
        }));

        if (datacheck[0].id !== currentId) {
          toast.error("Username already taken");
          return;
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await updateDoc(doc(db, "Admin", currentId), {
        username: userName,
        password: hashedPassword,
        OrgPassword: password,
      });
      setUserName("");
      setPassword("");
      setCurrentId(null);
      toast.success("Admin Updated");
      setBtn(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setisLoading(false);
    }
  };

  // Filtered data
  const filteredData = data.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container">
        <div className="row mt-3  mt-sm-0 d-flex justify-content-between  align-items-center ">
          <div className="mb-2 col-sm-6 col-12 d-flex justify-content-between align-items-center text-center text-sm-start ">
            <span
              className=" fw-semibold "
              style={{ color: "rgb(26, 51, 208)" }}
            >
              Total Admin - {TotalAdmin}{" "}
            </span>
          </div>
          <div className="col-sm-4 col-12">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search Admin"
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

      <div className="container">
        <div className="row d-flex justify-content-center flex-column flex-sm-row">
          <div className="col-12 col-sm-6">
            <div className="row justify-content-center d-flex mt-xm-5 ">
              <div className="col-12 col-md-10 mt-4 mt-md-0">
                <div className="cards card rounded-4 border-0">
                  <div className="card-header border-0 text-center bg-transparent">
                    <h4
                      className="fw-bold h5 text-uppercase"
                      style={{ letterSpacing: "1.5px" }}
                    >
                      Admin
                    </h4>
                  </div>

                  <div className="card-body text-start gap-3 d-flex flex-column">
                    <label htmlFor="" className="">
                      Admin User Name
                    </label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Admin User Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>

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
                      className="rounded submit text-uppercase fw-bold w-100 py-2"
                      onClick={btn ? AddUser : UpdateUser}
                    >
                      {isloading ? (
                        <ThreeDot color="#ffffff" size="medium" text="" />
                      ) : btn ? (
                        "Add Admin"
                      ) : (
                        "Update Admin"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="container mt-4 mb-5">
              <div className="table-responsive mt-5 shadow-sm">
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
                              disabled={!btn}
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
          </div>
        </div>
      </div>

      <div className="container mt-5" style={{ width: "90%" }}></div>

      <div className="card-footer"></div>

      {/* User Table */}
    </>
  );
};

export default AdminUserDetails;
