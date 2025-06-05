import React, { useEffect, useReducer, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { TbPasswordUser } from "react-icons/tb";
import { RiNumber1, RiNumber2, RiNumber3 } from "react-icons/ri";

const HOD_Cstaff = () => {
  const [hodData, setHOD] = useState("");
  const reducer = (state, action) => {
    return {
      ...state,
      [action.field]: action.value,
    };
  };
  const [state, dispatch] = useReducer(reducer, {});
  const fetchData = () => {
    const data = sessionStorage.getItem("HOD_Data");
    const HODdata = JSON.parse(data);
    console.log(HODdata);
    setHOD(HODdata);
  };
  console.log(state);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="container-fluid bg-primary bg-gradient text-light sticky-top d-flex justify-content-between align-items-center ">
        <p className="fw-semibold"> HOD : {hodData.HODName}</p>
        <p className="fw-semibold">
          Department : {hodData.Department?.slice(14)}
        </p>
      </div>

      <div className="container mb-5">
        <h1
          className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px" }}
        >
          Create New Staff
        </h1>

        <div className="row p-1 ">
          {[1, 2, 3].map((value, index) => (
            <div className=" col-sm-4 " key={index}>
              <div className="input-group mt-4">
                <span className="input-group-text text-light bg-primary bg-gradient">
                  {value == 1 ? (
                    <FaUserCircle />
                  ) : value == 2 ? (
                    <FaClipboardUser />
                  ) : (
                    <TbPasswordUser />
                  )}
                </span>
                <input
                  type="text"
                  className="form-control"
                  name={
                    value == 1
                      ? "staffName "
                      : value == 2
                      ? "staffUserName"
                      : "staffPassword"
                  }
                  onChange={(e) => {
                    dispatch({ field: e.target.name, value: e.target.value });
                  }}
                  placeholder={
                    value == 1
                      ? "Staff Name"
                      : value == 2
                      ? "Staff User Name"
                      : "Staff Password"
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <h1
          className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px" }}
        >
          alert Subject
        </h1>
        <h6
          className="h1 text-uppercase mt-3 text-primary fw-semibold text-center"
          style={{ letterSpacing: "2.5px", fontSize: "12px" }}
        >
          for staff
        </h6>

        <div className="row mb-5">
          {("ug" == "ug" ? [1, 2, 3] : [1, 2]).map((value) => (
            <div
              className={
                "ug" == "ug" ? "col-12 col-sm-4 mt-4" : "col-12 col-sm-6 mt-4"
              }
            >
              {" "}
              <span
                className="fw-bold text-uppercase d-flex justify-content-center"
                style={{ letterSpacing: "5px" }}
              >{`${value} - Year `}</span>
              {[1, 2, 3].map((vals) => (
                <div className="input-group mt-3">
                  <span className="input-group-text text-light bg-primary bg-gradient">
                    {vals == 1 ? (
                      <RiNumber1 />
                    ) : vals == 2 ? (
                      <RiNumber2 />
                    ) : (
                      <RiNumber3 />
                    )}
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name={` s${value}_${vals}`}
                    onChange={(e) => {
                      dispatch({
                        field: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    placeholder={`Subject Name ${vals}`}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="container  d-flex justify-content-center">
          <button
            style={{ letterSpacing: "5px" }}
            className="btn btn-primary fw-semibold mb-5 bg-gradient text-uppercase"
          >
            save
          </button>
        </div>
      </div>
    </>
  );
};

export default HOD_Cstaff;
