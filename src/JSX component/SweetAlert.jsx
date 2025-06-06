import Swal from "sweetalert2";

export const loading = (time) => {
  Swal.fire({
    html: "Loading...",
    timer: time,
    timerProgressBar: true,
    didOpen: () => Swal.showLoading(),
  });
};
export const UserAdd = () => {
  Swal.fire({
    icon: "success",
    title: "User Added",
    timer: 2000,
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
const SweetAlert = () => {
  return <div></div>;
};

export default SweetAlert;
