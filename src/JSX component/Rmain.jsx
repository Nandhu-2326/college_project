import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./AdminCollections/AdminLogin";
import AdminUserPage from "./AdminCollections/AdminUserPage";
import FirstPage from "./FirstPage";
import LoginPage from "./StaffCollection/LoginPage";

import SingleStudent from "./AdminCollections/SingleStudent";
import MultipleStudentCSV from "./AdminCollections/MultipleStudentCSV";
import AdminUserDetails from "./AdminCollections/AdminUserDetails";
import StaffAddorUpdatePage from "./AdminCollections/StaffAddorUpdatePage";

import Departments from "./AdminCollections/Departments";
import Subject from "./AdminCollections/Subject";
import HOD from "./HODCollections/HOD";
import HODLayout from "./HODCollections/HODLayout";
import StaffDetails from "./HODCollections/StaffDetails";
import AddStaff from "./HODCollections/AddStaff";
import SubjectAlert from "./HODCollections/SubjectAlert";
import StaffLayout from "./StaffCollection/StaffLayout";
import StaffSubjects from "./StaffCollection/StaffSubjects";
import MarkEntry from "./StaffCollection/MarkEntry";
import PDFResult from "./StaffCollection/PDFResult";
import StudentCSV from "./HODCollections/StudentCSV";
import SingleStudentdata from "./HODCollections/SingleStudentdata";
import StudentList from "./HODCollections/StudentList";
const Rmain = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<FirstPage />} />

          <Route path="/StaffLayout" element={<StaffLayout />}>
            <Route index element={<LoginPage />} />
            <Route path="StaffSubjects" element={<StaffSubjects />} />
            <Route path="MarkEntry" element={<MarkEntry />} />
            <Route path="PDFResult" element={ <PDFResult/> } />
          </Route>
    
          <Route path="/HODLayout" element={<HODLayout />}>
            <Route index element={<HOD />} />
            <Route path="StudentList" element={<StudentList />} />
            <Route path="StaffDetails" element={<StaffDetails />} />
            <Route path="AddStaff" element={<AddStaff />} />
            <Route path="SubjectAlert" element={<SubjectAlert />} />
            <Route path="StudentCSV" element={<StudentCSV />} />
            <Route path="SingleStudentdata" element={<SingleStudentdata />} />
          </Route>

          <Route path="/AdminLogin" element={<AdminLogin />} />

          <Route path="/AdminUserPage" element={<AdminUserPage />}>
            <Route path="SingleStudent" element={<SingleStudent />} />
            <Route path="MultipleStudentCSV" element={<MultipleStudentCSV />} />
            <Route path="AdminUserDetails" element={<AdminUserDetails />} />
            <Route path="Departments" element={<Departments />} />
            <Route path="Subject" element={<Subject />} />
            <Route
              path="StaffAddorUpdatePage"
              element={<StaffAddorUpdatePage />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default Rmain;
