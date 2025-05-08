import { useEffect, useState } from "react";
import CollegeLogo from "./CollegeLogo";
import { CiLogout } from "react-icons/ci";
import { PiStudentBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
// import { RiBook3Line } from "react-icons/ri";
// import { SiGoogleclassroom } from "react-icons/si";
// import { db } from "./Database.js";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   deleteDoc,
//   doc,
//   getDoc,
// } from "firebase/firestore";
import Swal from "sweetalert2";
import DegPage from "./DegPage.jsx";

const UserSelect = () => {
  let nav = useNavigate();
  // state
  const [selectRs, setSelectRs] = useState();
  const [selectDeg, setSelectDeg] = useState();
  // const [data, setData] = useState();
  // const studentGetData = async () => {
  //   const getData = await getDocs(collection(db, "student"));
  //   const allData = getData.docs.map((val) => ({
  //     id: val.id,
  //     ...val.data(),
  //   }));
  //   setData(allData);
  // };
  // useEffect(() => {
  //   studentGetData();
  // }, []);
  // Sweet Animation
  const InformationError = () => {
    Swal.fire({
      html: "Please Fill Information",
      timer: 1000,
      icon: "warning",
      showConfirmButton: false,
    });
  };

  // function's
  const next = () => {
    if (!selectDeg || !selectRs) {
      InformationError();
    } else {
      // let filterdata = data.filter((val) => {
      //   return val.ugorpg == selectDeg && val.rs == selectRs;
      // });
      // filterdata.map((val) => {
      //   console.log(val.ugorpg);
      //   console.log(val.rs);
      // });
      nav("/DegPage", {
        state: {
          rs: selectRs,
          deg: selectDeg,
        },
      });
    }
  };
  return (
    <>
      <CollegeLogo />
      <div className="container my-4">
        <div className="d-flex justify-content-end bg-primary p-3 rounded shadow-sm">
          <button
            onClick={() => nav("/")}
            className="btn btn-outline-light d-flex align-items-center gap-2 fw-semibold"
          >
            Logout <CiLogout size={20} />
          </button>
        </div>
        <div className="text-center mt-5 mb-4">
          <h2 className="fw-bold text-primary">Select Student Details</h2>
          <p className="text-muted">
            Please choose all the required fields below
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Regular/Self */}
          <div className="col-12 col-md-5">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                <PiStudentBold />
              </span>

              <select
                className="form-select"
                onChange={(e) => setSelectDeg(e.target.value)}
              >
                <option value="">-- Select UG or PG --</option>
                <option value="ug">UG</option>
                <option value="pg">PG</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-primary text-white fw-bold">
                RS
              </span>

              <select
                className="form-select"
                onChange={(e) => setSelectRs(e.target.value)}
              >
                <option value="">-- Select Regular or Self --</option>
                <option value="regular">Regular</option>
                <option value="self">Self</option>
              </select>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary mt-5 " onClick={next}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
  // return (
  //   <>
  //     <div className="container my-4">
  //       {/* Logout Button */}

  //       {/* Title */}

  //       {/* Selection Form */}

  //         {/* UG / PG */}
  //         <div className="col-12 col-md-5">
  //           <div className="input-group shadow-sm">
  //             <span className="input-group-text bg-primary text-white">
  //               <PiStudentBold />
  //             </span>
  //             <select className="form-select">
  //               <option value="">-- Select UG or PG --</option>
  //               <option value="ug">Undergraduate (UG)</option>
  //               <option value="pg">Postgraduate (PG)</option>
  //             </select>
  //           </div>
  //         </div>

  //         {/* Course */}
  //         <div className="col-12 col-md-5">
  //           <div className="input-group shadow-sm">
  //             <span className="input-group-text bg-primary text-white">
  //               <RiBook3Line />
  //             </span>
  //             <select className="form-select">
  //               <option value="">-- Select Course --</option>
  //               {/* Add your course options here */}
  //             </select>
  //           </div>
  //         </div>

  //         {/* Year */}
  //         <div className="col-12 col-md-5">
  //           <div className="input-group shadow-sm">
  //             <span className="input-group-text bg-primary text-white">
  //               <PiStudentBold />
  //             </span>
  //             <select className="form-select">
  //               <option value="">-- Select Year --</option>
  //               <option value="I Year">I Year</option>
  //               <option value="II Year">II Year</option>
  //               <option value="III Year">III Year</option>
  //             </select>
  //           </div>
  //         </div>

  //         {/* Class */}
  //         <div className="col-12 col-md-5">
  //           <div className="input-group shadow-sm">
  //             <span className="input-group-text bg-primary text-white">
  //               <SiGoogleclassroom />
  //             </span>
  //             <select className="form-select">
  //               <option value="">-- Select Class --</option>
  //               <option value="Class_A">Class A</option>
  //               <option value="Class_B">Class B</option>
  //             </select>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Submit Button */}
  //       <div className="d-flex justify-content-center mt-5">
  //         <button
  //           className="btn btn-primary px-5 py-2 fw-bold shadow-sm"
  //           onClick={() => nav("/CalculatorPage")}
  //         >
  //           Submit
  //         </button>
  //       </div>
  //     </div>
  //   </>
  // );
};

export default UserSelect;
