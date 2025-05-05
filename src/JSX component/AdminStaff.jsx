import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const AdminStaff = () => {
  let nav = useNavigate();
  const [userName, SetUserName] = useState();
  const [Password, SetPassword] = useState();
  const dbUserName = ["Nandu", "Arun", "Yogesh"];
  const dbPassword = ["138", "110", "162"];
  const login = () => {
    let dbUserNameFilter = dbUserName.filter((val) => {
      return val == userName;
    });
    let dbPasswordFilter = dbPassword.filter((val) => {
      return val == Password;
    });

    if (dbUserNameFilter == userName && dbPasswordFilter == Password) {
      alert("Login Success");
      nav("/AdminUserPage/AdminUserDetails");
    } else {
      alert("Please Valid UserName and Password");
    }
  };
  return (
    <>
      <div className="container my-4">
        {/* Header */}
        {/* Login Form */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold text-primary">New User</h2>
            <p className="text-muted">
              Add User or Edit User Name and Password
            </p>
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
                  type="password"
                  className="form-control border border-primary"
                  placeholder="Password"
                  onChange={(e) => SetPassword(e.target.value)}
                />
              </div>

              {/* Login Button */}
              <button className="btn btn-primary fw-bold py-1" onClick={login}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminStaff;
