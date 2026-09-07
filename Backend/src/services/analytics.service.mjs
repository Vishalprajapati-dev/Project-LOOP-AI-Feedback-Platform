import Feedback from "../models/feedback.model.mjs";

const RANGE_DAYS = {
  "Last 7 Days": 7,
  "Last 30 Days": 30,
  "Last 90 Days": 90,
  "This Year": null,
};

export const getAnalyticsOverviewService = async (
  workspaceId,
  range = "Last 30 Days",
) => {
  const now = new Date();
  const startDate = new Date(now);

  let days;

  if (range === "This Year") {
    startDate.setMonth(0, 1);
    startDate.setHours(0, 0, 0, 0);

    days = Math.max(
      1,
      Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) +
        1,
    );
  } else {
    days = RANGE_DAYS[range] || 30;

    startDate.setDate(startDate.getDate() - days);
  }

  const feedback = await Feedback.find({
    workspaceId,
    createdAt: {
      $gte: startDate,
      $lte: now,
    },
  })
    .sort({ createdAt: 1 })
    .lean();

  const totalFeedback = feedback.length;

  const positive = feedback.filter((item) => item.sentiment === "POS").length;

  const negative = feedback.filter((item) => item.sentiment === "NEG").length;

  const neutral = feedback.filter((item) => item.sentiment === "NEU").length;

  const analyzed = feedback.filter(
    (item) => typeof item.aiConfidence === "number" && item.aiConfidence > 0,
  );

  const confidence =
    analyzed.length > 0
      ? Math.round(
          analyzed.reduce((sum, item) => sum + item.aiConfidence, 0) /
            analyzed.length,
        )
      : 0;

  const actioned = feedback.filter((item) => item.status === "ACTIONED").length;

  const reviewed = feedback.filter((item) => item.status === "REVIEWED").length;

  const pending = feedback.filter((item) => item.status === "NEW").length;

  const percentage = (value) =>
    totalFeedback > 0 ? Math.round((value / totalFeedback) * 100) : 0;

  /*
   * SENTIMENT TREND
   */

  const bucketCount = days <= 7 ? 7 : days <= 30 ? 4 : days <= 90 ? 3 : 6;

  const sentimentTrend = [];

  for (let i = 0; i < bucketCount; i++) {
    const bucketStart = new Date(startDate);
    const bucketEnd = new Date(startDate);

    const bucketSize = (now.getTime() - startDate.getTime()) / bucketCount;

    bucketStart.setTime(startDate.getTime() + bucketSize * i);

    bucketEnd.setTime(startDate.getTime() + bucketSize * (i + 1));

    const bucketFeedback = feedback.filter((item) => {
      const date = new Date(item.createdAt);

      return date >= bucketStart && date < bucketEnd;
    });

    const bucketTotal = bucketFeedback.length;

    const bucketPositive = bucketFeedback.filter(
      (item) => item.sentiment === "POS",
    ).length;

    const bucketNegative = bucketFeedback.filter(
      (item) => item.sentiment === "NEG",
    ).length;

    const bucketNeutral = bucketFeedback.filter(
      (item) => item.sentiment === "NEU",
    ).length;

    sentimentTrend.push({
      label:
        days <= 7
          ? bucketStart.toLocaleDateString("en-US", { weekday: "short" })
          : bucketStart.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),

      positive:
        bucketTotal > 0 ? Math.round((bucketPositive / bucketTotal) * 100) : 0,

      negative:
        bucketTotal > 0 ? Math.round((bucketNegative / bucketTotal) * 100) : 0,

      neutral:
        bucketTotal > 0 ? Math.round((bucketNeutral / bucketTotal) * 100) : 0,

      total: bucketTotal,
    });
  }

  /*
   * TOP CATEGORIES
   */

  const categoryMap = {};

  feedback.forEach((item) => {
    const category = item.aiTheme?.trim() || "Uncategorized";

    categoryMap[category] = (categoryMap[category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({
      category,
      count,
    }));

  /*
   * PRIORITY / ISSUES
   */

  const negativeFeedback = feedback.filter((item) => item.sentiment === "NEG");

  const issueMap = {};

  negativeFeedback.forEach((item) => {
    const issue = item.aiTheme?.trim() || "General Issue";

    issueMap[issue] = (issueMap[issue] || 0) + 1;
  });

  const topIssues = Object.entries(issueMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      count,
      percentage:
        negativeFeedback.length > 0
          ? Math.round((count / negativeFeedback.length) * 100)
          : 0,
    }));

  /*
   * AI INSIGHTS
   */

  const insights = [];

  if (topIssues.length > 0) {
    insights.push({
      type: "critical",
      icon: "\u26A0\uFE0F",
      title: `${topIssues[0].name} is the biggest issue`,
      description: `${topIssues[0].percentage}% of negative feedback is related to ${topIssues[0].name}.`,
    });
  }

  if (positive > negative) {
    insights.push({
      type: "positive",
     icon: "\u2728",
      title: "Customer sentiment is mostly positive",
      description: `${percentage(positive)}% of feedback is positive during this period.`,
    });
  } else if (negative > positive) {
    insights.push({
      type: "warning",
      icon: "\u2197\uFE0F",
      title: "Negative sentiment requires attention",
      description: `${percentage(negative)}% of feedback is negative during this period.`,
    });
  }

  insights.push({
    type: "positive",
    icon: "✦",
    title: "AI analysis coverage",
    description: `${analyzed.length} of ${totalFeedback} feedback items have AI confidence data.`,
  });

  /*
   * RECOMMENDED ACTIONS
   */

  const actions = topIssues
    .slice(0, 4)
    .map((issue) => `Investigate and improve ${issue.name}`);

  if (actions.length === 0) {
    actions.push("Collect more customer feedback for actionable insights");
  }

  return {
    range,

    kpis: {
      totalFeedback,
      overall:
        totalFeedback === 0
          ? "No data"
          : positive > negative
            ? "Positive"
            : negative > positive
              ? "Negative"
              : "Neutral",
      positive: `${percentage(positive)}%`,
      negative: `${percentage(negative)}%`,
      neutral: `${percentage(neutral)}%`,
      confidence: `${confidence}%`,
      resolved: actioned,
      reviewed,
      pending,
      resolutionRate: `${percentage(actioned)}%`,
    },

    sentimentTrend,

    categoryData,

    insights,

    topIssues,

    actions,
  };
};
