import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
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

const PDFResult = () => {
  const nav = useNavigate();
  const [staffData, setStaffData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);

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

  useEffect(() => {
    if (staffData && selectedSubject) {
      console.log(staffData);
      console.log(selectedSubject);
    }
  }, [staffData, selectedSubject]);

  const fetchStudentMark = async () => {
    const querys = query(
      collection(db, "student"),
      where("Department", "==", selectedSubject.department),
      where("year", "==", Number(selectedSubject.year))
    );
  
    const studentData = await getDocs(querys);
    const allStudentData = [];
  
    for (let studentDoc of studentData.docs) {
      const studentInfo = studentDoc.data();
      const studentId = studentDoc.id;
  
      // Reference to the subject mark document
      const markDocRef = doc(
        db,
        "student",
        studentId,
        selectedSubject.semester,
        selectedSubject.subject
      );
  
      const markSnap = await getDoc(markDocRef);
      const markData = markSnap.exists() ? markSnap.data() : {};
  
      allStudentData.push({
        ...studentInfo,
        id: studentId,
        markDetails: markData, // contains all fields in subject mark document
      });
    }
  
    console.log(allStudentData);
  };
  

  useEffect(() => {
    if (selectedSubject) {
      fetchStudentMark();
    }
  }, [selectedSubject]);
  return (
    <>
      {/* Back Page */}
      <div className="container  d-felx p-3 justify-content-start align-items-center">
        <button
          className="btn text-primary border-0 fs-3"
          onClick={() => {
            nav("/StaffLayout/MarkEntry");
          }}
        >
          <FaArrowLeftLong /> Back
        </button>
      </div>
    </>
  );
};

export default PDFResult;
