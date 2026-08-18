import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Modal.css";
import Button from "./Button";

function Modal({
    isOpen,
    title,
    children,
    onClose,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
}) {
    const modalRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            modalRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);
    if (!isOpen) return null;

    return (
        <div
            className="modal"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className={`modal-content ${isOpen ? "modal-content--visible" : ""}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >

                <div className="modal-header">

                    <h2 id="modal-title">{title}</h2>

                    <button
                        className="modal-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <div className="modal-body">
                    {children}
                </div>

                <div className="modal-footer">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant="primary"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>

            </div>
        </div>
    );
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
};

export default Modal;
