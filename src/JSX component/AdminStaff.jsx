import { RiLockPasswordFill } from "react-icons/ri";
import { FaUserCircle, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const AdminStaff = () => {
  let nav = useNavigate();
  const [userName, SetUserName] = useState();
  const [Password, SetPassword] = useState();
  const [data, setData] = useState();
  // useEffect( ()=>{
  //   const login = () => {

  //   };
  // },[])
  return (
    <>
      <div className="container my-4">
        {/* Header */}
        {/* Login Form */}
        <div className="row justify-content-center mt-5">
          

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
