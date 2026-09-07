import { useMemo, useState } from "react";
import jsPDF from "jspdf";

import useReports from "../../hooks/useReports";
import "./Reports.css";

function Reports() {
    const [range, setRange] = useState("Last 30 Days");
    const [selectedReport, setSelectedReport] = useState(null);

    const {
        reports,
        loading,
        generating,
        error,
        generateReport,
    } = useReports();

    /* =========================
       DATE RANGE
    ========================= */

    const getPeriod = () => {
        const today = new Date();

        const periodEnd = new Date(today);
        let periodStart = new Date(today);

        if (range === "Last 7 Days") {
            periodStart.setDate(
                today.getDate() - 7
            );
        }

        if (range === "Last 30 Days") {
            periodStart.setDate(
                today.getDate() - 30
            );
        }

        if (range === "Last 90 Days") {
            periodStart.setDate(
                today.getDate() - 90
            );
        }

        if (range === "This Year") {
            periodStart = new Date(
                today.getFullYear(),
                0,
                1
            );

            periodEnd.setMonth(11);
            periodEnd.setDate(31);
            periodEnd.setHours(
                23,
                59,
                59,
                999
            );
        }

        return {
            periodStart,
            periodEnd,
        };
    };

    /* =========================
       GENERATE REPORT
    ========================= */

    const handleGenerateReport = async () => {
        try {
            const {
                periodStart,
                periodEnd,
            } = getPeriod();

            const report =
                await generateReport(
                    periodStart.toISOString(),
                    periodEnd.toISOString()
                );

            if (report) {
                setSelectedReport(report);
            }
        } catch {
            // Hook already stores the error.
        }
    };

    /* =========================
       ACTIVE REPORT
    ========================= */

    const activeReport =
        selectedReport || reports[0] || null;

    const data = useMemo(() => {
        if (!activeReport) {
            return null;
        }

        const content =
            activeReport.contentJson || {};

        const total =
            content.totalFeedbacks || 0;

        const sentiment =
            content.sentiment || {};

        const percentages =
            content.sentimentPercentages || {};

        const positive =
            percentages.positive ??
            (total
                ? Math.round(
                    (sentiment.positive /
                        total) *
                        100
                )
                : 0);

        const negative =
            percentages.negative ??
            (total
                ? Math.round(
                    (sentiment.negative /
                        total) *
                        100
                )
                : 0);

        const neutral =
            percentages.neutral ??
            (total
                ? Math.round(
                    (sentiment.neutral /
                        total) *
                        100
                )
                : 0);

        return {
            totalFeedback: total,

            positive,

            negative,

            neutral,

            overallSentiment:
                positive >= negative &&
                positive >= neutral
                    ? "Positive"
                    : negative >= neutral
                        ? "Negative"
                        : "Neutral",

            channels:
                content.channels || {},

            quotes:
                content.quotes || [],

            periodStart:
                activeReport.periodStart,

            periodEnd:
                activeReport.periodEnd,

            title:
                activeReport.title ||
                "Feedback Report",
        };
    }, [activeReport]);

    /* =========================
       PDF
    ========================= */

    const handleDownload = () => {
        if (!data) {
            return;
        }

        const doc = new jsPDF();

        const margin = 20;
        const pageWidth =
            doc.internal.pageSize.getWidth();

        let y = 20;

        doc.setFontSize(20);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Project Loop",
            margin,
            y
        );

        y += 10;

        doc.setFontSize(16);

        doc.text(
            "Feedback Report",
            margin,
            y
        );

        y += 8;

        doc.setFontSize(10);
        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setTextColor(
            100,
            116,
            139
        );

        doc.text(
            `Period: ${new Date(
                data.periodStart
            ).toLocaleDateString()} - ${new Date(
                data.periodEnd
            ).toLocaleDateString()}`,
            margin,
            y
        );

        y += 15;

        doc.setTextColor(
            15,
            23,
            42
        );

        doc.setFontSize(13);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Summary",
            margin,
            y
        );

        y += 9;

        doc.setFontSize(10);
        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            `Total Feedback: ${data.totalFeedback}`,
            margin,
            y
        );

        y += 7;

        doc.text(
            `Overall Sentiment: ${data.overallSentiment}`,
            margin,
            y
        );

        y += 7;

        doc.text(
            `Positive: ${data.positive}%`,
            margin,
            y
        );

        y += 7;

        doc.text(
            `Negative: ${data.negative}%`,
            margin,
            y
        );

        y += 7;

        doc.text(
            `Neutral: ${data.neutral}%`,
            margin,
            y
        );

        y += 15;

        doc.setFontSize(13);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Channels",
            margin,
            y
        );

        y += 9;

        doc.setFontSize(10);
        doc.setFont(
            "helvetica",
            "normal"
        );

        Object.entries(
            data.channels
        ).forEach(
            ([channel, count]) => {
                doc.text(
                    `${channel}: ${count}`,
                    margin,
                    y
                );

                y += 7;
            }
        );

        y += 8;

        doc.setFontSize(13);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Recent Feedback",
            margin,
            y
        );

        y += 9;

        doc.setFontSize(10);
        doc.setFont(
            "helvetica",
            "normal"
        );

        data.quotes.forEach(
            (quote) => {
                const lines =
                    doc.splitTextToSize(
                        `${quote.channel || "Unknown"}: ${quote.content}`,
                        pageWidth -
                            margin * 2
                    );

                if (y > 265) {
                    doc.addPage();
                    y = 20;
                }

                doc.text(
                    lines,
                    margin,
                    y
                );

                y +=
                    lines.length *
                        6 +
                    4;
            }
        );

        doc.setFontSize(8);
        doc.setTextColor(
            100,
            116,
            139
        );

        doc.text(
            "Generated by Project Loop",
            margin,
            285
        );

        doc.save(
            `Project-Loop-${range.replaceAll(
                " ",
                "-"
            )}-Report.pdf`
        );
    };

    /* =========================
       EMPTY STATE
    ========================= */

    if (loading) {
        return (
            <div className="reports-page">
                <div className="reports-header">
                    <div>
                        <h1>
                            Feedback Reports
                        </h1>

                        <p>
                            Turn customer feedback
                            into clear business
                            decisions.
                        </p>
                    </div>
                </div>

                <div className="report-card">
                    <p>
                        Loading reports...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-page print-report">

            {/* HEADER */}

            <div className="reports-header">

                <div>
                    <h1>
                        Feedback Reports
                    </h1>

                    <p>
                        Turn customer feedback
                        into clear business
                        decisions.
                    </p>
                </div>

                <div className="reports-actions">

                    <select
                        value={range}
                        onChange={(e) =>
                            setRange(
                                e.target.value
                            )
                        }
                    >
                        <option>
                            Last 7 Days
                        </option>

                        <option>
                            Last 30 Days
                        </option>

                        <option>
                            Last 90 Days
                        </option>

                        <option>
                            This Year
                        </option>
                    </select>

                    <button
                        className="generate-btn"
                        onClick={
                            handleGenerateReport
                        }
                        disabled={generating}
                    >
                        {generating
                            ? "Generating..."
                            : "✦ Generate Report"}
                    </button>

                </div>
            </div>

            {/* ERROR */}

            {error && (
                <div className="report-card">
                    <p>
                        {error}
                    </p>
                </div>
            )}

            {/* NO REPORT */}

            {!data && !error && (
                <div className="report-card">
                    <div className="report-card-header">
                        <div>
                            <h2>
                                No reports yet
                            </h2>

                            <p>
                                Select a period and
                                generate your first
                                report.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {data && (
                <>
                    {/* REPORT SELECTOR */}

                    {reports.length > 1 && (
                        <div
                            className="report-card"
                            style={{
                                marginBottom:
                                    "20px",
                            }}
                        >
                            <div className="report-card-header">
                                <div>
                                    <h2>
                                        Generated
                                        Reports
                                    </h2>

                                    <p>
                                        Select a
                                        previously
                                        generated
                                        report.
                                    </p>
                                </div>
                            </div>

                            <select
                                value={
                                    activeReport?._id ||
                                    ""
                                }
                                onChange={(e) => {
                                    const report =
                                        reports.find(
                                            (item) =>
                                                item._id ===
                                                e.target.value
                                        );

                                    setSelectedReport(
                                        report || null
                                    );
                                }}
                            >
                                {reports.map(
                                    (report) => (
                                        <option
                                            key={
                                                report._id
                                            }
                                            value={
                                                report._id
                                            }
                                        >
                                            {report.title}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    )}

                    {/* SUMMARY */}

                    <div className="report-stats">

                        <div className="report-stat">
                            <span className="report-stat-icon">
                                📊
                            </span>

                            <div>
                                <span>
                                    Total Feedback
                                </span>

                                <strong>
                                    {
                                        data.totalFeedback
                                    }
                                </strong>

                                <small>
                                    From selected
                                    period
                                </small>
                            </div>
                        </div>

                        <div className="report-stat">
                            <span className="report-stat-icon">
                                😊
                            </span>

                            <div>
                                <span>
                                    Overall
                                    Sentiment
                                </span>

                                <strong>
                                    {
                                        data.overallSentiment
                                    }
                                </strong>

                                <small>
                                    Based on
                                    feedback
                                </small>
                            </div>
                        </div>

                        <div className="report-stat">
                            <span className="report-stat-icon">
                                ✓
                            </span>

                            <div>
                                <span>
                                    Positive
                                </span>

                                <strong>
                                    {data.positive}%
                                </strong>

                                <small>
                                    Customer
                                    sentiment
                                </small>
                            </div>
                        </div>

                        <div className="report-stat">
                            <span className="report-stat-icon">
                                ✦
                            </span>

                            <div>
                                <span>
                                    Reports
                                </span>

                                <strong>
                                    {
                                        reports.length
                                    }
                                </strong>

                                <small>
                                    Generated
                                </small>
                            </div>
                        </div>

                    </div>

                    {/* SENTIMENT + CHANNELS */}

                    <div className="report-grid">

                        <div className="report-card">

                            <div className="report-card-header">
                                <div>
                                    <h2>
                                        Sentiment
                                        Summary
                                    </h2>

                                    <p>
                                        Overall customer
                                        sentiment
                                    </p>
                                </div>
                            </div>

                            <div className="sentiment-summary">

                                <div className="sentiment-row">
                                    <div>
                                        <span className="dot positive-dot" />
                                        Positive
                                    </div>

                                    <strong>
                                        {data.positive}%
                                    </strong>
                                </div>

                                <div className="progress">
                                    <div
                                        className="progress-positive"
                                        style={{
                                            width: `${data.positive}%`,
                                        }}
                                    />
                                </div>

                                <div className="sentiment-row">
                                    <div>
                                        <span className="dot negative-dot" />
                                        Negative
                                    </div>

                                    <strong>
                                        {data.negative}%
                                    </strong>
                                </div>

                                <div className="progress">
                                    <div
                                        className="progress-negative"
                                        style={{
                                            width: `${data.negative}%`,
                                        }}
                                    />
                                </div>

                                <div className="sentiment-row">
                                    <div>
                                        <span className="dot neutral-dot" />
                                        Neutral
                                    </div>

                                    <strong>
                                        {data.neutral}%
                                    </strong>
                                </div>

                                <div className="progress">
                                    <div
                                        className="progress-neutral"
                                        style={{
                                            width: `${data.neutral}%`,
                                        }}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="report-card">

                            <div className="report-card-header">
                                <div>
                                    <h2>
                                        Feedback
                                        Channels
                                    </h2>

                                    <p>
                                        Feedback by
                                        source
                                    </p>
                                </div>
                            </div>

                            <div className="resolution-details">

                                {Object.keys(
                                    data.channels
                                ).length > 0 ? (
                                    Object.entries(
                                        data.channels
                                    ).map(
                                        ([
                                            channel,
                                            count,
                                        ]) => (
                                            <div
                                                key={
                                                    channel
                                                }
                                            >
                                                <span className="status-dot reviewed" />

                                                {
                                                    channel
                                                }

                                                <strong>
                                                    {
                                                        count
                                                    }
                                                </strong>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p>
                                        No channel
                                        data available.
                                    </p>
                                )}

                            </div>
                        </div>

                    </div>

                    {/* RECENT FEEDBACK */}

                    <div className="report-card executive-card">

                        <div className="report-card-header">
                            <div>
                                <h2>
                                    Recent Feedback
                                </h2>

                                <p>
                                    Feedback included
                                    in this report.
                                </p>
                            </div>

                            <span className="ai-badge">
                                ✦ Report Data
                            </span>
                        </div>

                        <div className="executive-insights">

                            {data.quotes.length >
                            0 ? (
                                data.quotes.map(
                                    (
                                        quote,
                                        index
                                    ) => (
                                        <div
                                            className="executive-item"
                                            key={
                                                index
                                            }
                                        >
                                            <span>
                                                {quote.sentiment ===
                                                "POS"
                                                    ? "😊"
                                                    : quote.sentiment ===
                                                        "NEG"
                                                        ? "⚠"
                                                        : "•"}
                                            </span>

                                            <p>
                                                {
                                                    quote.content
                                                }

                                                <strong>
                                                    {" "}
                                                    (
                                                    {
                                                        quote.channel
                                                    }
                                                    )
                                                </strong>
                                            </p>
                                        </div>
                                    )
                                )
                            ) : (
                                <p>
                                    No feedback
                                    quotes available.
                                </p>
                            )}

                        </div>
                    </div>

                    {/* FOOTER */}

                    <div className="report-footer-actions">

                        <button
                            className="secondary-report-btn"
                            onClick={() =>
                                window.print()
                            }
                        >
                            🖨 Print Report
                        </button>

                        <button
                            className="primary-report-btn"
                            onClick={
                                handleDownload
                            }
                        >
                            ↓ Download Report
                        </button>

                    </div>
                </>
            )}
        </div>
    );
}

export default Reports;