import { toast } from "react-toastify";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

const notifySuccess = (message) =>
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const notifyError = (message) =>
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

const notifyInfo = (message, toastId = 'processing-toast') => {
  // CSV processing toast should not auto-close
  const isCsvProcessingToast = toastId === 'csv-processing-toast';
  
  return toast.info(message, {
    position: "top-center",
    autoClose: isCsvProcessingToast ? false : 5000, // No auto-close for CSV processing
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    toastId: toastId, // Allow custom toast ID
  });
};

export { notifySuccess, notifyError, notifyInfo };
