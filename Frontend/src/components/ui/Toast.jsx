import { useEffect } from "react";
import "./Toast.css";

function Toast({
    message,
    type = "success",
    duration = 3000,
    onClose,
}) {
    useEffect(() => {   
    if (!onClose) return;

    const timer = setTimeout(() => {
        onClose();
    }, duration);

    return () => clearTimeout(timer);
}, [duration, onClose]);

    return (
        <div className={`toast toast-${type}`}>
            {message}
        </div>
    );
}

export default Toast;