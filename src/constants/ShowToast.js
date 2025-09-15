import { toast } from "react-hot-toast";

export const showToast = (type, text1, text2) => {
  const message = text2 ? `${text1} - ${text2}` : text1;

  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "info":
      toast(message);
      break;
    default:
      toast(message);
  }
};
