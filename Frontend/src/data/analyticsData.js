export const reportData = {
    "Last 7 Days": {
        totalFeedback: 86,
        feedbackChange: "+8%",
        overall: "76%",
        positive: "62%",
        negative: "22%",
        neutral: "16%",
        resolved: 61,
        resolutionRate: "71%",
        pending: 25,
        reviewed: 34,
        confidence: "96%",

        checkout: "28%",
        navigation: "22%",
        performance: "16%",
        support: "12%",

        insights: [
            {
                icon: "✦",
                text: "Customer sentiment improved by",
                value: " 8.4%",
                suffix: " during this period."
            },
            {
                icon: "⚠",
                text: "Checkout issues remain the",
                value: " highest-impact issue",
                suffix: "."
            },
            {
                icon: "↗",
                text: "Navigation complaints remain",
                value: " active",
                suffix: " across customer feedback."
            }
        ],

        recommendations: [
            {
                priority: "HIGH",
                className: "high",
                title: "Simplify checkout flow",
                description:
                    "Reduce unnecessary steps and improve checkout clarity."
            },
            {
                priority: "MEDIUM",
                className: "medium",
                title: "Improve navigation discoverability",
                description:
                    "Make important actions easier for users to find."
            },
            {
                priority: "LOW",
                className: "low",
                title: "Maintain support response times",
                description:
                    "Continue the current fast customer support experience."
            }
        ]
    },

    "Last 30 Days": {
        totalFeedback: 120,
        feedbackChange: "+12%",
        overall: "72%",
        positive: "58%",
        negative: "27%",
        neutral: "15%",
        resolved: 85,
        resolutionRate: "71%",
        pending: 35,
        reviewed: 42,
        confidence: "94%",

        checkout: "32%",
        navigation: "24%",
        performance: "18%",
        support: "14%",

        insights: [
            {
                icon: "✦",
                text: "Customer sentiment improved by",
                value: " 8.4%",
                suffix: " during this period."
            },
            {
                icon: "⚠",
                text: "Checkout experience remains the",
                value: " highest-impact issue",
                suffix: "."
            },
            {
                icon: "↗",
                text: "Navigation complaints are",
                value: " trending upward",
                suffix: "."
            }
        ],

        recommendations: [
            {
                priority: "HIGH",
                className: "high",
                title: "Simplify checkout flow",
                description:
                    "Reduce unnecessary steps and improve checkout clarity."
            },
            {
                priority: "MEDIUM",
                className: "medium",
                title: "Improve navigation discoverability",
                description:
                    "Make important actions easier for users to find."
            },
            {
                priority: "LOW",
                className: "low",
                title: "Maintain support response times",
                description:
                    "Continue the current fast customer support experience."
            }
        ]
    },

    "Last 90 Days": {
        totalFeedback: 310,
        feedbackChange: "+18%",
        overall: "69%",
        positive: "55%",
        negative: "30%",
        neutral: "15%",
        resolved: 220,
        resolutionRate: "71%",
        pending: 90,
        reviewed: 112,
        confidence: "93%",

        checkout: "35%",
        navigation: "27%",
        performance: "21%",
        support: "16%",

        insights: [
            {
                icon: "✦",
                text: "Customer sentiment shows a",
                value: " positive long-term trend",
                suffix: "."
            },
            {
                icon: "⚠",
                text: "Checkout remains the",
                value: " primary long-term concern",
                suffix: "."
            },
            {
                icon: "↗",
                text: "Navigation remains a",
                value: " recurring issue",
                suffix: "."
            }
        ],

        recommendations: [
            {
                priority: "HIGH",
                className: "high",
                title: "Prioritize checkout improvements",
                description:
                    "Focus on the checkout experience to reduce recurring negative feedback."
            },
            {
                priority: "MEDIUM",
                className: "medium",
                title: "Redesign navigation experience",
                description:
                    "Improve navigation structure and make key actions easier to discover."
            },
            {
                priority: "LOW",
                className: "low",
                title: "Improve overall platform performance",
                description:
                    "Continue optimizing application speed and responsiveness."
            }
        ]
    },

    "This Year": {
        totalFeedback: 1240,
        feedbackChange: "+24%",
        overall: "72%",
        positive: "58%",
        negative: "27%",
        neutral: "15%",
        resolved: 882,
        resolutionRate: "71%",
        pending: 358,
        reviewed: 420,
        confidence: "94%",

        checkout: "38%",
        navigation: "29%",
        performance: "23%",
        support: "18%",

        insights: [
            {
                icon: "✦",
                text: "Customer sentiment has shown a",
                value: " positive yearly trend",
                suffix: "."
            },
            {
                icon: "⚠",
                text: "Checkout experience generated the",
                value: " highest amount of negative feedback",
                suffix: " this year."
            },
            {
                icon: "↗",
                text: "Navigation difficulties continue to appear",
                value: " across customer feedback",
                suffix: "."
            }
        ],

        recommendations: [
            {
                priority: "HIGH",
                className: "high",
                title: "Prioritize checkout improvements",
                description:
                    "Focus on the checkout journey to reduce long-term customer friction."
            },
            {
                priority: "MEDIUM",
                className: "medium",
                title: "Redesign navigation experience",
                description:
                    "Make important actions easier for users to discover."
            },
            {
                priority: "LOW",
                className: "low",
                title: "Continue improving support response times",
                description:
                    "Maintain the positive customer support experience."
            }
        ]
    }
};

export const sentimentDataByRange = {
    "Last 7 Days": [
        { month: "Mon", positive: 52, negative: 28, neutral: 20 },
        { month: "Tue", positive: 58, negative: 25, neutral: 17 },
        { month: "Wed", positive: 55, negative: 27, neutral: 18 },
        { month: "Thu", positive: 64, negative: 22, neutral: 14 },
        { month: "Fri", positive: 68, negative: 20, neutral: 12 },
        { month: "Sat", positive: 72, negative: 18, neutral: 10 },
        { month: "Sun", positive: 76, negative: 16, neutral: 8 }
    ],

    "Last 30 Days": [
        { month: "Week 1", positive: 48, negative: 32, neutral: 20 },
        { month: "Week 2", positive: 55, negative: 28, neutral: 17 },
        { month: "Week 3", positive: 64, negative: 23, neutral: 13 },
        { month: "Week 4", positive: 76, negative: 16, neutral: 8 }
    ],

    "Last 90 Days": [
        { month: "Apr", positive: 64, negative: 23, neutral: 13 },
        { month: "May", positive: 69, negative: 20, neutral: 11 },
        { month: "Jun", positive: 76, negative: 16, neutral: 8 }
    ],

    "This Year": [
        { month: "Jan", positive: 48, negative: 32, neutral: 20 },
        { month: "Feb", positive: 55, negative: 28, neutral: 17 },
        { month: "Mar", positive: 51, negative: 31, neutral: 18 },
        { month: "Apr", positive: 64, negative: 23, neutral: 13 },
        { month: "May", positive: 69, negative: 20, neutral: 11 },
        { month: "Jun", positive: 76, negative: 16, neutral: 8 }
    ]
};

export const kpiDataByRange = {
    "Last 7 Days": {
        overall: "76%",
        positive: "62%",
        negative: "22%",
        confidence: "96%"
    },

    "Last 30 Days": {
        overall: "72%",
        positive: "58%",
        negative: "27%",
        confidence: "94%"
    },

    "Last 90 Days": {
        overall: "69%",
        positive: "55%",
        negative: "30%",
        confidence: "93%"
    },

    "This Year": {
        overall: "72%",
        positive: "58%",
        negative: "27%",
        confidence: "94%"
    }
};

export const categoryDataByRange = {
    "Last 7 Days": [
        { category: "UX", count: 48 },
        { category: "Navigation", count: 32 },
        { category: "Performance", count: 26 },
        { category: "Support", count: 18 },
        { category: "Pricing", count: 12 }
    ],

    "Last 30 Days": [
        { category: "UX", count: 42 },
        { category: "Navigation", count: 31 },
        { category: "Performance", count: 26 },
        { category: "Support", count: 18 },
        { category: "Pricing", count: 12 }
    ],

    "Last 90 Days": [
        { category: "UX", count: 46 },
        { category: "Navigation", count: 31 },
        { category: "Performance", count: 26 },
        { category: "Support", count: 26 },
        { category: "Pricing", count: 11 }
    ],

    "This Year": [
        { category: "UX", count: 50 },
        { category: "Navigation", count: 36 },
        { category: "Performance", count: 30 },
        { category: "Support", count: 22 },
        { category: "Pricing", count: 15 }
    ]
};