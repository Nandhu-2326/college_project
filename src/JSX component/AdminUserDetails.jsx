import { FaCirclePlus } from "react-icons/fa6";
import { LuUserRoundSearch } from "react-icons/lu";
import { BiSolidEdit } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa6";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AdminUserDetails = () => {
  let nav = useNavigate();

  return (
    <>
      <div className="container  d-flex  justify-content-center mt-4">
        <div className="row d-flex justify-content-center ">
          <div className="col-12 text-primary d-flex  h1 justify-content-center align-items-center">
            {" "}
            Admin Details - <FaUserTie />
          </div>
          <div className="col-12 text-secondary text-center h6 mt-3 ">
            {" "}
            Search Admin or Add New Admin, Delete or Edit Admin
          </div>

          <div className="col-3 mt-3 d-flex justify-content-center">
            <button
              className="btn  btn-outline-primary fw-semibold d-flex align-items-center justify-content-between px-3"
              onClick={() => nav("/AdminUserPage/AdminStaff")}
            >
              {" "}
              <FaCirclePlus />
              <span>Add</span>
            </button>
          </div>
          <div className="col-9 col-sm-5 mt-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search User"
              />
              <span className="input-group-text bg-primary text-light ">
                <LuUserRoundSearch />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="table-responsive shadow-sm">
          <table className="table table-bordered table-hover table-striped align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>S.K.Ganesh Babu</td>
                <td>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => nav("/AdminUserPage/AdminStaff")}
                  >
                    <BiSolidEdit />
                  </button>
                </td>
                <td>
                  <button className="btn btn-outline-success">
                    <MdOutlineDeleteOutline />
                  </button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>T.N. Dinesh Sir</td>
                <td>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => nav("/AdminUserPage/AdminStaff")}
                  >
                    <BiSolidEdit />
                  </button>
                </td>
                <td>
                  <button className="btn btn-outline-success">
                    <MdOutlineDeleteOutline />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminUserDetails;
