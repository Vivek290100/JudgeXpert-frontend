// C:\Users\vivek_laxvnt1\Desktop\JudgeXpert\Frontend\src\utils\toast\toast.ts
import toast from "react-hot-toast";

export const setToastMessage = (message: string) => {
  localStorage.setItem("toastMessage", message);
};

export const showStoredToast = () => {
  const message = localStorage.getItem("toastMessage");
  if (message) {
    toast.success(message);
    localStorage.removeItem("toastMessage");
  }
};
