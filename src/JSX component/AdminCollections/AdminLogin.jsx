import bcrypt from "bcryptjs";
import React, { useState } from "react";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { db } from "../Database.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { showWarning } from "../SweetAlert.jsx";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
import "../Style Component/HOD.css";

const AdminLogin = () => {
  const nav = useNavigate();
  const [isloading, setisLoading] = useState(false);
  const [userName, SetUserName] = useState("");
  const [Password, SetPassword] = useState("");
  const [PasswordEye, SetPasswordEye] = useState(true);

  const login = async () => {
    if (!userName || !Password) {
      return showWarning("Please Fill All requirement");
    }
    setisLoading(true);
    try {
      const q = query(
        collection(db, "Admin"),
        where("username", "==", userName)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("Invalid Username");
        return;
      }

      const userDoc = querySnapshot.docs[0].data();
      const storedHashedPassword = userDoc.password;

      // 2. Compare password
      const isMatch = await bcrypt.compare(Password, storedHashedPassword);
      if (isMatch) {
        toast.success("Login Success");
        nav("/AdminLayout/AdminUserPage");
      } else {
        toast.error("Invalid Password");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="container mt-5" style={{ width: "90%" }}>
        <div className="row justify-content-center d-flex mt-xm-5 mt-md-0">
          <div className="col-12 col-md-6 col-lg-5 mt-4  mt-md-0">
            <div className="card cards position-relative ">
              {/* Floating Circle Icon */}

              <div className="card-header border-0 text-center">
                <h4
                  className="fw-bold label h5 text-uppercase"
                  style={{ letterSpacing: "1.5px" }}
                >
                  Admin Login
                </h4>
              </div>

              <div className="card-body d-flex flex-column gap-3">
                {/* Username */}
                <label htmlFor="" className="">
                  User Name
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control "
                    placeholder="Username"
                    onChange={(e) => SetUserName(e.target.value)}
                  />
                </div>

                {/* Password */}
                <label htmlFor="" className="">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={PasswordEye ? "password" : "text"}
                    className="form-control "
                    placeholder="Password"
                    onChange={(e) => SetPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text icons "
                    style={{ cursor: "pointer" }}
                    onClick={() => SetPasswordEye(!PasswordEye)}
                  >
                    {PasswordEye ? <FaEyeSlash /> : <FaRegEye />}
                  </span>
                </div>
              </div>

              <div className="card-footer mt-2  border-0 text-center">
                <button
                  className="rounded logbtn text-uppercase fw-bold w-100 py-2"
                  onClick={login}
                >
                  {isloading ? (
                    <ThreeDot color="#ffffff" size="medium" text="" />
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
