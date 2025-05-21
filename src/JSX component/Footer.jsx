import { FaUserShield, FaUserTie } from "react-icons/fa6";
import { SiHomeadvisor } from "react-icons/si";
import { useNavigate } from "react-router-dom";

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
      <div className="d-flex justify-content-center align-items-center fixed-bottom   ">
        <div className="row">
          <div className="col border border-primary rounded rounded-pill border-2 bg-light shadow shadow-md px-5">
            <div className="d-flex justify-content-center align-items-center ">
              <div className="d-flex justify-content-center px-3 flex-column  align-items-center">
                <FaUserShield
                  style={{ fontSize: "25px" }}
                  className="text-primary"
                  onClick={admin}
                />
                <p className="text-primary ">Admin</p>
              </div>
              <div className="d-flex mt-1 justify-content-center px-3 flex-column align-items-center">
                <SiHomeadvisor
                  style={{ fontSize: "35px" }}
                  className=" text-primary"
                  onClick={() => {
                    nav("/");
                  }}
                />
                <p className="text-primary ">Home</p>
              </div>
              <div className="d-flex justify-content-center px-3 flex-column align-items-center">
                <FaUserTie
                  style={{ fontSize: "25px" }}
                  className=" text-primary "
                  onClick={login}
                />
                <p className="text-primary ">User</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
