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
// import "./HOD.css"; // Make sure this line exists if styles are in a separate CSS file

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
    <div className="HOD mt-0">
      <div className="container mb-5 hod-bg">
        <div className="row justify-content-center ">
          <div className="col-12 col-md-6 col-lg-5 mt-4">
            <div className="card shadow-sm position-relative pt-5">
              {/* Floating Circle Icon */}
              <FaUserCircle className="position-absolute top-0 start-50 translate-middle topIcons z-1" />

              <div className="card-header text-center ">
                <h4
                  className="fw-bold text-light h5 text-uppercase"
                  style={{ letterSpacing: "1.5px" }}
                >
                  HOD Login
                </h4>
              </div>

              <div className="card-body d-flex flex-column gap-4">
                {/* Username */}
                <div className="input-group">
                  <span className="input-group-text bg-primary border-0 text-white">
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
                  <span className="input-group-text border-0 bg-primary text-white">
                    <RiLockPasswordFill />
                  </span>
                  <input
                    type={PasswordEye ? "password" : "text"}
                    className="form-control border border-end-0 border-primary"
                    placeholder="Password"
                    onChange={(e) => SetPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text  border-1 bg-white eye border-primary border-start-0 "
                    style={{ cursor: "pointer" }}
                    onClick={() => SetPasswordEye(!PasswordEye)}
                  >
                    {PasswordEye ? <FaEyeSlash /> : <FaRegEye />}
                  </span>
                </div>
              </div>

              <div className="card-footer  border-0 text-center">
                <button
                  className="btn btn-primary text-uppercase fw-bold w-100 py-2"
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
    </div>
  );
};

export default HOD;
