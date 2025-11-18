import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";

function toastify(message: string | string[], props: ToastOptions = {}) {
  if (!props.type) {
    props.type = "success";
  }
  if (Array.isArray(message)) {
    message.forEach((msg) => toast(msg, props));
  } else {
    toast(message, props);
  }
}

export default toastify;
