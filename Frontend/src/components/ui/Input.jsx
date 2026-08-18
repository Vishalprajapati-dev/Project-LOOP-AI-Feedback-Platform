import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./Input.css";

function Input({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    error,
    disabled = false,
    leftIcon,
}) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="input-group">

            {label && (
                <label className="input-label">
                    {label}
                </label>
            )}

            <div className="input-wrapper">
                {leftIcon && (
                    <span className="left-icon">
                        {leftIcon}
                    </span>
                )}

                <input
                    className={`input ${error ? "input-error" : ""}`}
                    type={
                        type === "password"
                            ? showPassword
                                ? "text"
                                : "password"
                            : type
                    }
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                />

                {type === "password" && (
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                )}

            </div>

            {error && (
                <p className="input-error-text">
                    {error}
                </p>
            )}

        </div>
    );
}

export default Input;