import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminUserPage from "./AdminUserPage";
import FirstPage from "./FirstPage";
import LoginPage from "./LoginPage";
import UserSelect from "./UserSelect";
import SingleStudent from "./SingleStudent";
import MultipleStudentCSV from "./MultipleStudentCSV";
import AdminUserDetails from "./AdminUserDetails";
import CalculatorPage from "./CalculatorPage";
import StaffAddorUpdatePage from "./StaffAddorUpdatePage";
import DegPage from "./DegPage";
import CSVFile from "./CSVFile";
import Departments from "./Departments";
import Subject from "./Subject";
import HOD from "./HOD";
import HODLayout from "./HODLayout";
import HOD_Cstaff from "./HOD_Cstaff";
const Rmain = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/HODLayout" element={<HODLayout />}>
            <Route index element={<HOD />} />
            <Route path="HOD_Cstaff" element={ <HOD_Cstaff/> } />
          </Route>
          <Route path="/UserSelect" element={<UserSelect />} />
          <Route path="/DegPage" element={<DegPage />} />
          <Route path="/CalculatorPage" element={<CalculatorPage />} />
          <Route path="/CSVFile" element={<CSVFile />} />
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
