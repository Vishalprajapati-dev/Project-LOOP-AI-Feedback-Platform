import { useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes/AppRoutes";

function App() {
    useEffect(() => {
        const savedTheme = localStorage.getItem("projectLoop_theme") || "system";

        const applyTheme = (theme) => {
            const root = document.documentElement;

            if (theme === "dark") {
                root.setAttribute("data-theme", "dark");
            } else if (theme === "light") {
                root.setAttribute("data-theme", "light");
            } else {
                const prefersDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;

                root.setAttribute(
                    "data-theme",
                    prefersDark ? "dark" : "light"
                );
            }
        };

        applyTheme(savedTheme);
    }, []);

    return (
        <MainLayout>
            <AppRoutes />
        </MainLayout>
    );
}

export default App;