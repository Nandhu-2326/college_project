import React, { useState } from "react";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { db } from "../Database.js";
import { collection, query, where, getDocs } from "firebase/firestore";
import { showWarning } from "../SweetAlert.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ThreeDot } from "react-loading-indicators";
import { hash } from "bcryptjs";
import bcrypt from "bcryptjs";

// import "../Style Component/HOD.css";

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
      try {
        const q = query(
          collection(db, "HOD"),
          where("username", "==", userName)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          const storedHashedPassword = userDoc.password;
          const hashedpassword = await bcrypt.compare(
            Password,
            storedHashedPassword
          );
          if (hashedpassword) {
            toast.success("Login Success");
            sessionStorage.setItem("HOD_Data", JSON.stringify(userDoc));
            nav("/HODLayout/StaffDetails");
            setisLoading(false);
          } else {
            setisLoading(false);
            toast.error("Invalid Password");
          }
        } else {
          toast.error("Invalid Username");
          setisLoading(false);
        }
      } catch (e) {
        setisLoading(false);
        toast.error(e.message);
      }
    }
  };

  return (
    <div className="container mt-5" style={{ width: "90%" }}>
      <div className="row justify-content-center d-flex mt-xm-5 mt-md-0">
        <div className="col-12 col-md-6 col-lg-5 mt-4 mt-md-0">
          <div className="cards card">
            <div className="card-header border-0 text-center">
              <h4
                className="fw-bold h5 text-uppercase"
                style={{ letterSpacing: "1.5px" }}
              >
                HOD Login
              </h4>
            </div>

            <div className="card-body d-flex flex-column gap-3">
              {/* Username */}
              <label htmlFor="" className=" ">
                User Name
              </label>
              <div className="">
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
                  className="input-group-text icons rounded-end"
                  style={{ cursor: "pointer" }}
                  onClick={() => SetPasswordEye(!PasswordEye)}
                >
                  {PasswordEye ? <FaEyeSlash /> : <FaRegEye />}
                </span>
                <p className=""> </p>
              </div>
            </div>

            <div className="card-footer  border-0 text-center">
              <button
                className="rounded hodbtn text-uppercase fw-bold w-100 py-2"
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
  );
};

export default HOD;
