import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style Component/App.css";
import Rmain from "./Rmain";
import "sweetalert2/dist/sweetalert2.min.css";
// import FirstPage from "./FirstPage.jsx";
// import LoginPage from "./LoginPage.jsx";
// import UserSelect from "./UserSelect";
// import CalculatorPage from "./CalculatorPage";

// Admine Space
// import AdminLogin from "./AdminLogin";
// import AdminUserPage from "./AdminUserPage";
// import MultipleStudentCSV from "./MultipleStudentCSV";
// import AdminUserDetails from "./AdminUserDetails";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <FirstPage /> */}
    {/* <LoginPage /> */}
    {/* <UserSelect /> */}
    {/* <CalculatorPage /> */}
    <Rmain />
    {/* Admin Space */}
    {/* <AdminLogin /> */}
    {/* <AdminUserPage /> */}
    {/* <MultipleStudentCSV /> */}
    {/* <AdminUserDetails /> */}
  </StrictMode>
);
