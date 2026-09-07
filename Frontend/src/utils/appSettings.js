const SETTINGS_KEY = "projectLoop_settings";

const DEFAULT_SETTINGS = {
    theme: "light",
    emailNotifications: false,
    feedbackAlerts: true,
    reportNotifications: true,
    compactMode: false,
};

export function getSettings() {
    try {
        const stored =
            localStorage.getItem(SETTINGS_KEY);

        if (!stored) {
            return DEFAULT_SETTINGS;
        }

        const parsed = JSON.parse(stored);

        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
        };
    } catch (error) {
        console.error(
            "Failed to load settings:",
            error
        );

        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(settings) {
    const merged = {
        ...DEFAULT_SETTINGS,
        ...settings,
    };

    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(merged)
    );

    applySettings(merged);

    return merged;
}

export function applySettings(settings) {
    const root = document.documentElement;

    root.dataset.theme = settings.theme;

    root.classList.toggle(
        "dark",
        settings.theme === "dark"
    );

    root.classList.toggle(
        "compact",
        Boolean(settings.compactMode)
    );
}

export function initializeSettings() {
    const settings = getSettings();

    applySettings(settings);

    return settings;
}