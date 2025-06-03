import Swal from "sweetalert2";

export const loading = () => {
    Swal.fire({
      html: "Loading...",
      timer: 2000,
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

const SweetAlert = () => {
  return (
    <div>

    </div>
  )
}

export default SweetAlert