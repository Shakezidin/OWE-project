import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    message: string;
  }

const ToastComponent: React.FC<Props> = ({ message }) => {
  
    const notify = () => {
        toast.success(message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          // Add your custom background color here
          style: {
            background: 'green',
          },
        });
      };
  return (
    <>
  <ToastContainer />
  {notify()}
    </>
  );
};

export default ToastComponent;
