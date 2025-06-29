import React, { useEffect, useState } from "react";
import { db } from "../Database";
import { collection, doc, getDocs } from "firebase/firestore";
import { HashLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const StaffSubjects = () => {
  const nav = useNavigate();
  const [StaffData, setStaffData] = useState({});
  const [STsubject, setSTsubject] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const SendValue = (value) => {
    console.log(value);
    sessionStorage.setItem("Subject", JSON.stringify(value));
    nav("/StaffLayout/MarkEntry");
  };
  const fetchData = () => {
    const data = sessionStorage.getItem("staff_Data");
    const staffdata = JSON.parse(data);
    setStaffData(staffdata);
  };

  const getSTubject = async (id) => {
    try {
      const stDoc = doc(db, "Allstaffs", id);
      const stCollection = await getDocs(collection(stDoc, "subject"));
      const stData = stCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSTsubject(stData);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      toast.error("No data");
    }
  };

  useEffect(() => {
    fetchData();
    setIsLoading(true);
  }, []);
  useEffect(() => {
    if (StaffData.id) {
      getSTubject(StaffData.id);
    }
  }, [StaffData]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "75vh" }}
      >
        <HashLoader color="#1e90ff" size={75} />
      </div>
    );
  }
  return (
    <>
      <div
        style={{ backgroundColor: "#d5181c", overflowX: "hidden" }}
        className="container-fluid d-md-none bg-gradient text-light sticky-top p-2 "
      >
        <div className="row ">
          <div className="col-2 text-sm-end">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/StaffLayout");
              }}
            >
              <img src="/back.png" width={25} alt="" className="img img-flui" />
            </button>
          </div>
          <div className="col-4 d-flex justify-content-start align-items-center">
            <Stack direction="row" spacing={2}>
              <Chip
                avatar={
                  <Avatar style={{ color: "white", background: "#d5181c" }}>
                    {StaffData?.staffName?.slice(0, 1) || ""}
                  </Avatar>
                }
                label={StaffData?.staffName}
                sx={{
                  width: 100,
                  bgcolor: "#fff", // white chip background
                  color: "#000", // black text
                  border: "1px solid #ccc", // optional subtle border
                  fontWeight: 500, // optional: stronger text
                }}
              />
            </Stack>
          </div>
          <div className="col-6  d-flex justify-content-center align-items-center ">
            <p className="fw-semibold m-0 text-center">
              D-Code {StaffData?.DepartmentCode || ""}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{ overflowX: "hidden" }}
        className="container-fluid d-none d-md-block bg-light bg-gradient text-light sticky-top p-2 "
      >
        <div className="row ">
          <div className="col-2 text-sm-end">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/StaffLayout");
              }}
            >
              <img
                src="/arrow-left.png"
                width={25}
                alt=""
                className="img img-flui"
              />
            </button>
          </div>
          <div className="col-4 d-flex justify-content-start align-items-center">
            <Stack direction="row" spacing={2}>
              <Chip
                avatar={
                  <Avatar style={{ color: "white", background: "#d5181c" }}>
                    {StaffData?.staffName?.slice(0, 1) || ""}
                  </Avatar>
                }
                label={StaffData?.staffName}
                sx={{
                  width: 100,
                  bgcolor: "#fff", // white chip background
                  color: "#000", // black text
                  border: "1px solid #ccc", // optional subtle border
                  fontWeight: 500, // optional: stronger text
                }}
              />
            </Stack>
          </div>
          <div className="col-6  d-flex justify-content-center align-items-center ">
            <p
              className="fw-semibold  text-center"
              style={{ color: "#d5181c" }}
            >
              D-Code {StaffData?.DepartmentCode || ""}
            </p>
          </div>
        </div>
      </div>

      <div className="container mt-4 p-2">
        <h3
          className="h3 text-uppercase text-center fw-bold"
          style={{ letterSpacing: "2px", color: "rgb(29, 51, 208)" }}
        >
          {" "}
          Your Subjects{" "}
        </h3>
      </div>

      <div className="table-responsive mt-4 mb-5 shadow-sm container rounded">
        <table className="table table-striped table-bordered mb-5">
          <thead className=" text-uppercase text-center table-primary">
            <tr>
              <th>S.No</th>
              <th>Subject</th>
              <th>Department & sf / regular</th>
              <th>Year & semester</th>
              <th>Class & Degree</th>
              <th>Enter Mark</th>
            </tr>
          </thead>

          <tbody className="text-center align-middle">
            {STsubject.length > 0 ? (
              STsubject.map((value, index) => {
                return (
                  <tr key={value.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">
                      <div className="d-flex flex-column justify-content-around">
                        <div className="text-center">{value.subject}</div>
                        <div>{value.TorL}</div>
                      </div>
                    </td>
                    <td className="fw-semibold">
                      <div className="d-flex justify-content-around flex-column">
                        <div>{value.department}</div>
                        <div>{value.rs.toUpperCase()}</div>
                      </div>
                    </td>
                    <td className="fw-semibold">
                      <div className="d-flex justify-content-around flex-column">
                        <div className="">Year : {value.year}</div>
                        <div>{value.semester}</div>
                      </div>
                    </td>
                    <td className="fw-semibold">
                      <div className="d-flex justify-content-around">
                        <div>{value.class}</div>
                        <div>{value.ugorpg.toUpperCase()}</div>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn border-0"
                        onClick={() => {
                          SendValue(value);
                        }}
                      >
                        <img
                          src="/edit.png"
                          width={30}
                          alt=""
                          className="img img-fluid"
                        />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr key={0}>
                <td colSpan={6}>
                  <div className="py-4 text-danger fw-bold text-uppercase">
                    No subject records found.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StaffSubjects;
