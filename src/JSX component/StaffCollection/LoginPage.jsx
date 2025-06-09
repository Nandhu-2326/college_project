import React, { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { db } from "../Database.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { showWarning } from "../SweetAlert.jsx";

const LoginPage = () => {
  const nav = useNavigate();

  const [UserName, SetUserName] = useState("");
  const [Password, SetPassword] = useState("");
  const [PasswordEye, SetPasswordEye] = useState(true);

  const login = async () => {
    if (!UserName || !Password) {
      showWarning("Please Fill All requirement");
    } else {
      const toastId = toast.loading("Please Wait");
      try {
        const q = query(
          collection(db, "Allstaffs"),
          where("UserName", "==", UserName),
          where("Password", "==", Password)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const userDoc = { id: docSnap.id, ...docSnap.data() };
          toast.success("Login Success", { id: toastId });
          sessionStorage.setItem("staff_Data", JSON.stringify(userDoc));
          nav("/StaffLayout/StaffSubjects");
        } else {
          toast.error("Invalid Username or Password", { id: toastId });
        }
      } catch (e) {
        toast.error(e.message, { id: toastId });
      }
    }
  };

  return (
    <div className="container my-4 mb-5">
      {/* Login Form */}
      <div className="row justify-content-center mt-5">
        <div className="col-12 text-center mb-4">
          <h2 className="fw-bold text-primary text-uppercase">staff Login</h2>
          <p className="text-muted">Enter your Username and Password</p>
        </div>

        <div className="col-12 col-md-6 col-lg-5 shadow-sm p-4 bg-light rounded">
          <div className="d-flex flex-column gap-4">
            {/* Username */}
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaUserCircle />
              </span>
              <input
                type="text"
                className="form-control border border-primary"
                placeholder="Username"
                value={UserName}
                onChange={(e) => SetUserName(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <RiLockPasswordFill />
              </span>
              <input
                type={PasswordEye ? "password" : "text"}
                className="form-control border border-primary"
                placeholder="Password"
                value={Password}
                onChange={(e) => SetPassword(e.target.value)}
              />
              <span
                className="input-group-text bg-primary text-light"
                style={{ cursor: "pointer" }}
              >
                {PasswordEye ? (
                  <FaEyeSlash onClick={() => SetPasswordEye(false)} />
                ) : (
                  <FaRegEye onClick={() => SetPasswordEye(true)} />
                )}
              </span>
            </div>

            {/* Login Button */}
            <button className="btn btn-primary fw-bold py-1" onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
