import { FaUserShield, FaUserTie } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ImUserTie } from "react-icons/im";
import { FaUserGraduate } from "react-icons/fa6";
import { FcAbout } from "react-icons/fc";
const Footer = () => {
  const nav = useNavigate();
  let admin = () => {
    nav("/AdminLogin");
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center fixed-bottom shadow shadow-md border-0 border-3 border-top border-primary "
        style={{ background: "white" }}
      >
        <div className="row">
          <div className="col  px-5 text-uppercase">
            <div className="d-flex justify-content-center align-items-center ">
              <div className="d-flex justify-content-center mx-1 px-1 flex-column  align-items-center">
                <ImUserTie
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  className="text-primary"
                  onClick={() => {
                    nav("/HODLayout");
                  }}
                />
                <p className="text-primary ">HOD</p>
              </div>
              <div className="d-flex justify-content-center mx-1 px-1 flex-column  align-items-center">
                <FaUserShield
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  className="text-primary"
                  onClick={admin}
                />
                <p className="text-primary ">Admin</p>
              </div>
              <div className="d-flex mt-1 mx-2 justify-content-center px-1  flex-column align-items-center">
                <FaUserGraduate
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  className=" text-primary "
                  onClick={() => {
                    nav("/");
                  }}
                />
                <p className="text-primary ">student</p>
              </div>
              <div className="d-flex justify-content-center px-1 flex-column align-items-center">
                <FaUserTie
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  className=" text-primary "
                  onClick={() => {
                    nav("/StaffLayout");
                  }}
                />
                <p className="text-primary ">Staff</p>
              </div>
              <div className="d-flex justify-content-center  ms-2 flex-column align-items-center">
                <FcAbout
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  className=" text-primary "
                />
                <p className="text-primary ">About</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
