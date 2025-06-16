import React, { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { db } from "../Database.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { showWarning } from "../SweetAlert.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";

const HOD = () => {
  const nav = useNavigate();
  const [isloading, setisLoading] = useState(false);
  const [userName, SetUserName] = useState("");
  const [Password, SetPassword] = useState("");
  const [PasswordEye, SetPasswordEye] = useState(true);

  const login = async () => {
    if (!userName || !Password) {
      showWarning("Please Fill All requirement");
    } else {
      setisLoading(true);
      const toastId = toast.loading("Please Wait");
      try {
        const q = query(
          collection(db, "HOD"),
          where("username", "==", userName),
          where("password", "==", Password)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          toast.success("Login Success", { id: toastId });
          sessionStorage.setItem("HOD_Data", JSON.stringify(userDoc));
          nav("/HODLayout/StaffDetails");
        } else {
          toast.error("Invalid Username or Password", { id: toastId });
          setisLoading(false);
        }
      } catch (e) {
        toast.error(e.message, { id: toastId });
      }
    }
  };

  return (
    <div className="HOD">
      <div className="container mb-5 hod-bg">
        {/* Login Form */}
        <div className="row justify-content-center mt-3 ">
          <div className="col-12 text-center mb-4">
            <h2
              className="fw-bold text-primary text-uppercase"
              style={{ letterSpacing: "2px" }}
            >
              HOD Login
            </h2>
            <p
              className="text-primary text-uppercase fw-semibold"
              style={{ letterSpacing: "1px" }}
            >
              Enter your Username and Password
            </p>
          </div>

          <div className="col-12 col-md-6 col-lg-5 shadow-sm p-4  rounded">
            <div className="d-flex flex-column gap-4 hod-card">
              {/* Username */}
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <FaUserCircle />
                </span>
                <input
                  type="text"
                  className="form-control border border-primary"
                  placeholder="Username"
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
                {isloading ? (
                  <ThreeDot
                    color="#ffffff"
                    size="medium"
                    text=""
                    textColor=""
                  />
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HOD;
