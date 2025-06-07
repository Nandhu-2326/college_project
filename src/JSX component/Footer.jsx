import { FaUserShield, FaUserTie } from "react-icons/fa6";
import { SiHomeadvisor } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { ImUserTie } from "react-icons/im";

const Footer = () => {
  const nav = useNavigate();
  let admin = () => {
    nav("/AdminLogin");
  };
  let login = () => {
    nav("/LoginPage");
  };
  return (
    <>
      <div
        className="d-flex justify-content-center  align-items-center fixed-bottom shadow shadow-md border-0 border-3 border-top border-primary "
        style={{ background: "white" }}
      >
        <div className="row">
          <div className="col  px-5 ">
            <div className="d-flex justify-content-center align-items-center ">
              <div className="d-flex justify-content-center mx-1 px-3 flex-column  align-items-center">
                <ImUserTie
                  style={{ fontSize: "35px" }}
                  className="text-primary"
                  onClick={() => {
                    nav("/HODLayout");
                  }}
                />
                <p className="text-primary ">HOD</p>
              </div>
              <div className="d-flex justify-content-center mx-1 px-3 flex-column  align-items-center">
                <FaUserShield
                  style={{ fontSize: "35px" }}
                  className="text-primary"
                  onClick={admin}
                />
                <p className="text-primary ">Admin</p>
              </div>
              <div className="d-flex mt-1 mx-2 justify-content-center px-3  flex-column align-items-center">
                <SiHomeadvisor
                  style={{ fontSize: "35px" }}
                  className=" text-primary "
                  onClick={() => {
                    nav("/");
                  }}
                />
                <p className="text-primary ">Home</p>
              </div>
              <div className="d-flex justify-content-center px-3 mx-1 flex-column align-items-center">
                <FaUserTie
                  style={{ fontSize: "35px" }}
                  className=" text-primary "
                  onClick={login}
                />
                <p className="text-primary ">Staff</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
