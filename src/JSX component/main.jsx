import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style Component/App.css";
import Rmain from "./Rmain";
import "sweetalert2/dist/sweetalert2.min.css";
import { SubjectProvider } from "./StaffCollection/SubjectContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SubjectProvider>
    <Rmain />
    </SubjectProvider>
  </StrictMode>
);
