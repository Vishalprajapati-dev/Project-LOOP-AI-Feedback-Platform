import { useState } from "react";
import "./Dropdown.css";

function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Select Option");
    const options = [
        "Feedback",
        "Analytics",
        "Bug",
        "Feature Request",
    ];
    return (
        <div className="dropdown">
            <button
                className="dropdown-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption}

                <span>
                    {isOpen ? "▲" : "▼"}
                </span>
            </button>
            {
                isOpen && (
                    <div className="dropdown-menu">
                        {options.map((option) => (
                            <div
                                key={option}
                                className="dropdown-item"
                                onClick={() => {
                                    setSelectedOption(option);
                                    setIsOpen(false);
                                }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}

export default Dropdown;