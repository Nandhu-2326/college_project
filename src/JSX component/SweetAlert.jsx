import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
export const loading = (time) => {
  Swal.fire({
    html: "Loading...",
    timer: time,
    timerProgressBar: true,
    didOpen: () => Swal.showLoading(),
  });
};
export const UserAdd = (staff) => {
  Swal.fire({
    icon: "success",
    title: staff,
    timer: 2000,
    showConfirmButton: false,
  });
};
export const delSuccess = (para) => {
  Swal.fire({
    icon: "success",
    title: para,
    timer: 1500,
    showConfirmButton: false,
  });
};
export const InformationError = (eror) => {
  let timerInterval;
  Swal.fire({
    html: eror,
    timer: 1000,
    icon: "warning",
    didOpen: () => {
      Swal.showLoading();
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  });
};

export const loginError = () => {
  Swal.fire({
    html: "invalid username and Password ",
    icon: "error",
    title: "Oops",
    timer: 2000,
  });
};
export const loginSuccess = () => {
  Swal.fire({
    icon: "success",
    title: "Login Success",
    timer: 2000,
  });
};

export  const showWarning = (message) => {
  toast(message, {
    icon: "⚠️",
    style: {
      border: "2px solid #ffa500",
      padding: "16px",
      color: "#ffa500",
    },
  });
};


const SweetAlert = () => {
  return <div></div>;
};

export default SweetAlert;
