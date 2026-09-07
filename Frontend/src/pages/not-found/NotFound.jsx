function NotFound() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                fontFamily: "Arial, sans-serif",
                background: "#f5f7fb",
                color: "#111827",
            }}
        >
            <h1 style={{ fontSize: "72px", margin: 0 }}>404</h1>

            <h2 style={{ margin: "10px 0" }}>
                Page Not Found
            </h2>

            <p style={{ color: "#6b7280" }}>
                The page you are looking for doesn't exist.
            </p>
        </div>
    );
}

export default NotFound;