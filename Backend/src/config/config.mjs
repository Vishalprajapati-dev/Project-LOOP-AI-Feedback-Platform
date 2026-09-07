import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
    "MONGO_URI",
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(
            `${key} is not defined in environment variables`
        );
    }
}

export const config = {
    mongoURI: process.env.MONGO_URI,

    port: process.env.PORT || 3000,

    jwtSecret: process.env.JWT_SECRET,

    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,

    frontendUrl:
        process.env.FRONTEND_URL ||
        "http://localhost:5173",

    accessTokenExpiry: "15m",

    refreshTokenExpiry: "7d",
};