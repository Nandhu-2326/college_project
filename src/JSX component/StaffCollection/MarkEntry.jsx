import React, { useEffect, useReducer, useState } from "react";
import { db } from "../Database";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { TiTick } from "react-icons/ti";
import { RiUserSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

const MarkEntry = () => {
  //
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const staff = JSON.parse(sessionStorage.getItem("staff_Data") || "{}");
        const subject = JSON.parse(sessionStorage.getItem("Subject") || "{}");
        setStaffData(staff);
        setSelectedSubject(subject);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };
    loadInitialData();
  }, []);
  // search state
  const [searchTerm, setSearchTerm] = useState("");

  // useState
  const [markedStudents, setMarkedStudents] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [staffData, setStaffData] = useState({});
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalUP, setShowModalUP] = useState(false);
  const [showModalLab, setShowModalLab] = useState(false);
  const [showModalLabUp, setShowModalLabUp] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [Edits, setEdit] = useState(false);
  const [EditStudent, setEditStudent] = useState(null);

  // ReducerObject's
  const initialize = {
    check1: false,
    check2: false,
    check3: false,
    mark1: "",
    mark2: "",
    mark3: "",
    Assignment: "",
    Seminar: "",
  };

  const updateObject = {
    check1: "",
    check2: "",
    check3: "",
    mark1: "",
    mark2: "",
    mark3: "",
    Assignment: "",
    Seminar: "",
  };

  const LabObject = {
    check1: "",
    check2: "",
    mark1: "",
    mark2: "",
    LabRecord: "",
    Observation: "",
  };

  const LabObjectUp = {
    check1: "",
    check2: "",
    mark1: "",
    mark2: "",
    LabRecord: "",
    Observation: "",
  };

  // ReducerFunction's
  const checkReducer = (state, action) => {
    return {
      ...state,
      [action.field]: action.value,
    };
  };

  const updateReducer = (updatestate, action) => {
    return {
      ...updatestate,
      [action.field]: action.value,
    };
  };

  const LabReducer = (Labstate, action) => {
    return {
      ...Labstate,
      [action.field]: action.value,
    };
  };

  const LabReducerUp = (LabstateUp, action) => {
    return {
      ...LabstateUp,
      [action.field]: action.value,
    };
  };

  // useReducer's
  const [state, dispatch] = useReducer(checkReducer, initialize);
  const [updatestate, updateFun] = useReducer(updateReducer, updateObject);
  const [Labstate, LabFun] = useReducer(LabReducer, LabObject);
  const [LabstateUp, LabFunUp] = useReducer(LabReducerUp, LabObjectUp);

  // fetchStudentFromDataBase
  const studentData = async () => {
    if (
      selectedSubject?.department &&
      selectedSubject?.class &&
      selectedSubject?.ugorpg &&
      selectedSubject?.year &&
      selectedSubject?.rs
    ) {
      const q = query(
        collection(db, "student"),
        where("Department", "==", selectedSubject.department),
        where("class", "==", selectedSubject.class),
        where("ugorpg", "==", selectedSubject.ugorpg),
        where("year", "==", Number(selectedSubject.year)),
        where("rs", "==", selectedSubject.rs)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const studentList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        studentList.sort((a, b) =>
          a.rollno.localeCompare(b.rollno, undefined, { numeric: true })
        );

        setStudents(studentList);
      } else {
        setStudents([]);
      }
    }
  };

  const checkMarkState = async () => {
    const trueMarkStudents = [];

    for (let student of students) {
      const subjectDocRef = doc(
        db,
        "student",
        student.id,
        selectedSubject.semester,
        selectedSubject.subject
      );

      const docSnap = await getDoc(subjectDocRef);

      if (docSnap.exists() && docSnap.data().markState == "true") {
        trueMarkStudents.push(student.id);
      }
    }

    setMarkedStudents(trueMarkStudents);
  };

  useEffect(() => {
    if (
      students.length > 0 &&
      selectedSubject?.semester &&
      selectedSubject?.subject
    ) {
      checkMarkState();
    }
  }, [students, selectedSubject]);

  useEffect(() => {
    studentData();
  }, [selectedSubject]);

  // open set Mark Theory
  const handleShowModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  // close set Mark Theory
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const handleCloseModalUP = () => {
    setShowModalUP(false);
    setSelectedStudent(null);
  };

  // set Theory mark
  const SubmiteSubjectMark = async (IdSt) => {
    if (selectedSubject.ugorpg == "ug") {
      if (!state.mark1 || !state.mark2 || !state.Assignment || !state.Seminar) {
        toast.error("Please Fill All Requirements");
        return;
      }

      let dbmark1 = state.mark1 === "Absent" ? null : Number(state.mark1);
      let dbmark2 = state.mark2 === "Absent" ? null : Number(state.mark2);

      const dbAssignment = Number(state.Assignment);
      const dbSeminar = Number(state.Seminar);

      if (
        (dbmark1 !== null && (dbmark1 < 0 || dbmark1 > 30)) ||
        (dbmark2 !== null && (dbmark2 < 0 || dbmark2 > 30))
      ) {
        toast.error("Mark1 and Mark2 must be between 0 and 30 ");
        return;
      }

      if (
        dbAssignment < 0 ||
        dbAssignment > 5 ||
        dbSeminar < 0 ||
        dbSeminar > 5
      ) {
        toast.error("Assignment and Seminar marks must be between 0 and 5");
        return;
      }

      try {
        toast.loading("Uploading...");
        const Internal_1Og = dbmark1;
        const Internal_2Og = dbmark2;
        const Internal_1 = dbmark1 / 2;
        const Internal_2 = dbmark2 / 2;
        const BothInternal = Math.round(Internal_1 + Internal_2);
        const TotalInternal = Math.round(BothInternal / 2);
        const NeetMark = Math.round(TotalInternal + dbAssignment + dbSeminar);

        const dbSetMark = doc(db, "student", IdSt);
        const dbCollection = doc(
          collection(dbSetMark, selectedSubject.semester),
          selectedSubject.subject
        );

        await setDoc(dbCollection, {
          Internal_1Og: Internal_1Og,
          Internal_2Og: Internal_2Og,
          Internal_1: Internal_1,
          Internal_2: Internal_2,
          BothInternal: BothInternal,
          TotalInternal: TotalInternal,
          NeetMark: NeetMark,
          Assignment: dbAssignment,
          Seminar: dbSeminar,
          mark1: dbmark1,
          mark2: dbmark2,
          markState: "true",
          TorL: selectedSubject.TorL,
        });
        toast.dismiss();
        toast.success("Mark Successfully Complited");
        for (let ObjectRender in initialize) {
          dispatch({ field: ObjectRender, value: "" });
        }
      } catch (e) {
        toast.error(e.message);
      }
    } else {
      if (
        !state.mark1 ||
        !state.mark2 ||
        !state.mark3 ||
        !state.Assignment ||
        !state.Seminar
      ) {
        toast.error("Please Fill All Requirements");
        return;
      }

      let dbmark1 = state.mark1 === "Absent" ? null : Number(state.mark1);
      let dbmark2 = state.mark2 === "Absent" ? null : Number(state.mark2);
      let dbmark3 = state.mark3 === "Absent" ? null : Number(state.mark3);
      const dbAssignment = Number(state.Assignment);
      const dbSeminar = Number(state.Seminar);

      if (
        (dbmark1 !== null && (dbmark1 < 0 || dbmark1 > 30)) ||
        (dbmark2 !== null && (dbmark2 < 0 || dbmark2 > 30)) ||
        (dbmark3 !== null && (dbmark3 < 0 || dbmark3 > 30))
      ) {
        toast.error("Mark1 and Mark2 must be between 0 and 30 ");
        return;
      }

      let MarkArray = [dbmark1, dbmark2, dbmark3];
      MarkArray.sort((a, b) => b - a);
      console.log(MarkArray);
      let dbMark1 = MarkArray[0];
      let dbMark2 = MarkArray[1];
      console.log(dbMark1, dbMark2);

      if (
        dbAssignment < 0 ||
        dbAssignment > 5 ||
        dbSeminar < 0 ||
        dbSeminar > 5
      ) {
        toast.error("Assignment and Seminar marks must be between 0 and 5");
        return;
      }

      try {
        toast.loading("Uploading...");
        const Internal_1Og = dbMark1;
        const Internal_2Og = dbMark2;
        const Internal_1 = dbMark1 / 2;
        const Internal_2 = dbMark2 / 2;
        const BothInternal = Math.round(Internal_1 + Internal_2);
        const TotalInternal = Math.round(BothInternal / 2);
        const NeetMark = Math.round(TotalInternal + dbAssignment + dbSeminar);

        const dbSetMark = doc(db, "student", IdSt);
        const dbCollection = doc(
          collection(dbSetMark, selectedSubject.semester),
          selectedSubject.subject
        );

        await setDoc(dbCollection, {
          mark1: dbmark1,
          mark2: dbmark2,
          mark3: dbmark3,
          Internal_1Og: Internal_1Og,
          Internal_2Og: Internal_2Og,
          Internal_1: Internal_1,
          Internal_2: Internal_2,
          BothInternal: BothInternal,
          TotalInternal: TotalInternal,
          NeetMark: NeetMark,
          Assignment: dbAssignment,
          Seminar: dbSeminar,
          markState: "true",
          TorL: selectedSubject.TorL,
        });
        toast.dismiss();
        for (let ObjectRender in initialize) {
          dispatch({ field: ObjectRender, value: "" });
        }
        toast.success("Mark Successfully Complited");
        setShowModal(false);
      } catch (e) {
        toast.error(e.message);
      }
    }
    setSelectedStudent("");
    checkMarkState();
    handleCloseModal();
  };

  // Update Theory Mark
  const UpdateMark = async (student) => {
    try {
      setShowModalUP(true);
      setEdit(true);
      const UpdataStudent = doc(
        db,
        "student",
        student.id,
        selectedSubject.semester,
        selectedSubject.subject
      );
      const FetchData = await getDoc(UpdataStudent);

      if (!FetchData.exists()) {
        console.error("No such document!");
        return;
      }
      const FullData = FetchData.data();
      updateFun({ field: "Assignment", value: FullData.Assignment ?? "" });
      updateFun({ field: "Seminar", value: FullData.Seminar ?? "" });
      updateFun({
        field: "check1",
        value: FullData.mark1 == null ? true : false,
      });
      updateFun({
        field: "check2",
        value: FullData.mark2 == null ? true : false,
      });
      updateFun({
        field: "check3",
        value: FullData.mark3 == null ? true : false,
      });
      updateFun({
        field: "mark1",
        value: FullData.mark1 == null ? "Absent" : FullData.mark1,
      });
      updateFun({
        field: "mark2",
        value: FullData.mark2 == null ? "Absent" : FullData.mark2,
      });
      updateFun({
        field: "mark3",
        value: FullData.mark3 == null ? "Absent" : FullData.mark3,
      });

      console.log("Fetched Data:", FullData);
      setSelectedStudent(student);
      setEditStudent(FullData);
      // console.log(updatestate);
    } catch (error) {
      console.error("Error fetching mark data:", error.message);
    }
  };

  const UpdateStudentMark = async (student) => {
    if (student.ugorpg == "ug") {
      if (
        !updatestate.mark1 ||
        !updatestate.mark2 ||
        !updatestate.Assignment ||
        !updatestate.Seminar
      ) {
        toast.error("Please Fill All Requirements");
        return;
      }

      let dbmark1 =
        updatestate.mark1 === "Absent" ? null : Number(updatestate.mark1);
      let dbmark2 =
        updatestate.mark2 === "Absent" ? null : Number(updatestate.mark2);

      const dbAssignment = Number(updatestate.Assignment);
      const dbSeminar = Number(updatestate.Seminar);

      if (
        (dbmark1 !== null && (dbmark1 < 0 || dbmark1 > 30)) ||
        (dbmark2 !== null && (dbmark2 < 0 || dbmark2 > 30))
      ) {
        toast.error("Mark1 and Mark2 must be between 0 and 30 ");
        return;
      }

      if (
        dbAssignment < 0 ||
        dbAssignment > 5 ||
        dbSeminar < 0 ||
        dbSeminar > 5
      ) {
        toast.error("Assignment and Seminar marks must be between 0 and 5");
        return;
      }

      try {
        toast.loading("Uploading...");
        const Internal_1Og = dbmark1;
        const Internal_2Og = dbmark2;
        const Internal_1 = dbmark1 / 2;
        const Internal_2 = dbmark2 / 2;
        const BothInternal = Math.round(Internal_1 + Internal_2);
        const TotalInternal = Math.round(BothInternal / 2);
        const NeetMark = Math.round(TotalInternal + dbAssignment + dbSeminar);

        const UpdataBase = doc(
          db,
          "student",
          student.id,
          selectedSubject.semester,
          selectedSubject.subject
        );
        await updateDoc(UpdataBase, {
          Internal_1Og: Internal_1Og,
          Internal_2Og: Internal_2Og,
          Internal_1: Internal_1,
          Internal_2: Internal_2,
          BothInternal: BothInternal,
          TotalInternal: TotalInternal,
          NeetMark: NeetMark,
          Assignment: dbAssignment,
          Seminar: dbSeminar,
          mark1: dbmark1,
          mark2: dbmark2,
          TorL: selectedSubject.TorL,

        });
        toast.dismiss();
        toast.success("Update Successfully");
        for (let ObjectRender in updateObject) {
          updateFun({ field: ObjectRender, value: "" });
        }
        setSelectedStudent("");
        setShowModalUP(false);
      } catch (e) {
        toast.error(e.message);
      }
    } else {
      if (
        !updatestate.mark1 ||
        !updatestate.mark2 ||
        !updatestate.mark3 ||
        !updatestate.Assignment ||
        !updatestate.Seminar
      ) {
        toast.error("Please Fill All Requirements");
        return;
      }

      let dbmark1 =
        updatestate.mark1 === "Absent" ? null : Number(updatestate.mark1);
      let dbmark2 =
        updatestate.mark2 === "Absent" ? null : Number(updatestate.mark2);
      let dbmark3 =
        updatestate.mark3 === "Absent" ? null : Number(updatestate.mark3);
      const dbAssignment = Number(updatestate.Assignment);
      const dbSeminar = Number(updatestate.Seminar);

      if (
        (dbmark1 !== null && (dbmark1 < 0 || dbmark1 > 30)) ||
        (dbmark2 !== null && (dbmark2 < 0 || dbmark2 > 30)) ||
        (dbmark3 !== null && (dbmark3 < 0 || dbmark3 > 30))
      ) {
        toast.error("Mark1 and Mark2 must be between 0 and 30 ");
        return;
      }

      let MarkArray = [dbmark1, dbmark2, dbmark3];
      MarkArray.sort((a, b) => b - a);
      console.log(MarkArray);
      let dbMark1 = MarkArray[0];
      let dbMark2 = MarkArray[1];
      console.log(dbMark1, dbMark2);

      if (
        dbAssignment < 0 ||
        dbAssignment > 5 ||
        dbSeminar < 0 ||
        dbSeminar > 5
      ) {
        toast.error("Assignment and Seminar marks must be between 0 and 5");
        return;
      }

      try {
        toast.loading("Uploading...");
        const Internal_1Og = dbMark1;
        const Internal_2Og = dbMark2;
        const Internal_1 = dbMark1 / 2;
        const Internal_2 = dbMark2 / 2;
        const BothInternal = Math.round(Internal_1 + Internal_2);
        const TotalInternal = Math.round(BothInternal / 2);
        const NeetMark = Math.round(TotalInternal + dbAssignment + dbSeminar);

        const dbSetMark = doc(db, "student", student.id);
        const dbCollection = doc(
          collection(dbSetMark, selectedSubject.semester),
          selectedSubject.subject
        );

        await updateDoc(dbCollection, {
          mark1: dbmark1,
          mark2: dbmark2,
          mark3: dbmark3,
          Internal_1Og: Internal_1Og,
          Internal_2Og: Internal_2Og,
          Internal_1: Internal_1,
          Internal_2: Internal_2,
          BothInternal: BothInternal,
          TotalInternal: TotalInternal,
          NeetMark: NeetMark,
          Assignment: dbAssignment,
          Seminar: dbSeminar,
          TorL: selectedSubject.TorL,

        });
        toast.dismiss();
        for (let ObjectRender in updateObject) {
          updateFun({ field: ObjectRender, value: "" });
        }
        toast.success("Update Successfully Complited");
        setShowModal(false);
      } catch (e) {
        toast.error(e.message);
      }
      setSelectedStudent("");
      setShowModalUP(false);
    }
  };

  // View Result
  const ResultAlert = async (stId) => {
    try {
      toast.loading("Please Wait");
      const studentSnap = await getDoc(doc(db, "student", stId));
      const StudentDetails = studentSnap.data();

      const markSnap = await getDoc(
        doc(
          db,
          "student",
          stId,
          selectedSubject.semester,
          selectedSubject.subject
        )
      );
      const MarkList = markSnap.data();

      if (!MarkList) {
        toast.dismiss();
        toast.error("Please set Mark After viewing the result.");
        return;
      }
      if (selectedSubject.TorL != "Lab") {
        if (StudentDetails.ugorpg == "pg") {
          Swal.fire({
            title: " RESULT ",
            html: `
          <div style="text-align: left; font-size: 14px;">
            <h4> STUDENT DETAILS</h4>
            <table style="width: 100%; line-height: 1.8;">
              <tr><td><b>Department:</b></td><td>${
                StudentDetails.Department
              }</td></tr>
              <tr><td><b>R/S:</b></td><td>${StudentDetails.rs.toUpperCase()}</td></tr>
              <tr><td><b>Name:</b></td><td>${StudentDetails.Name}</td></tr>
              <tr><td><b>Roll No:</b></td><td>${StudentDetails.rollno.toUpperCase()}</td></tr>
              <tr><td><b>Class:</b></td><td>${StudentDetails.class}</td></tr>
              <tr><td><b>UG/PG:</b></td><td>${StudentDetails.ugorpg.toUpperCase()}</td></tr>
              <tr><td><b>Status:</b></td><td>${
                StudentDetails.active ? "Active" : "Inactive"
              }</td></tr>
            </table>
            <hr>
      
            <h4>📘 Original Marks</h4>
            <table style="width: 100%; line-height: 1.8;">
              <tr><td><b>Internal - I:</b></td><td>${
                MarkList.mark1 ?? "Absent"
              }</td></tr>
              <tr><td><b>Internal - II:</b></td><td>${
                MarkList.mark2 ?? "Absent"
              }</td></tr>
             ${
               StudentDetails.ugorpg == "pg" &&
               `<tr><td><b>Internal - III:</b></td><td>${
                 MarkList.mark3 ?? "Absent"
               }
              </td></tr>`
             }
              <tr><td><b>Assignment:</b></td><td>${
                MarkList.Assignment
              }</td></tr>
              <tr><td><b>Seminar:</b></td><td>${MarkList.Seminar}</td></tr>
            </table>
            <hr>
      
            <h4>📊 Calculated Marks</h4>
            <table style="width: 100%; line-height: 1.8;">
              <tr><td><b>Best Internal - I:</b></td><td>${
                MarkList.Internal_1Og == null ? "Absent" : MarkList.Internal_1Og
              }</td></tr>
              <tr><td><b>Best Internal - II:</b></td><td>${
                MarkList.Internal_2Og == null ? "Absent" : MarkList.Internal_2Og
              }</td></tr>
              <tr><td><b>Both Internals Avg:</b></td><td>${
                MarkList.BothInternal
              }</td></tr>
              <tr><td><b>Total Internal Avg:</b></td><td>${
                MarkList.TotalInternal
              }</td></tr>
              <tr><td><b><u>Total Mark:</u></b></td><td><b>${
                MarkList.NeetMark
              }</b></td></tr>
            </table>
          </div>
        `,
            icon: "success",
            width: 700,
            confirmButtonText: "Close",
            customClass: {
              popup: "animate__animated animate__fadeInUp animate__faster",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutDown animate__faster",
            },
          });
        } else {
          Swal.fire({
            title: " RESULT ",
            html: `
          <div style="text-align: left; font-size: 14px;">
            <h4> STUDENT DETAILS</h4>
            <table style="width: 100%; line-height: 1.8;">
              <tr><td><b>Department:</b></td><td>${
                StudentDetails.Department
              }</td></tr>
              <tr><td><b>R/S:</b></td><td>${StudentDetails.rs.toUpperCase()}</td></tr>
              <tr><td><b>Name:</b></td><td>${StudentDetails.Name}</td></tr>
              <tr><td><b>Roll No:</b></td><td>${StudentDetails.rollno.toUpperCase()}</td></tr>
              <tr><td><b>Class:</b></td><td>${StudentDetails.class}</td></tr>
              <tr><td><b>UG/PG:</b></td><td>${StudentDetails.ugorpg.toUpperCase()}</td></tr>
              <tr><td><b>Status:</b></td><td>${
                StudentDetails.active ? "Active" : "Inactive"
              }</td></tr>
            </table>
            <hr>
      
            <h4>📘 Original Marks</h4>
            <table style="width: 100%; line-height: 1.8;">
              <tr><td><b>Internal - I:</b></td><td>${
                MarkList.mark1 ?? "Absent"
              }</td></tr>
              <tr><td><b>Internal - II:</b></td><td>${
                MarkList.mark2 ?? "Absent"
              }</td></tr>
              <tr><td><b>Internal - III:</b></td><td>${
                StudentDetails.ugorpg == "pg" && MarkList.mark3
              }</td></tr>
              <tr><td><b>Assignment:</b></td><td>${
                MarkList.Assignment
              }</td></tr>
              <tr><td><b>Seminar:</b></td><td>${MarkList.Seminar}</td></tr>
            </table>
            <hr>
      
            <h4>📊 Calculated Marks</h4>
            <table style="width: 100%; line-height: 1.8;">
              <tr><td><b>Best Internal - I:</b></td><td>${
                MarkList.Internal_1Og == null ? "Absent" : MarkList.Internal_1Og
              }</td></tr>
              <tr><td><b>Best Internal - II:</b></td><td>${
                MarkList.Internal_2Og == null ? "Absent" : MarkList.Internal_2Og
              }</td></tr>
              <tr><td><b>Both Internals Avg:</b></td><td>${
                MarkList.BothInternal
              }</td></tr>
              <tr><td><b>Total Internal Avg:</b></td><td>${
                MarkList.TotalInternal
              }</td></tr>
              <tr><td><b><u>Total Mark:</u></b></td><td><b>${
                MarkList.NeetMark
              }</b></td></tr>
            </table>
          </div>
        `,
            icon: "success",
            width: 700,
            confirmButtonText: "Close",
            customClass: {
              popup: "animate__animated animate__fadeInUp animate__faster",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutDown animate__faster",
            },
          });
        }
      } else {
        Swal.fire({
          title: " RESULT ",
          html: `
          <div style="text-align: left; font-size: 14px;">
            <h4> STUDENT DETAILS</h4>
            <table style="width: 100%; line-height: 1.8;">
              <tr><td><b>Department:</b></td><td>${
                StudentDetails.Department
              }</td></tr>
              <tr><td><b>R/S:</b></td><td>${StudentDetails.rs.toUpperCase()}</td></tr>
              <tr><td><b>Name:</b></td><td>${StudentDetails.Name}</td></tr>
              <tr><td><b>Roll No:</b></td><td>${StudentDetails.rollno.toUpperCase()}</td></tr>
              <tr><td><b>Class:</b></td><td>${StudentDetails.class}</td></tr>
              <tr><td><b>UG/PG:</b></td><td>${StudentDetails.ugorpg.toUpperCase()}</td></tr>
              <tr><td><b>Status:</b></td><td>${
                StudentDetails.active ? "Active" : "Inactive"
              }</td></tr>
            </table>
            <hr>
      
            <h4>📘 Original Marks</h4>
            <table style="width: 100%; line-height: 1.8;">
              <tr><td><b>Internal - I:</b></td><td>${
                MarkList.Internal_1Og == null ? "Absent" : MarkList.Internal_1Og
              }</td></tr>
              <tr><td><b>Internal - II:</b></td><td>${
                MarkList.Internal_2Og == null ? "Absent" : MarkList.Internal_2Og
              }</td></tr>
              <tr><td><b>LabRecord:</b></td><td>${MarkList.LabRecord}</td></tr>
              <tr><td><b>Obsevation:</b></td><td>${
                MarkList.Observation
              }</td></tr>
            </table>
            <hr>
            
            <h4>📊 Calculated Marks</h4>
            <table style="width: 100%; line-height: 1.8;">
            <tr><td><b> Internal - I:</b></td><td>${
              MarkList.Internal_1Og == null ? "Absent" : MarkList.Internal_1Og
            }</td></tr>
              <tr><td><b> Internal - II:</b></td><td>${
                MarkList.Internal_2Og == null ? "Absent" : MarkList.Internal_2Og
              }</td></tr>
              <tr><td><b>Average Mark :</b></td><td>${
                MarkList.AverageMark
              }</td></tr>
             
              <tr><td><b>Total Mark:</b></td><td><b>${
                MarkList.Totalmark
              }</b></td></tr>
            </table>
          </div>
        `,
          icon: "success",
          width: 700,
          confirmButtonText: "Close",
          customClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
          },
        });
      }

      toast.dismiss();

      console.log("Student:", StudentDetails);
      console.log("MarkList:", MarkList);
    } catch (e) {
      toast.error(e.message);
    }
  };

  // Lab Mark Entry
  const handleCloseModalLab = () => {
    setShowModalLab(false);
    setSelectedStudent("");
    for (let LabObjests in LabObject) {
      LabFun({ field: LabObjests, value: "" });
    }
  };

  const LabMarkEntry = (student) => {
    setShowModalLab(true);
    setSelectedStudent(student);
  };

  const LabMark = async (student) => {
    try {
      if (
        !Labstate.mark1 ||
        !Labstate.mark2 ||
        !Labstate.Observation ||
        !Labstate.LabRecord
      ) {
        return toast.error("Please Fill All Requirement");
      }
      if (
        Labstate.mark1 < 0 ||
        Labstate.mark1 > 30 ||
        Labstate.mark2 < 0 ||
        Labstate.mark2 > 30
      ) {
        return toast.error("Internal 1 & 2 - 0 between 30 Only ");
      }
      if (
        Labstate.LabRecord < 0 ||
        Labstate.LabRecord > 5 ||
        Labstate.Observation < 0 ||
        Labstate.Observation > 5
      ) {
        return toast.error("LabeRecord and Observation Max Mark of 5");
      }
      toast.loading("Please Wait");
      const labMark1 =
        Labstate.mark1 != "Absent" ? Number(Labstate.mark1) : null;
      const labMark2 =
        Labstate.mark2 != "Absent" ? Number(Labstate.mark2) : null;
      const labMarkRecord = Number(Labstate.LabRecord);
      const labMarkObservation = Number(Labstate.Observation);

      const AverageMark = Math.round((labMark1 + labMark2) / 2);
      const TotalMark = Math.round(
        AverageMark + labMarkRecord + labMarkObservation
      );

      const fetchDataMark = doc(db, "student", student.id);
      const MarkCollection = doc(
        collection(fetchDataMark, selectedSubject.semester),
        selectedSubject.subject
      );
      await setDoc(MarkCollection, {
        Internal_1Og: labMark1,
        Internal_2Og: labMark2,
        AverageMark: AverageMark,
        LabRecord: labMarkRecord,
        Observation: labMarkObservation,
        Totalmark: TotalMark,
        markState: "true",
        TorL: selectedSubject.TorL,
      });
      toast.dismiss();
      toast.success("Mark Successfully Upload");
      checkMarkState();
      setShowModalLab(false);
      setSelectedStudent("");
      for (let LabObjests in LabObject) {
        LabFun({ field: LabObjests, value: "" });
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  // Lab Mark Update
  const handleCloseModalLabUp = () => {
    setShowModalLabUp(false);
    for (let LabUp in LabObjectUp) {
      LabFunUp({ field: LabUp, value: "" });
    }
    setSelectedStudent("");
  };

  const LabUpdateMark = async (student) => {
    try {
      setSelectedStudent(student);
      const UpdataLab = doc(
        db,
        "student",
        student.id,
        selectedSubject.semester,
        selectedSubject.subject
      );
      const FetchData = await getDoc(UpdataLab);

      if (!FetchData.exists()) {
        toast.error("Please set Mark After Edit ");
        return;
      }
      setShowModalLabUp(true);
      const LabData = FetchData.data();
      LabFunUp({ field: "LabRecord", value: LabData.LabRecord });
      LabFunUp({ field: "Observation", value: LabData.Observation });
      LabFunUp({
        field: "check1",
        value: LabData.Internal_1Og == null ? true : false,
      });
      LabFunUp({
        field: "check2",
        value: LabData.Internal_2Og == null ? true : false,
      });
      LabFunUp({
        field: "mark1",
        value: LabData.Internal_1Og == null ? "Absent" : LabData.Internal_1Og,
      });
      LabFunUp({
        field: "mark2",
        value: LabData.Internal_2Og == null ? "Absent" : LabData.Internal_2Og,
      });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const LabMarkUp = async (student) => {
    try {
      if (
        !LabstateUp.mark1 ||
        !LabstateUp.mark2 ||
        !LabstateUp.Observation ||
        !LabstateUp.LabRecord
      ) {
        return toast.error("Please Fill All Requirement");
      }
      if (
        LabstateUp.mark1 < 0 ||
        LabstateUp.mark1 > 30 ||
        LabstateUp.mark2 < 0 ||
        LabstateUp.mark2 > 30
      ) {
        return toast.error("Internal 1 & 2 - 0 between 30 Only ");
      }
      if (
        LabstateUp.LabRecord < 0 ||
        LabstateUp.LabRecord > 5 ||
        LabstateUp.Observation < 0 ||
        LabstateUp.Observation > 5
      ) {
        return toast.error("LabeRecord and Observation Max Mark of 5");
      }
      toast.loading("Please Wait");
      const labMark1 =
        LabstateUp.mark1 != "Absent" ? Number(LabstateUp.mark1) : null;
      const labMark2 =
        LabstateUp.mark2 != "Absent" ? Number(LabstateUp.mark2) : null;
      const labMarkRecord = Number(LabstateUp.LabRecord);
      const labMarkObservation = Number(LabstateUp.Observation);

      const AverageMark = Math.round((labMark1 + labMark2) / 2);
      const TotalMark = Math.round(
        AverageMark + labMarkRecord + labMarkObservation
      );

      const fetchDataMark = doc(db, "student", student.id);
      const MarkCollection = doc(
        collection(fetchDataMark, selectedSubject.semester),
        selectedSubject.subject
      );
      await updateDoc(MarkCollection, {
        Internal_1Og: labMark1,
        Internal_2Og: labMark2,
        AverageMark: AverageMark,
        LabRecord: labMarkRecord,
        Observation: labMarkObservation,
        Totalmark: TotalMark,
      });
      toast.dismiss();
      toast.success("Mark Successfully Update");
      setShowModalLabUp(false);
      setSelectedStudent("");
      for (let LabObjests in LabObjectUp) {
        LabFunUp({ field: LabObjests, value: "" });
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  const nav = useNavigate();
  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <header className="bg-primary text-light sticky-top py-3 px-4 d-flex justify-content-between align-items-center">
        <h6 className="mb-0">STAFF: {staffData?.staffName || "N/A"}</h6>
        <h6 className="mb-0">D-Code: {staffData?.DepartmentCode || "N/A"}</h6>
      </header>
      {/* Back Page */}
      <div className="container  d-felx p-3 justify-content-start align-items-center">
        <button
          className="btn text-primary border-0 fs-3"
          onClick={() => {
            nav("/StaffLayout/StaffSubjects");
          }}
        >
          <FaArrowLeftLong /> Back
        </button>
      </div>

      {/* Title */}
      <div className="text-center my-4">
        <h2 className="text-uppercase text-primary fw-bold">Mark Entry</h2>
      </div>

      {/* Subject Info */}
      <div className="container mb-4">
        <div className="bg-primary text-light rounded p-3 text-center">
          <h5 className="text-uppercase mb-2">
            {selectedSubject?.department || "Department"}
          </h5>
          <p className="mb-1 fw-bold text-uppercase">
            Subject: {selectedSubject?.subject || "Subject"}
          </p>
          <p className="mb-1 fw-bold text-uppercase">
            Semester: {selectedSubject?.semester || "--"}
          </p>
          <p className="mb-1 fw-bold text-uppercase">
            Type: {selectedSubject?.TorL || "Theory/Lab"}
          </p>
          <div className="d-flex justify-content-around mt-3 flex-wrap">
            <p className="mb-0 fw-semibold text-uppercase">
              Class: {selectedSubject?.class || "-"}
            </p>
            <p className="mb-0 fw-semibold text-uppercase">
              Year: {selectedSubject?.year || "-"}
            </p>
            <p className="mb-0 fw-semibold text-uppercase">
              Degree: {selectedSubject?.ugorpg || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* search with Allresult */}
      <div className="container">
        <div className="row d-felx justify-content-sm-around align-items-sm-center">
          <div className="col-12 col-sm-5 ">
            <div className="input-group ">
              <span
                className="input-group-text fw-bold bg-primary text-light"
                style={{ fontSize: "20px" }}
              >
                <RiUserSearchLine />
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="Roll Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 text-end mt-4 mb-3 mt-sm-0">
            <button
              className="btn btn-outline-success"
              onClick={() => {
                nav("/StaffLayout/PDFResult");
              }}
            >
              All Result
            </button>
          </div>
        </div>
      </div>

      {/* Student List */}
      <div className="container">
        <h3 className="text-center text-primary text-uppercase mb-4 mt-sm-3">
          Student List
        </h3>
        <div className="row ">
          {students.length > 0 ? (
            students
              .filter((student) =>
                student.rollno.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((student) => (
                <div className="col-12 col-md-6 col-lg-4" key={student.id}>
                  <div
                    className={
                      student.active
                        ? "card shadow-sm border-0 "
                        : "card shadow-sm border-2 border-danger opacity-50 "
                    }
                  >
                    <div className="card-header bg-white d-flex justify-content-center align-items-center border-bottom">
                      {!student.active ? (
                        <h3 className="h5 text-uppercase text-danger ">
                          Don't Enter Mark
                        </h3>
                      ) : (
                        <div className="w-100">
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => {
                              ResultAlert(student.id);
                            }}
                          >
                            Result
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="card-body">
                      <h5 className="card-title text-primary">
                        {student.Name}
                      </h5>
                      <p className="card-text fw-semibold">
                        Roll No: {student.rollno.toUpperCase()}
                      </p>
                      <p className="text-muted fs-5">
                        Subject: {selectedSubject?.subject}
                      </p>
                    </div>
                    {!student.active ? (
                      <h3 className="h3 text-uppercase text-danger text-center">
                        Non active Student
                      </h3>
                    ) : (
                      <div className="card-footer bg-white d-flex justify-content-between">
                        {markedStudents.includes(student.id) ? (
                          <TiTick color="green" style={{ fontSize: "30px" }} />
                        ) : (
                          <button
                            className="btn btn-success btn-sm px-3"
                            onClick={() => {
                              selectedSubject.TorL !== "Lab"
                                ? handleShowModal(student)
                                : LabMarkEntry(student);
                            }}
                          >
                            set Mark
                          </button>
                        )}

                        <button
                          className="btn btn-danger btn-sm px-3"
                          onClick={() =>
                            selectedSubject.TorL !== "Lab"
                              ? UpdateMark(student)
                              : LabUpdateMark(student)
                          }
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center">
              <h5 className="text-secondary">No students found.</h5>
            </div>
          )}
        </div>
      </div>

      <div className="container mt-5 py-5"></div>
      {/* Modal */}

      {/* set theory Mark */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          className="bg-primary text-light d-flex justify-content-center align-items-center fw-bold"
        >
          <Modal.Title className="text-center text-uppercase">
            {" "}
            set mark
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent ? (
            <>
              <div className="d-flex justify-content-between align-items-center ">
                <p>
                  {" "}
                  <strong>Name: </strong> {selectedStudent.Name}{" "}
                </p>
                <p>
                  {" "}
                  <strong>Roll No: </strong>{" "}
                  {selectedStudent.rollno.toUpperCase()}{" "}
                </p>
              </div>

              {selectedStudent &&
                (selectedStudent.ugorpg == "ug" ? [1, 2] : [1, 2, 3]).map(
                  (no) => {
                    const checkField = `check${no}`;
                    const markField = `mark${no}`;

                    return (
                      <div className="mt-3 mb-4" key={no}>
                        <label htmlFor="" className="text-uppercase fw-bold">
                          {no === 1
                            ? "Internal - I"
                            : no === 2
                            ? "Internal - II"
                            : "Internal - III"}
                        </label>
                        <input
                          type={state[checkField] ? "text" : "number"}
                          className="form-control"
                          placeholder={`Internal - ${no}`}
                          value={state[markField]}
                          onChange={(e) =>
                            dispatch({
                              field: markField,
                              value: e.target.value,
                            })
                          }
                          disabled={state[checkField]}
                          min={0}
                          max={30}
                        />
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            id={checkField}
                            className="form-check-input"
                            name={checkField}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              dispatch({ field: checkField, value: isChecked });
                              dispatch({
                                field: markField,
                                value: isChecked ? "Absent" : "",
                              });
                            }}
                            checked={state[checkField]}
                          />
                          <label
                            htmlFor={checkField}
                            className="fw-semibold ms-2 text-danger"
                            style={{ letterSpacing: "3px" }}
                          >
                            Absent
                          </label>
                        </div>
                      </div>
                    );
                  }
                )}

              {[1, 2].map((no) => {
                return (
                  <div className={no == 1 ? "" : "mt-4"} key={no}>
                    <label
                      htmlFor={no == 1 ? "Assignment" : "Seminar"}
                      className="fw-bold text-uppercase"
                      style={{ letterSpacing: "2px" }}
                    >
                      {" "}
                      {no == 1 ? "Assignment" : "Seminar"}{" "}
                    </label>
                    <input
                      type="number"
                      id={no == 1 ? "Assignment" : "Seminar"}
                      className="form-control"
                      placeholder={no == 1 ? "Assignment" : "Seminar"}
                      name={no == 1 ? "Assignment" : "Seminar"}
                      onChange={(e) => {
                        dispatch({
                          field: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      value={no == 1 ? state.Assignment : state.Seminar}
                      max={5}
                      min={0}
                    />
                  </div>
                );
              })}

              <div className="d-flex justify-content-around mt-3">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    SubmiteSubjectMark(selectedStudent.id);
                  }}
                >
                  Save
                </Button>
              </div>
            </>
          ) : (
            <p>Loading student data...</p>
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {/* Update theory Mark */}
      <Modal show={showModalUP} onHide={handleCloseModalUP}>
        <Modal.Header
          closeButton
          className="bg-primary text-light d-flex justify-content-center align-items-center fw-bold"
        >
          <Modal.Title className="text-center text-uppercase">
            {" "}
            Update mark
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && EditStudent ? (
            <>
              <div className="d-flex justify-content-between align-items-center ">
                <p>
                  {" "}
                  <strong>Name: </strong> {selectedStudent.Name}{" "}
                </p>
                <p>
                  {" "}
                  <strong>Roll No: </strong>{" "}
                  {selectedStudent.rollno.toUpperCase()}{" "}
                </p>
              </div>

              {selectedStudent &&
                (selectedStudent.ugorpg == "ug" ? [1, 2] : [1, 2, 3]).map(
                  (no) => {
                    const checkField = `check${no}`;
                    const markField = `mark${no}`;

                    return (
                      <div className="mt-3 mb-4" key={no}>
                        <label htmlFor="" className="text-uppercase fw-bold">
                          {no === 1
                            ? "Internal - I"
                            : no === 2
                            ? "Internal - II"
                            : "Internal - III"}
                        </label>
                        <input
                          type={updatestate[checkField] ? "text" : "number"}
                          className="form-control"
                          placeholder={`Internal - ${no}`}
                          value={updatestate[markField]}
                          onChange={(e) =>
                            updateFun({
                              field: markField,
                              value: e.target.value,
                            })
                          }
                          disabled={updatestate[checkField]}
                          min={0}
                          max={30}
                        />
                        <div className="form-check mt-2">
                          <input
                            type="checkbox"
                            id={checkField}
                            className="form-check-input"
                            name={checkField}
                            onChange={(e) => {
                              const isChecked = e.target.checked;

                              updateFun({
                                field: checkField,
                                value: isChecked,
                              });

                              updateFun({
                                field: markField,
                                value: isChecked ? "Absent" : "",
                              });
                            }}
                            checked={updatestate[checkField]}
                          />
                          <label
                            htmlFor={checkField}
                            className="fw-semibold ms-2 text-danger"
                            style={{ letterSpacing: "3px" }}
                          >
                            Absent
                          </label>
                        </div>
                      </div>
                    );
                  }
                )}

              {[1, 2].map((no) => {
                return (
                  <div className={no == 1 ? "" : "mt-4"} key={no}>
                    <label
                      htmlFor={no == 1 ? "Assignment" : "Seminar"}
                      className="fw-bold text-uppercase"
                      style={{ letterSpacing: "2px" }}
                    >
                      {" "}
                      {no == 1 ? "Assignment" : "Seminar"}{" "}
                    </label>
                    <input
                      type="number"
                      id={no == 1 ? "Assignment" : "Seminar"}
                      className="form-control"
                      placeholder={no == 1 ? "Assignment" : "Seminar"}
                      name={no == 1 ? "Assignment" : "Seminar"}
                      onChange={(e) => {
                        updateFun({
                          field: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      value={
                        no == 1 ? updatestate.Assignment : updatestate.Seminar
                      }
                      max={5}
                      min={0}
                    />
                  </div>
                );
              })}

              <div className="d-flex justify-content-around mt-3">
                <Button variant="secondary" onClick={handleCloseModalUP}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    UpdateStudentMark(selectedStudent);
                  }}
                >
                  Update
                </Button>
              </div>
            </>
          ) : (
            <p>Please set Mark After Edit</p>
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {/* Lab Mark Entry */}
      <Modal show={showModalLab} onHide={handleCloseModalLab}>
        <Modal.Header
          closeButton
          className="bg-primary text-light d-flex justify-content-center align-items-center fw-bold"
        >
          <Modal.Title className="text-center text-uppercase">
            {" "}
            Lab Mark
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent ? (
            <>
              <div className="d-flex justify-content-between align-items-center ">
                <p>
                  {" "}
                  <strong>Name: </strong> {selectedStudent.Name}{" "}
                </p>
                <p>
                  {" "}
                  <strong>Roll No: </strong>{" "}
                  {selectedStudent.rollno.toUpperCase()}{" "}
                </p>
              </div>

              {selectedStudent &&
                [1, 2].map((no) => {
                  const checkField = `check${no}`;
                  const markField = `mark${no}`;

                  return (
                    <div className="mt-3 mb-4" key={no}>
                      <label htmlFor="" className="text-uppercase fw-bold">
                        {no === 1 ? "Internal - I" : "Internal - II"}
                      </label>
                      <input
                        type={Labstate[checkField] ? "text" : "number"}
                        className="form-control"
                        placeholder={`Internal - ${no}`}
                        value={Labstate[markField]}
                        onChange={(e) =>
                          LabFun({
                            field: markField,
                            value: e.target.value,
                          })
                        }
                        disabled={Labstate[checkField]}
                        min={0}
                        max={30}
                      />
                      <div className="form-check mt-2">
                        <input
                          type="checkbox"
                          id={checkField}
                          className="form-check-input"
                          name={checkField}
                          onChange={(e) => {
                            const isChecked = e.target.checked;

                            LabFun({
                              field: checkField,
                              value: isChecked,
                            });

                            LabFun({
                              field: markField,
                              value: isChecked ? "Absent" : "",
                            });
                          }}
                          checked={Labstate[checkField]}
                        />
                        <label
                          htmlFor={checkField}
                          className="fw-semibold ms-2 text-danger"
                          style={{ letterSpacing: "3px" }}
                        >
                          Absent
                        </label>
                      </div>
                    </div>
                  );
                })}

              {[1, 2].map((no) => {
                return (
                  <div className={no == 1 ? "" : "mt-4"} key={no}>
                    <label
                      htmlFor={no == 1 ? "Assignment" : "Seminar"}
                      className="fw-bold text-uppercase"
                      style={{ letterSpacing: "2px" }}
                    >
                      {" "}
                      {no == 1 ? "Lab Record" : "Observation Mark"}{" "}
                    </label>
                    <input
                      type="number"
                      id={no == 1 ? "LabRecord" : "Observation"}
                      className="form-control"
                      placeholder={no == 1 ? "LabRecord" : "Observation"}
                      name={no == 1 ? "LabRecord" : "Observation"}
                      onChange={(e) => {
                        LabFun({
                          field: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      value={
                        no == 1 ? Labstate.LabRecord : Labstate.Observation
                      }
                      max={5}
                      min={0}
                    />
                  </div>
                );
              })}

              <div className="d-flex justify-content-around mt-3">
                <Button variant="secondary" onClick={handleCloseModalLab}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    LabMark(selectedStudent);
                  }}
                >
                  save
                </Button>
              </div>
            </>
          ) : (
            <p>Please set Mark After Edit</p>
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {/* Lab Mark Update */}
      <Modal show={showModalLabUp} onHide={handleCloseModalLabUp}>
        <Modal.Header
          closeButton
          className="bg-primary text-light d-flex justify-content-center align-items-center fw-bold"
        >
          <Modal.Title className="text-center text-uppercase">
            {" "}
            Lab Mark Update
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent ? (
            <>
              <div className="d-flex justify-content-between align-items-center ">
                <p>
                  {" "}
                  <strong>Name: </strong> {selectedStudent.Name}{" "}
                </p>
                <p>
                  {" "}
                  <strong>Roll No: </strong>{" "}
                  {selectedStudent.rollno.toUpperCase()}{" "}
                </p>
              </div>

              {selectedStudent &&
                [1, 2].map((no) => {
                  const checkField = `check${no}`;
                  const markField = `mark${no}`;

                  return (
                    <div className="mt-3 mb-4" key={no}>
                      <label htmlFor="" className="text-uppercase fw-bold">
                        {no === 1 ? "Internal - I" : "Internal - II"}
                      </label>
                      <input
                        type={LabstateUp[checkField] ? "text" : "number"}
                        className="form-control"
                        placeholder={`Internal - ${no}`}
                        value={LabstateUp[markField]}
                        onChange={(e) =>
                          LabFunUp({
                            field: markField,
                            value: e.target.value,
                          })
                        }
                        disabled={LabstateUp[checkField]}
                        min={0}
                        max={30}
                      />
                      <div className="form-check mt-2">
                        <input
                          type="checkbox"
                          id={checkField}
                          className="form-check-input"
                          name={checkField}
                          onChange={(e) => {
                            const isChecked = e.target.checked;

                            LabFunUp({
                              field: checkField,
                              value: isChecked,
                            });

                            LabFunUp({
                              field: markField,
                              value: isChecked ? "Absent" : "",
                            });
                          }}
                          checked={LabstateUp[checkField]}
                        />
                        <label
                          htmlFor={checkField}
                          className="fw-semibold ms-2 text-danger"
                          style={{ letterSpacing: "3px" }}
                        >
                          Absent
                        </label>
                      </div>
                    </div>
                  );
                })}

              {[1, 2].map((no) => {
                return (
                  <div className={no == 1 ? "" : "mt-4"} key={no}>
                    <label
                      htmlFor={no == 1 ? "Assignment" : "Seminar"}
                      className="fw-bold text-uppercase"
                      style={{ letterSpacing: "2px" }}
                    >
                      {" "}
                      {no == 1 ? "Lab Record" : "Observation Mark"}{" "}
                    </label>
                    <input
                      type="number"
                      id={no == 1 ? "LabRecord" : "Observation"}
                      className="form-control"
                      placeholder={no == 1 ? "LabRecord" : "Observation"}
                      name={no == 1 ? "LabRecord" : "Observation"}
                      onChange={(e) => {
                        LabFunUp({
                          field: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      value={
                        no == 1 ? LabstateUp.LabRecord : LabstateUp.Observation
                      }
                      max={5}
                      min={0}
                    />
                  </div>
                );
              })}

              <div className="d-flex justify-content-around mt-3">
                <Button variant="secondary" onClick={handleCloseModalLabUp}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    LabMarkUp(selectedStudent);
                  }}
                >
                  Update
                </Button>
              </div>
            </>
          ) : (
            <p>Please set Mark After Edit</p>
          )}
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default MarkEntry;
