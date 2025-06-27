import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../JSX component/Style Component/App.css";
import Rmain from "./Rmain";
import "sweetalert2/dist/sweetalert2.min.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Rmain />
  </StrictMode>
);
