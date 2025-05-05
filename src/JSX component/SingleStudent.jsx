import { FaUsers, FaUser, FaUserGraduate } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { FcDepartment } from "react-icons/fc";
import { BsCalendar2Week } from "react-icons/bs";
import { TbNumber } from "react-icons/tb";

const SingleStudent = () => {
  return (
    <div className="container py-5">
      <div className="bg-light ">
        <h4 className="text-primary mb-4 text-center fw-bold">
          🎓 Student Information Form
        </h4>

        <div className="row g-4">
          {/* UG / PG */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">UG / PG</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaUserGraduate />
              </span>
              <select className="form-select">
                <option>-- Select UG or PG --</option>
                <option>UG (Undergraduate)</option>
                <option>PG (Postgraduate)</option>
              </select>
            </div>
          </div>

          {/* Class */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Class</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <SiGoogleclassroom />
              </span>
              <select className="form-select">
                <option>-- Select Class --</option>
                <option>Class A</option>
                <option>Class B</option>
              </select>
            </div>
          </div>

          {/* Department */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Department</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FcDepartment />
              </span>
              <select className="form-select">
                <option>-- Select Department --</option>
              </select>
            </div>
          </div>

          {/* Year */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Year</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaUsers />
              </span>
              <select className="form-select">
                <option>-- Select Year --</option>
                <option>I Year</option>
                <option>II Year</option>
                <option>III Year</option>
              </select>
            </div>
          </div>

          {/* Semester */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Semester</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <BsCalendar2Week />
              </span>
              <select className="form-select">
                <option>-- Select Semester --</option>
                <option>I</option>
                <option>II</option>
                <option>III</option>
                <option>IV</option>
                <option>V</option>
                <option>VI</option>
              </select>
            </div>
          </div>

          {/* Self or Regular */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Self / Regular</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white fw-bold">
                RS
              </span>
              <select className="form-select">
                <option>-- Select Self or Regular --</option>
                <option>Self (SF)</option>
                <option>Regular</option>
              </select>
            </div>
          </div>

          {/* Student Name */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Student Name</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <FaUser />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Student Name"
              />
            </div>
          </div>

          {/* Roll Number */}
          <div className="col-md-6">
            <label className="form-label fw-semibold">Roll Number</label>
            <div className="input-group">
              <span className="input-group-text bg-primary text-white">
                <TbNumber />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Roll Number"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center mt-4">
            <button className="btn btn-primary  px-5 shadow-sm rounded">
              Save Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleStudent;
