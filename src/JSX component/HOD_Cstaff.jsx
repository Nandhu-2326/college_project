import React, { useEffect, useState } from "react";
import { FaSchool } from "react-icons/fa";
import { db } from "./Database.js";
import { collection, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";

const HOD_Cstaff = () => {
  

  return (
    <div className="container py-5">
      <h3 className="mb-4 text-center text-primary fw-bold">Create Staff</h3>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <div className="input-group-text bg-primary text-light">
              <FaSchool />
            </div>
            
          </div>

          <button className="btn btn-primary w-100 fw-bold">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default HOD_Cstaff;
