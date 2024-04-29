import Swal from "sweetalert2";

export const showAlert = async (title: string, text: string, confirmBtnText: string, cancelBtnText: string): Promise<boolean> => {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmBtnText ? confirmBtnText: 'Submit',
      cancelButtonText:  cancelBtnText ? cancelBtnText: 'Cancel'
    });
  
    return result.isConfirmed;
  };