import CollegeLogo from "../CollegeLogo";
import Footer from "../Footer";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../Database.js";
import { collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const AdminLogin = () => {
  const nav = useNavigate();
  const [userName, SetUserName] = useState();
  const [Password, SetPassword] = useState();
  const [data, setData] = useState();
  const [PasswordEye, SetPasswordEye] = useState(true);

  useEffect(() => {
    let fetchData = async () => {
      let getData = await getDocs(collection(db, "Admin"));
      let data = getData.docs.map((val) => ({
        id: val.id,
        ...val.data(),
      }));
      setData(data);
    };
    fetchData();
  }, []);

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
  const loginError = () => {
    Swal.fire({
      html: "invalid username and Password ",
      icon: "error",
      title: "Oops",
      timer: 2000,
    });
  };
  const loginSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Login Success",
      timer: 2000,
    });
  };
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
          nav("/AdminUserPage");
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
      <CollegeLogo />

      <div className="container my-4">
        {/* Login Form */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold text-primary">Admin Login</h2>
            <p className="text-muted">Enter your credentials to continue</p>
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
                  className="form-control border border-primary "
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

              {/* Login Button */}
              <button className="btn btn-primary fw-bold py-1" onClick={login}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
