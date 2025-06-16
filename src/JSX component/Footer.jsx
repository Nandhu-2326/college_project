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
      <div className="footer-glass fixed-bottom">
  <div className="container">
    <div className="row justify-content-center">
      <div className="d-flex justify-content-around align-items-center text-uppercase flex-wrap gap-2">
        {/* HOD */}
        <div className="text-center">
          <ImUserTie
            style={{ fontSize: "30px", cursor: "pointer" }}
            className="text-primary footer-icon"
            onClick={() => nav("/HODLayout")}
          />
          <p className="text-primary small mb-0">HOD</p>
        </div>

        {/* Admin */}
        <div className="text-center">
          <FaUserShield
            style={{ fontSize: "30px", cursor: "pointer" }}
            className="text-primary footer-icon"
            onClick={admin}
          />
          <p className="text-primary small mb-0">Admin</p>
        </div>

        {/* Student */}
        <div className="text-center">
          <FaUserGraduate
            style={{ fontSize: "30px", cursor: "pointer" }}
            className="text-primary footer-icon"
            onClick={() => nav("/")}
          />
          <p className="text-primary small mb-0">Student</p>
        </div>

        {/* Staff */}
        <div className="text-center">
          <FaUserTie
            style={{ fontSize: "30px", cursor: "pointer" }}
            className="text-primary footer-icon"
            onClick={() => nav("/StaffLayout")}
          />
          <p className="text-primary small mb-0">Staff</p>
        </div>

        {/* About */}
        <div className="text-center">
          <FcAbout
            style={{ fontSize: "30px", cursor: "pointer" }}
            className="footer-icon"
          />
          <p className="text-primary small mb-0">About</p>
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default Footer;
