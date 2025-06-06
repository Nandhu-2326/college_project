import React from "react";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { db } from "./Database.js";
import { collection, getDocs } from "firebase/firestore";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import {
  InformationError,
  loading,
  loginError,
  loginSuccess,
} from "./SweetAlert.jsx";
import { useNavigate } from "react-router-dom";

const HOD = () => {
  const nav = useNavigate()
  // UserName & Password
  const [userName, SetUserName] = useState("");
  const [Password, SetPassword] = useState("");
  const [data, setData] = useState([]);
  const [PasswordEye, SetPasswordEye] = useState(true);
  const [StaffData, setStaffData] = useState(null);

  let fetchData = async () => {
    let getData = await getDocs(collection(db, "HOD"));
    let data = getData.docs.map((val) => ({
      id: val.id,
      ...val.data(),
    }));
    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const login = async () => {
    if (!userName || !Password) {
      InformationError();
    } else {
      try {
        loading();
        let filterData = data.filter((val) => {
          return val.username == userName && val.password == Password;
        });

        if (filterData.length > 0) {
          loginSuccess();
          sessionStorage.setItem("HOD_Data", JSON.stringify(filterData[0]));
          nav("/HODLayout/HOD_Cstaff")
        } else {
          loginError();
        }
      } catch (e) {
        alert(e.message);
      }
    }
  };

  return (
    <>
      {
        <div className="container my-4 mb-5">
          {/* Login Form */}
          <div className="row justify-content-center mt-5">
            <div className="col-12 text-center mb-4">
              <h2 className="fw-bold text-primary">HOD Login</h2>
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
                    onChange={(e) => SetUserName(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="input-group">
                  <span className="input-group-text bg-primary text-white">
                    <RiLockPasswordFill />
                  </span>
                  <input
                    type={PasswordEye ? "Password" : "text"}
                    className="form-control border border-primary"
                    placeholder="password"
                    onChange={(e) => SetPassword(e.target.value)}
                  />
                  <span
                    className="input-group-text bg-primary text-light"
                    style={{ cursor: "pointer" }}
                  >
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

                {/* Login Button */}
                <button
                  className="btn btn-primary fw-bold py-1"
                  onClick={() => {
                    login();
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default HOD;
