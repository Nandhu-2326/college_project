import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Header

// === Student Page ===
import FirstPage from "./StudentCollections/FirstPage";

// === Admin Pages ===
import AdminLayout from "./AdminCollections/AdminLayout";
import AdminLogin from "./AdminCollections/AdminLogin";
import AdminUserPage from "./AdminCollections/AdminUserPage";
import AdminUserDetails from "./AdminCollections/AdminUserDetails";
import Departments from "./AdminCollections/Departments";
import Subject from "./AdminCollections/Subject";
import StaffAddorUpdatePage from "./AdminCollections/StaffAddorUpdatePage";

// === HOD Pages ===
import HODLayout from "./HODCollections/HODLayout";
import HOD from "./HODCollections/HOD";
import StudentList from "./HODCollections/StudentList";
import StaffDetails from "./HODCollections/StaffDetails";
import AddStaff from "./HODCollections/AddStaff";
import SubjectAlert from "./HODCollections/SubjectAlert";
import StudentCSV from "./HODCollections/StudentCSV";
import SingleStudentdata from "./HODCollections/SingleStudentdata";

// === Staff Pages ===
import StaffLayout from "./StaffCollection/StaffLayout";
import LoginPage from "./StaffCollection/LoginPage";
import StaffSubjects from "./StaffCollection/StaffSubjects";
import MarkEntry from "./StaffCollection/MarkEntry";
import PDFResult from "./StaffCollection/PDFResult";
import SecondPage from "./StudentCollections/SecondPage";
import Header from "./Header";

const Rmain = () => {
  return (
    <Router>
      <Routes>
        {/* === Student Main Page === */}
        <Route path="/" element={<FirstPage />} />
        <Route path="/SecondPage" element={<SecondPage />} />
        <Route path="/Header" element={<Header />} />


        {/* === Staff Section === */}
        <Route path="/StaffLayout" element={<StaffLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="StaffSubjects" element={<StaffSubjects />} />
          <Route path="MarkEntry" element={<MarkEntry />} />
          <Route path="PDFResult" element={<PDFResult />} />
        </Route>

        {/* === HOD Section === */}
        <Route path="/HODLayout" element={<HODLayout />}>
          <Route index element={<HOD />} />
          <Route path="StudentList" element={<StudentList />} />
          <Route path="StaffDetails" element={<StaffDetails />} />
          <Route path="AddStaff" element={<AddStaff />} />
          <Route path="SubjectAlert" element={<SubjectAlert />} />
          <Route path="StudentCSV" element={<StudentCSV />} />
          <Route path="SingleStudentdata" element={<SingleStudentdata />} />
        </Route>

        {/* === Admin Section === */}
        <Route path="/AdminLayout" element={<AdminLayout />}>
          <Route index element={<AdminLogin />} />
          <Route path="AdminUserPage" element={<AdminUserPage />}>
            <Route index element={<Navigate to="AdminUserDetails" replace />} />
            <Route path="AdminUserDetails" element={<AdminUserDetails />} />
            <Route path="Departments" element={<Departments />} />
            <Route path="Subject" element={<Subject />} />
            <Route
              path="StaffAddorUpdatePage"
              element={<StaffAddorUpdatePage />}
            />
          </Route>
        </Route>

        {/* === Fallback Route === */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default Rmain;
