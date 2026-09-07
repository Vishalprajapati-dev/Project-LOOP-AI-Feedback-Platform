import { useState } from "react";
import "./FeedbackTable.css";

function FeedbackTable({ feedback = [] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredFeedback = feedback.filter(
    (item) => {
      const customer =
        item.customerLabel ||
        "Anonymous Customer";

      const matchName = customer
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        status === "All" ||
        item.status === status;

      return matchName && matchStatus;
    }
  );

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "NEW":
        return "status-badge status-pending";

      case "REVIEWED":
        return "status-badge status-reviewed";

      case "ACTIONED":
        return "status-badge status-approved";

      default:
        return "status-badge";
    }
  };

  const formatSentiment = (sentiment) => {
    switch (sentiment) {
      case "POS":
        return "Positive";

      case "NEG":
        return "Negative";

      case "NEU":
        return "Neutral";

      default:
        return "Not analyzed";
    }
  };

  const formatPriority = (priority) => {
    switch (priority) {
      case "HIGH":
        return "High";

      case "MEDIUM":
        return "Medium";

      case "LOW":
        return "Low";

      default:
        return "Medium";
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "NEW":
        return "New";

      case "REVIEWED":
        return "Reviewed";

      case "ACTIONED":
        return "Actioned";

      default:
        return status || "Unknown";
    }
  };

  return (
    <section className="feedback-section">
      <h2>Recent Feedback</h2>

      <div className="feedback-controls">
        <div className="feedback-search">
          <input
            type="text"
            placeholder="Search by customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          className="feedback-filter"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="All">
            All
          </option>

          <option value="NEW">
            New
          </option>

          <option value="REVIEWED">
            Reviewed
          </option>

          <option value="ACTIONED">
            Actioned
          </option>
        </select>
      </div>

      <div className="feedback-table-wrapper">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Status</th>
              <th>Sentiment</th>
              <th>Priority</th>
              <th>Confidence</th>
            </tr>
          </thead>

          <tbody>
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map(
                (item) => {
                  const customer =
                    item.customerLabel ||
                    "Anonymous Customer";

                  return (
                    <tr
                      key={
                        item.id ||
                        item._id
                      }
                    >
                      <td>
                        <div className="feedback-user">
                          <div className="feedback-avatar">
                            {getInitials(
                              customer
                            )}
                          </div>

                          <span className="feedback-name">
                            {customer}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            item.status
                          )}
                        >
                          {formatStatus(
                            item.status
                          )}
                        </span>
                      </td>

                      <td>
                        {formatSentiment(
                          item.sentiment
                        )}
                      </td>

                      <td>
                        {formatPriority(
                          item.aiPriority
                        )}
                      </td>

                      <td>
                        {typeof item.aiConfidence ===
                        "number"
                          ? `${item.aiConfidence}%`
                          : "—"}
                      </td>
                    </tr>
                  );
                }
              )
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="feedback-empty"
                >
                  No feedback found.
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