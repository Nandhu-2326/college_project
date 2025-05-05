import CollegeLogo from "./CollegeLogo";
import { RiAdminFill } from "react-icons/ri";
import { CiCalendarDate, CiLogin } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
// import AdminLogin from "./AdminLogin";
import { useNavigate } from "react-router-dom";

const FirstPage = () => {
  let nav = useNavigate();
  let admin = () => {
    nav("/AdminLogin");
  };
  let login = () => {
    nav("/LoginPage");
  };
  return (
    <>
      <CollegeLogo />
      <div className="container mt-3">
        {/* Top NavBar */}
        <div className="row">
          <div className="col-12 bg-primary text-white rounded shadow-sm p-3 d-flex justify-content-between align-items-center">
            <button
              onClick={admin}
              className="btn btn-outline-light d-flex align-items-center gap-2"
            >
              <RiAdminFill />
              Admin
            </button>
            <button
              onClick={login}
              className="btn btn-outline-light d-flex align-items-center gap-2"
            >
              <CiLogin />
              Login
            </button>
          </div>
        </div>

        {/* Result Form */}
        <div className="row justify-content-center mt-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold text-primary">Check Your Result</h2>
            <p className="text-muted">
              Enter your roll number and date of birth
            </p>
          </div>

          <div className="col-12 col-md-6 col-lg-5 bg-light p-4 rounded shadow-sm">
            <form className="d-flex flex-column gap-4">
              {/* Roll Number */}
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <FaRegUserCircle />
                </span>
                <input
                  type="text"
                  className="form-control border border-primary"
                  placeholder="EX 22UCS138"
                />
              </div>

              {/* DOB */}
              <div className="input-group">
                <span className="input-group-text bg-primary text-white">
                  <CiCalendarDate />
                </span>
                <input
                  type="date"
                  className="form-control border border-primary"
                />
              </div>

              {/* Submit */}
              <button className="btn btn-primary fw-bold py-2">
                View Result
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mark List Table */}
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Student Mark List</h2>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped align-middle text-center shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Assignment</th>
                <th>Seminar</th>
                <th>Internal - I</th>
                <th>Internal - II</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FirstPage;
