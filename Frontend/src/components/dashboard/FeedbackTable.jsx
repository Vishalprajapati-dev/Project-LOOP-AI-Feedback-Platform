import { useState } from "react";
import "./FeedbackTable.css";

import { feedbackData } from "../../data/feedbackData";

function FeedbackTable() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    const filteredFeedback = feedbackData.filter((item) => {
        const matchName = item.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchStatus =
            status === "All" || item.status === status;

        return matchName && matchStatus;
    });

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
                return "status-badge status-pending";

            case "Reviewed":
                return "status-badge status-reviewed";

            case "Approved":
                return "status-badge status-approved";

            default:
                return "status-badge";
        }
    };

    return (
        <section className="feedback-section">

            <h2>Recent Feedback</h2>

            <div className="feedback-controls">

                <div className="feedback-search">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="feedback-filter"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Approved">Approved</option>
                </select>

            </div>

            <div className="feedback-table-wrapper">

                <table className="feedback-table">

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {filteredFeedback.length > 0 ? (

                            filteredFeedback.map((item) => (

                                <tr key={item.id}>

                                    <td>
                                        <div className="feedback-user">

                                            <div className="feedback-avatar">
                                                {getInitials(item.name)}
                                            </div>

                                            <span className="feedback-name">
                                                {item.name}
                                            </span>

                                        </div>
                                    </td>

                                    <td>
                                        <span
                                            className={getStatusClass(item.status)}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>
                                <td
                                    colSpan="2"
                                    className="feedback-empty"
                                >
                                    No Feedback Found 😔
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
}

export default FeedbackTable;