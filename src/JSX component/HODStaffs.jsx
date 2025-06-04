import React, { useContext } from "react";
import { VscFolderOpened } from "react-icons/vsc";
import { TiUserAdd } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import CreateStaffContext from "./CreateStaffContext";

const HODStaffs = () => {
  let { staffData } = useContext(CreateStaffContext);
  console.log(staffData);
  let { HODName, Department } = staffData || {};
  const nav = useNavigate();
  return (
    <>
     <div className="container shadow mt-sm-2 p-3 d-flex sticky-top bg-light justify-content-between">
        <div>
          <span
            className="p-2 rounded-pill fw-semibold"
            style={{ letterSpacing: "3px" }}
          >
            <span
              className="fw-semibold bg-primary text-light rounded-circle px-2 py-1"
              data-toggle="tooltip"
              data-placement="top"
              title={HODName}
              style={{cursor:"pointer"}}
            >
              {HODName?.[0]}
            </span>
          </span>
        </div>
        <div>
          <span className="fw-semibold" style={{ fontSize: "11px" }}>
            {Department?.slice(14)}
          </span>
        </div>
      </div>

      <div className=" d-flex justify-content-center mt-5 align-items-center flex-column">
        <div className="mt-5">
          <div
            onClick={() => {
              nav("/HODLayout/HOD_Cstaff");
            }}
            className="btn bg-gradient btn btn-primary d-flex px-5 btn-lg d-flex align-items-center justify-content-around "
          >
            <TiUserAdd />
            Create Staff
          </div>
        </div>
        <div className="mt-5">
          <div className="btn btn d-flex bg-gradient align-items-center justify-content-around btn-primary d-flex px-5 btn-lg">
            <VscFolderOpened />
            View Staffs
          </div>
        </div>
      </div>
    </>
  );
};

export default HODStaffs;
