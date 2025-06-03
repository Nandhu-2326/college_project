import React from "react";
import { VscFolderOpened } from "react-icons/vsc";
import { TiUserAdd } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
// export const createSTaff = createContext();

const HODStaffs = () => {

  const nav = useNavigate();
  return (
    <>
      {/* <createSTaff.Provider value={data}>
        {isLoggedIn && <HOD_Cstaff />}
      </createSTaff.Provider> */}

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
