import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminUserPage from "./AdminUserPage";
import FirstPage from "./FirstPage";
import LoginPage from "./LoginPage";
import UserSelect from "./UserSelect";
import SingleStudent from "./SingleStudent";
import MultipleStudentCSV from "./MultipleStudentCSV";
import AdminUserDetails from "./AdminUserDetails";
import AdminStaff from "./AdminStaff";
import CalculatorPage from "./CalculatorPage";

const Rmain = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/UserSelect" element={<UserSelect />} />
          <Route path="/CalculatorPage" element={ <CalculatorPage/> } />
          <Route path="/AdminLogin" element={<AdminLogin />} />
          <Route path="/AdminUserPage" element={<AdminUserPage />}>
            <Route path="SingleStudent" element={<SingleStudent />} />
            <Route path="MultipleStudentCSV" element={ <MultipleStudentCSV/> } />
            <Route path="AdminUserDetails" element={ <AdminUserDetails/> } />
            <Route path="AdminStaff" element={ <AdminStaff/>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default Rmain;
