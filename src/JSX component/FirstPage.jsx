import CollegeLogo from "./CollegeLogo";
import { CiCalendarDate} from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import Footer from "./Footer";

const FirstPage = () => {
  return (
    <>
      <CollegeLogo />
      <div className="container mt-3 ">
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
              <button className="btn mb-5 btn-primary fw-bold py-2">
                View Result
              </button>
            </form>
          </div>
        </div>
      <Footer />
      </div>
    </>
  );
};

export default FirstPage;
