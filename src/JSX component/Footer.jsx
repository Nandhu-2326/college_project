import { FaUserShield, FaUserTie, FaUserGraduate } from "react-icons/fa6";
import { ImUserTie } from "react-icons/im";
import { FcAbout } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";
import "../JSX component/Style Component/footer.css";
const Footer = () => {
  const nav = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      <div className="footer-glass fixed-bottom">
        <div className="container">
          <div className="row justify-content-center">
            <div className="d-flex justify-content-around align-items-center text-uppercase flex-wrap px-2  gap-3">
              {/* HOD */}
              <div className="text-center">
                <ImUserTie
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  className={`footer-icon ${
                    [
                      "/HODLayout",
                      "/HODLayout/StaffDetails",
                      "/HODLayout/StudentCSV",
                      "/HODLayout/SingleStudentdata",
                      "/HODLayout/StudentList",
                      "/HODLayout/SubjectAlert",
                    ].includes(currentPath)
                      ? "active-icon"
                      : ""
                  }`}
                  onClick={() => nav("/HODLayout")}
                />
                <p className="" style={{ fontSize: "13px" }}>
                  HOD
                </p>
              </div>

              {/* Admin */}
              <div className="text-center">
                <FaUserShield
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  className={`footer-icon ${
                    currentPath === "/AdminLogin" ? "active-icon" : ""
                  }`}
                  onClick={() => nav("/AdminLogin")}
                />
                <p style={{ fontSize: "13px" }}>Admin</p>
              </div>

              {/* Student */}
              <div className="text-center">
                <FaUserGraduate
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  className={`footer-icon ${
                    currentPath === "/" ? "active-icon" : ""
                  }`}
                  onClick={() => nav("/")}
                />
                <p style={{ fontSize: "13px" }}>Student</p>
              </div>

              {/* Staff */}
              <div className="text-center">
                <FaUserTie
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  className={`footer-icon ${
                    [
                      "/StaffLayout",
                      "/StaffLayout/LoginPage",
                      "/StaffLayout/StaffSubjects",
                      "/StaffLayout/MarkEntry",
                      "/StaffLayout/PDFResult",
                    ].includes(currentPath)
                      ? "active-icon"
                      : ""
                  }`}
                  onClick={() => nav("/StaffLayout")}
                />
                <p style={{ fontSize: "13px" }}>Staff</p>
              </div>

              {/* About */}
              <div className="text-center">
                <FcAbout
                  style={{ fontSize: "30px", cursor: "pointer" }}
                  className={`footer-icon ${
                    currentPath === "/About" ? "active-icon" : ""
                  }`}
                  onClick={() => nav("/About")}
                />
                <p style={{ fontSize: "13px" }}>About</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
