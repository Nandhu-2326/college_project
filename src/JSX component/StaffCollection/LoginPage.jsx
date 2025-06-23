import React, { useState } from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { db } from "../Database.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { showWarning } from "../SweetAlert.jsx";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
// import "../Style Component/HOD.css";

const LoginPage = () => {
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
          collection(db, "Allstaffs"),
          where("UserName", "==", userName),
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
          setisLoading(false);
        }
      } catch (e) {
        toast.error(e.message, { id: toastId });
      }
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="HOD ">
        <div className="container mb-5 hod-bg" style={{ width: "90%" }}>
          <div className="row justify-content-center d-flex">
            <div className="col-12 col-md-6 col-lg-5 mt-4  ">
              <div className="card  position-relative pt-5">
                {/* Floating Circle Icon */}
                <img
                  src="./staff.png"
                  alt=""
                  style={{ width: "70px" }}
                  className="img img-fluid position-absolute top-0 start-50 translate-middle topIcons z-1"
                />

                <div className="card-header border-0 text-center">
                  <h4
                    className="fw-bold h5 label text-uppercase"
                    style={{ letterSpacing: "1.5px" }}
                  >
                    Staff Login
                  </h4>
                </div>

                <div className="card-body d-flex flex-column gap-3">
                  {/* Username */}
                  <label htmlFor="" className="label">
                    Username
                  </label>
                  <div className="input-group">
                    <span className="input-group-text border icons">
                      <img
                        src="./profile.png"
                        style={{ width: "25px" }}
                        alt=""
                        className="img-fluid"
                      />
                    </span>
                    <input
                      type="text"
                      className="form-control "
                      placeholder="Username"
                      onChange={(e) => SetUserName(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <label htmlFor="" className="label">
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text border icons">
                      <img
                        src="./password.png"
                        style={{ width: "25px" }}
                        alt=""
                        className="img-fluid"
                      />
                    </span>
                    <input
                      type={PasswordEye ? "password" : "text"}
                      className="form-control border-end-0"
                      placeholder="Password"
                      onChange={(e) => SetPassword(e.target.value)}
                    />
                    <span
                      className="input-group-text rounded rounded-start-0 icons "
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
      </div>
    </>
  );
};

export default LoginPage;
