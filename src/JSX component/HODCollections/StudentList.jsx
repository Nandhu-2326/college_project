import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useReducer, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { db } from "../Database";
import toast from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { FaRotate } from "react-icons/fa6";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";

const initialStudentState = [];
const studentReducer = (state, action) => {
  switch (action.type) {
    case "SET_STUDENTS":
      return action.payload;
    default:
      return state;
  }
};

const StudentList = () => {
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showModalWhats, setShowModalWhats] = useState(false);
  const [WhatsAppsend, setWhatsAppsend] = useState("");
  const [activeStudent, setActiveStudent] = useState([]);
  const [hodData, setHOD] = useState({});
  const [UpDataStid, setUpStudentid] = useState();
  const [studentState, dispatch] = useReducer(
    studentReducer,
    initialStudentState
  );

  const { Department, HODName, ugorpg } = hodData;

  useEffect(() => {
    const data = sessionStorage.getItem("HOD_Data");
    if (data) {
      const HODdata = JSON.parse(data);
      setHOD(HODdata);
    }
  }, []);

  const fetchStudents = async () => {
    if (!Department) return;
    const q = query(
      collection(db, "student"),
      where("Department", "==", Department),
      orderBy("rollno")
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const students = snapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
        .sort((a, b) =>
          a.rollno?.localeCompare(b.rollno, undefined, { numeric: true })
        );
      dispatch({ type: "SET_STUDENTS", payload: students });
      const activeStudent = students.filter((stu) => {
        return stu.active == true;
      });
      console.log(activeStudent);
      setActiveStudent(activeStudent);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [Department]);

  const UpdateObject = {
    NameUP: "",
    rollnoUP: "",
    DepartmentUP: "",
    ugorpgUP: "",
    rsUP: "",
    yearUP: "",
    classUP: "",
    dobUP: "",
    PH: "",
  };

  const inputFields = [
    { label: "Name", name: "NameUP" },
    { label: "Roll No", name: "rollnoUP" },
    { label: "Department", name: "DepartmentUP" },
    { label: "UG or PG", name: "ugorpgUP" },
    { label: "Regular or Self", name: "rsUP" },
    { label: "Year", name: "yearUP" },
    { label: "Class", name: "classUP" },
    { label: "Dob", name: "dobUP" },
    { label: "Phone Number", name: "PH" },
  ];

  const UpdateReducer = (state, active) => ({
    ...state,
    [active.field]: active.value,
  });

  const whatsAppMessage = (sendstate, action) => {
    if (action.nestedField) {
      return {
        ...sendstate,
        [action.field]: {
          ...(sendstate[action.field] || {}),
          [action.nestedField]: action.value,
        },
      };
    } else {
      return {
        ...sendstate,
        [action.field]: action.value,
      };
    }
  };

  const [state, dispatch1] = useReducer(UpdateReducer, UpdateObject);

  const WhatsAppField = {
    PH: "",
    Name: "",
    Department: "",
    subject1: { sub1: "", mark1: "" },
    subject2: { sub2: "", mark2: "" },
    subject3: { sub3: "", mark3: "" },
    subject4: { sub4: "", mark4: "" },
    subject5: { sub5: "", mark5: "" },
    subject6: { sub6: "", mark6: "" },
    subject7: { sub7: "", mark7: "" },
    subject8: { sub8: "", mark8: "" },
    Internal: "",
    semester: "",
  };

  const [sendstate, sends] = useReducer(whatsAppMessage, WhatsAppField);

  const handleShowModal = async (idSt) => {
    setShowModal(true);
    const STdata = doc(db, "student", idSt);
    const getDataST = await getDoc(STdata);
    const filterData = getDataST.data();

    setUpStudentid(idSt);
    for (const key in UpdateObject) {
      const originalKey = key.replace("UP", "");
      dispatch1({ field: key, value: filterData[originalKey] });
    }
  };

  function formatDateForInput(dateStr) {
    if (!dateStr || !dateStr.includes("-")) return "";
    const parts = dateStr.split("-");
    if (parts[0].length === 4) {
      return dateStr;
    }
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }

  function formatDateForSaving(dateStr) {
    if (!dateStr || !dateStr.includes("-")) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }

  const handleCloseModal = () => {
    setShowModal(false);
    for (let Obs in UpdateObject) {
      dispatch1({ field: Obs, value: "" });
    }
  };

  const viewStudent = async (idSt) => {
    toast.loading("Please Wait");
    const STdata = doc(db, "student", idSt);
    const getDataST = await getDoc(STdata);
    const filterData = getDataST.data();
    toast.dismiss();
    Swal.fire({
      html: `
        <div style="
          text-align: left;
          font-size: 14.5px;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to right, #fdfbfb, #ebedee);
          border-radius: 10px;
          padding: 20px;
          box-shadow: inset 0 0 0.5px #ccc;
        ">
          <h4 style="
            margin-bottom: 15px;
            color: #2c3e50;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
          ">🧾 STUDENT DETAILS</h4>
    
          <table style="width: 100%; line-height: 1.9; color: #2d3436;">
            <tr><td><b style="color:#2c3e50;">Name:</b></td><td>${
              filterData.Name || "-"
            }</td></tr>
            <tr><td><b style="color:#2c3e50;">Roll No:</b></td><td>${
              filterData.rollno?.toUpperCase() || "-"
            }</td></tr>
            <tr><td><b style="color:#2c3e50;">Department:</b></td><td>${
              filterData.Department || "-"
            }</td></tr>
            <tr><td><b style="color:#2c3e50;">UG/PG:</b></td><td>${
              filterData.ugorpg?.toUpperCase() || "-"
            }</td></tr>
            <tr><td><b style="color:#2c3e50;">Year:</b></td><td>${
              filterData.year || "-"
            }</td></tr>
            <tr><td><b style="color:#2c3e50;">Class:</b></td><td>${
              filterData.class || "-"
            }</td></tr>
            <tr><td><b style="color:#2c3e50;">Regular/Self:</b></td><td>${
              filterData.rs?.toUpperCase() || "-"
            }</td></tr>
            <tr><td><b style="color:#2c3e50;">D.O.B:</b></td><td>${
              filterData.dob || "-"
            }</td></tr>
            <tr><td><b style="color:#2c3e50;">Status:</b></td>
              <td>
                <b style="color: ${filterData.active ? "#27ae60" : "#c0392b"};">
                  ${filterData.active ? "Active" : "Inactive"}
                </b>
              </td>
            </tr>
          </table>
        </div>
      `,
      width: 620,
      background: "#f0f2f5",
      confirmButtonColor: "#2d98da",
      confirmButtonText: "Close",
      customClass: {
        popup: "animate__animated animate__fadeInUp animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster",
      },
    });
  };

  const ActiveProcess = (idSt, Names, Rollno) => {
    Swal.fire({
      title: "Are you sure?",
      text: `${Names} ${Rollno}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        UpdateActive(idSt);
        Swal.fire("Updated!", "Status has been changed.", "success");
      }
    });
  };

  const UpdateActive = async (idSt) => {
    const selectedStudent = studentState.find((student) => student.id === idSt);
    if (!selectedStudent) return;

    const studentOf = doc(db, "student", idSt);
    await updateDoc(studentOf, { active: !selectedStudent.active });
    fetchStudents();
  };

  const UpdateAllDetails = async () => {
    if (
      !state.NameUP ||
      !state.rollnoUP ||
      !state.ugorpgUP ||
      !state.DepartmentUP ||
      !state.yearUP ||
      !state.rsUP ||
      !state.classUP ||
      !state.dobUP ||
      !state.PH
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!["ug", "pg"].includes(state.ugorpgUP)) {
      toast.error("Please enter UG or PG only");
      return;
    }

    if (!["A", "B"].includes(state.classUP.toUpperCase())) {
      toast.error("Please enter class A or B only");
      return;
    }

    const year = parseInt(state.yearUP);
    if (isNaN(year) || year < 1 || year > 3) {
      toast.error("Please enter year between 1 to 3");
      return;
    }

    if (!["regular", "self"].includes(state.rsUP)) {
      toast.error("Please enter regular or self only");
      return;
    }

    if (!state.PH) {
      return toast.error("Please Enter Phone Number");
    }
    if (state.PH.length > 10 || state.PH.length < 10) {
      return toast.error("Max 10 Digite ");
    }

    try {
      toast.loading("Updating...");
      await updateDoc(doc(db, "student", UpDataStid), {
        Name: state.NameUP,
        rollno: state.rollnoUP.toUpperCase(),
        ugorpg: state.ugorpgUP.toLowerCase(),
        Department: state.DepartmentUP,
        year: Number(year),
        class: state.classUP.toUpperCase(),
        rs: state.rsUP.toLowerCase(),
        dob: state.dobUP,
        PH: state.PH,
      });
      fetchStudents();
      toast.dismiss();
      toast.success("Updated Student Details");
      for (let Obs in UpdateObject) {
        dispatch1({ field: Obs, value: "" });
      }
      setShowModal(false);
    } catch (error) {
      toast.dismiss();
      toast.error("Update failed");
      console.error(error);
    }
  };

  // === Count inactive per year
  const inactiveCounts = {
    1: studentState.filter((s) => s.year == 1 && !s.active).length,
    2: studentState.filter((s) => s.year == 2 && !s.active).length,
    3: studentState.filter((s) => s.year == 3 && !s.active).length,
  };
  const ChangeDeleteThirdYear = (nums) => {
    Swal.fire({
      title: "Are you sure?",
      text:
        ugorpg == "ug"
          ? nums == 3
            ? "This will DELETE all 3rd year students!"
            : `Move ${nums} Year to ${nums + 1} Year?`
          : nums == 2
          ? "This will DELETE all 2nd year students!"
          : `Move ${nums} Year to ${nums + 1} Year?`,

      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        ChangeYear(nums);
      }
    });
  };

  const ChangeYear = async (nums) => {
    toast.loading("Please Wait few secound");
    const querys = query(
      collection(db, "student"),
      where("Department", "==", Department),
      where("year", "==", nums)
    );

    const getStudent = await getDocs(querys);

    if (!getStudent.empty) {
      if (ugorpg == "ug") {
        if (nums === 3) {
          for (const docSnap of getStudent.docs) {
            await deleteDoc(doc(db, "student", docSnap.id));
          }
          toast.dismiss();
          toast.success("Deleted!", "All 3rd year students removed", "success");
        } else {
          const newYear = nums + 1;
          for (const docSnap of getStudent.docs) {
            await updateDoc(doc(db, "student", docSnap.id), {
              year: newYear,
            });
          }
          toast.dismiss();
          toast.success(`All ${nums} Year students moved to ${newYear} Year`);
        }
        fetchStudents();
      } else {
        if (nums == 2) {
          for (const docSnap of getStudent.docs) {
            await deleteDoc(doc(db, "student", docSnap.id));
          }
          toast.dismiss();
          toast.success("Deleted!", "All 2rd year students removed", "success");
        } else {
          const newYear = nums + 1;
          for (const docSnap of getStudent.docs) {
            await updateDoc(doc(db, "student", docSnap.id), {
              year: newYear,
            });
          }
          toast.dismiss();
          toast.success(`All ${nums} Year students moved to ${newYear} Year`);
        }
        fetchStudents();
      }
    } else {
      toast.dismiss();
      toast.error(`No students found in ${nums} Year`);
    }
  };

  // WhatsApp Section's
  const handleOpenModalWhats = (student) => {
    console.log(student.id);
    setWhatsAppsend(student);
    sends({ field: "PH", value: student.PH });
    sends({ field: "Name", value: student.Name });
    sends({ field: "Department", value: student.Department });
    setShowModalWhats(true);
  };

  const handleCloseModalWhats = () => {
    setShowModalWhats(false);
    setWhatsAppsend("");
  };

  const WhatappMessage = () => {
    // Validation
    for (let i = 1; i <= 8; i++) {
      const subjectKey = `subject${i}`;
      const markKey = `mark${i}`;

      const subjectObj = sendstate[subjectKey];
      const mark = Number(subjectObj?.[markKey]);

      if (isNaN(mark) || mark < 0 || mark > 30) {
        return toast.error(`Mark for subject ${i} must be between 0 and 30`);
      }
    }

    if (!sendstate.Internal) {
      return toast.error("Please Select Internal");
    }

    if (!sendstate.semester) {
      return toast.error("Please Select Semester");
    }

    // Create message
    if (sendstate.PH) {
      let message = `👨‍🎓 *${sendstate.Name}*\n📚 *Department*: ${sendstate.Department}\n *${sendstate.semester}* - *${sendstate.Internal}*\n\n📋 *Marks:*\n`;

      for (let i = 1; i <= 8; i++) {
        const subjectKey = `subject${i}`;
        const subjectObj = sendstate[subjectKey];

        if (subjectObj?.[`sub${i}`]) {
          message += `🔸 ${subjectObj[`sub${i}`]}: ${
            subjectObj[`mark${i}`] || 0
          }/30\n`;
        }
      }

      // Encode and redirect to WhatsApp
      const encodedMessage = encodeURIComponent(message);
      const phone = sendstate.PH.replace(/\D/g, ""); // remove non-digits
      const url = `https://wa.me/91${phone}?text=${encodedMessage}`;
      window.open(url, "_blank");
    } else {
      toast.error("No Phone Number Please Update Student");
    }
  };

  return (
    <>
     <div
        style={{ background: "#d5181c", overflowX: "hidden" }}
        className="container-fluid d-md-none bg-gradient text-light sticky-top p-1 "
      >
        <div className="row ">
          <div className="col-2 text-sm-end">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/HODLayout/StaffDetails");
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
                    {HODName?.slice(0, 1)}
                  </Avatar>
                }
                label={HODName}
                className="fw-semibold"
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
              {Department?.slice(14)}
            </p>
          </div>
        </div>
      </div>

      <div className="container d-none d-md-block">
        <div className="row  d-flex align-items-center">
          <div className="col-2">
            <button
              className="btn text-white border-0 fs-3"
              onClick={() => {
                nav("/HODLayout/StaffDetails");
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
          <div className="col-2 d-flex justify-content-start ">
            <Stack direction="row" spacing={2}>
              <Chip
                avatar={
                  <Avatar style={{ color: "white", background: "#d5181c" }}>
                    {HODName?.slice(0, 1)}
                  </Avatar>
                }
                label={HODName}
                className="fw-semibold"
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
          <div className="col-8 fw-semibold d-flex justify-content-end align-items-center ">
            {Department?.slice(14)}
          </div>
        </div>
      </div>


      <div className="container mt-4" style={{ width: "90%" }}>
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-sm-5 col-lg-4">
            <div className="card Scard">
              <div
                className="card-header text-center fw-bold fs-3 text-uppercase"
                style={{ color: "rgb(26, 51, 208)", letterSpacing: "1px" }}
              >
                Student Details
              </div>
              <div className="card-body d-flex justify-content-center">
                <div className="row g-3 w-100 text-center">
                  {[1, 2, 3].map((year) => (
                    <div key={year} className="col-12 col-md-4">
                      <div
                        className="border rounded-4 shadow-sm py-4 px-2 h-100"
                        style={{
                          backgroundColor: "#f8f9ff",
                          color: "rgb(26, 51, 208)",
                          letterSpacing: "1px",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.03)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        <div style={{ fontSize: "13px", fontWeight: "600" }}>
                          {year}-Year
                        </div>
                        <div className="fs-2 fw-bold mt-2">
                          {studentState.filter((s) => s.year === year).length -
                            inactiveCounts[year]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="card-footer text-center fw-semibold text-uppercase"
                style={{ color: "rgb(26, 51, 208)", letterSpacing: "2px" }}
              >
                Total Student - {activeStudent.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container  mb-5 mt-5 ">
        <h5
          className="text-center mb-4 text-uppercase"
          style={{ color: "rgb(26, 51, 208)", letterSpacing: "2px" }}
        >
          {" "}
          Student Year Change
        </h5>

        {ugorpg == "ug" ? (
          <div className="container mb-5">
            <div className="row g-3 justify-content-center">
              <div className="col-12 col-sm-4 d-grid">
                <button
                  style={{ background: "rgb(26, 51, 208)", color: "white" }}
                  className="btn border-0 bg-gradient  fw-semibold"
                  onClick={() => {
                    ChangeDeleteThirdYear(1);
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <FaRotate />
                    <span>1 Year → 2 Year</span>
                  </div>
                </button>
              </div>

              <div className="col-12 col-sm-4 d-grid">
                <button
                  style={{ background: "rgb(26, 51, 208)", color: "white" }}
                  className="btn border-0 bg-gradient  fw-semibold"
                  onClick={() => {
                    ChangeDeleteThirdYear(2);
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <FaRotate />
                    <span>2 Year → 3 Year</span>
                  </div>
                </button>
              </div>

              <div className="col-12 col-sm-4 d-grid">
                <button
                  style={{ background: "#d5181c", color: "white" }}
                  className="btn border-0 bg-gradient fw-semibold"
                  onClick={() => {
                    ChangeDeleteThirdYear(3);
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <img
                      src="/delete.png"
                      alt=""
                      width={25}
                      className="img img-fluid"
                    />{" "}
                    <span>Delete 3rd Year</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mb-5">
            <div className="row g-3 justify-content-center">
              <div className="col-12 col-sm-4 d-grid">
                <button
                  style={{ background: "rgb(26, 51, 208)", color: "white" }}
                  className="btn border-0 bg-gradient  fw-semibold"
                  onClick={() => {
                    ChangeDeleteThirdYear(1);
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <FaRotate />
                    <span>1 Year → 2 Year</span>
                  </div>
                </button>
              </div>

              <div className="col-12 col-sm-4 d-grid">
                <button
                  style={{ background: "#d5181c", color: "white" }}
                  className="btn border-0 bg-gradient fw-semibold"
                  onClick={() => {
                    ChangeDeleteThirdYear(2);
                  }}
                >
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <img
                      src="/delete.png"
                      alt=""
                      width={25}
                      className="img img-fluid"
                    />{" "}
                    <span>Delete 2rd Year</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        <Tabs
          defaultActiveKey="year-1"
          id="student-tabs"
          className="mb-3"
          style={{ color: "#1a33d0" }}
          justify
        >
          {(ugorpg === "ug" ? [1, 2, 3] : [1, 2]).map((year) => {
            const studentsOfYear = studentState.filter(
              (std) => Number(std.year) === year
            );

            return (
              <Tab
                key={`year-${year}`}
                eventKey={`year-${year}`}
                title={`Year ${year}`}
              >
                {studentsOfYear.length > 0 ? (
                  <div className="mb-4">
                    <h5
                      className="text-center fw-bold"
                      style={{
                        color: "rgb(26, 51, 208)",
                        letterSpacing: "2px",
                      }}
                    >
                      YEAR - {year}
                    </h5>
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped table-hover">
                        <thead className="text-center text-uppercase">
                          <tr>
                            <th>S.No</th>
                            <th>View</th>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Year</th>
                            <th>WhatsApp</th>
                            <th>Update</th>
                            <th>Change Active</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentsOfYear.map((student, index) => (
                            <tr key={student.id} className="text-center">
                              <td>{index + 1}</td>
                              <td>
                                <button
                                  className="btn border-0"
                                  onClick={() => viewStudent(student.id)}
                                >
                                  <img
                                    src="/open-folder.png"
                                    width={35}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </button>
                              </td>
                              <td>{student.rollno?.toUpperCase()}</td>
                              <td>{student.Name}</td>
                              <td>{student.class}</td>
                              <td>{student.year}</td>
                              <td>
                                <button
                                  className="btn border-0"
                                  onClick={() => handleOpenModalWhats(student)}
                                >
                                  <img
                                    src="/whatsapp.png"
                                    alt=""
                                    width={30}
                                    className="img-fluid"
                                  />
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn border-0"
                                  onClick={() => handleShowModal(student.id)}
                                >
                                  <img
                                    src="/updated.png"
                                    width={30}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn border-0"
                                  onClick={() =>
                                    ActiveProcess(
                                      student.id,
                                      student.Name,
                                      student.rollno
                                    )
                                  }
                                >
                                  <img
                                    src="/edit.png"
                                    width={25}
                                    alt=""
                                    className="img-fluid"
                                  />
                                </button>
                              </td>
                              <td>
                                {student.active ? (
                                  <img
                                    src="/check-mark.png"
                                    width={25}
                                    alt=""
                                    className="img-fluid"
                                  />
                                ) : (
                                  <img
                                    src="/remove.png"
                                    width={25}
                                    alt=""
                                    className="img-fluid"
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div
                    className="alert alert-warning d-flex align-items-center justify-content-center gap-2 text-dark fw-semibold shadow-sm border-0 rounded-3 text-center"
                    role="alert"
                  >
                    <span style={{ letterSpacing: "1.5px" }}>
                      No students found for <strong>Year {year}</strong>
                    </span>
                  </div>
                )}
              </Tab>
            );
          })}
        </Tabs>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="bg-primary text-light">
          <Modal.Title className="text-uppercase text-center">
            Update Student
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {inputFields.map((field, index) => (
            <div key={index} className="mb-3">
              <label
                htmlFor={field.name}
                className="form-label text-uppercase"
                style={{ letterSpacing: "2px" }}
              >
                {field.label}
              </label>
              <input
                type={
                  field.name === "yearUP" || field.PH == "PH"
                    ? "number"
                    : field.name === "dobUP"
                    ? "date"
                    : "text"
                }
                id={field.name}
                name={field.name}
                className="form-control"
                value={
                  field.name === "dobUP"
                    ? formatDateForInput(state[field.name])
                    : state[field.name]
                }
                min={field.name === "yearUP" ? 1 : undefined}
                max={field.name === "yearUP" ? 3 : undefined}
                onChange={(e) => {
                  let value = e.target.value;

                  if (field.name === "dobUP") {
                    value = formatDateForSaving(value); // save as DD-MM-YYYY
                  } else if (["rollnoUP", "classUP"].includes(field.name)) {
                    value = value.toUpperCase();
                  } else if (
                    ["ugorpgUP", "activeUP", "rsUP"].includes(field.name)
                  ) {
                    value = value.toLowerCase();
                  }

                  dispatch1({ field: field.name, value });
                }}
              />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={UpdateAllDetails}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalWhats} onHide={handleCloseModalWhats}>
        <Modal.Header closeButton className="bg-primary text-light">
          <Modal.Title className="text-uppercase text-center">
            <FaWhatsapp /> Internal Mark send Parents
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Modal.Body>
            {[
              { label: "Phone Number", value: sendstate.PH },
              { label: "Name", value: sendstate.Name },
              { label: "Department", value: sendstate.Department },
            ].map((field, index) => (
              <div key={index} className="mb-3">
                <label className="form-label text-uppercase">
                  {field.label}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={field.value}
                  onChange={(e) =>
                    sends({
                      field:
                        field.label === "Phone Number" ? "PH" : field.label,
                      value: e.target.value,
                    })
                  }
                  disabled
                />
              </div>
            ))}

            <select
              name=""
              id=""
              onChange={(e) => {
                sends({ field: "Internal", value: e.target.value });
              }}
              className="form-select my-4"
            >
              <option value="">select Internal</option>
              <option value="Internal_1">Internal - 1</option>
              <option value="Internal_2">Internal - 2</option>
              {ugorpg == "pg" && (
                <option value="Internal_3">Internal - 3</option>
              )}
            </select>
            {(() => {
              const options = [];
              for (let i = 1; i <= 6; i++) {
                const sem = `semester${i}`;
                options.push(
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                );
              }
              return (
                <select
                  className="form-select my-4"
                  onChange={(e) => {
                    sends({ field: "semester", value: e.target.value });
                  }}
                >
                  <option value="">--select semester</option>
                  {options}
                </select>
              );
            })()}

            {Array.from({ length: 8 }, (_, i) => {
              const index = i + 1;
              const subjectKey = `subject${index}`;
              const subField = `sub${index}`;
              const markField = `mark${index}`;

              const subject = sendstate[subjectKey] || {
                [subField]: "",
                [markField]: "",
              };

              return (
                <div className="input-group my-4" key={index}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Subject - ${index}`}
                    value={subject[subField]}
                    onChange={(e) =>
                      sends({
                        field: subjectKey,
                        nestedField: subField,
                        value: e.target.value,
                      })
                    }
                  />
                  <span className="input-group-text" style={{ width: "90px" }}>
                    <input
                      type="number"
                      className="form-control"
                      value={subject[markField]}
                      onChange={(e) =>
                        sends({
                          field: subjectKey,
                          nestedField: markField,
                          value: e.target.value,
                        })
                      }
                    />
                  </span>
                </div>
              );
            })}
          </Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalWhats}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={WhatappMessage}
            className="text-uppercase"
          >
            <FaWhatsapp /> send
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="container mt-5 py-5"></div>
    </>
  );
};

export default StudentList;
