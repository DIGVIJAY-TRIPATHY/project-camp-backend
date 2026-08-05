import express from "express";
import cors from "cors";

const app = express();

app.use(
    express.json({
        limit: "16kb",
    }),
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    }),
);

app.use(express.static("public"));




import healthcheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";


app.use("/api/v1/healthcheck",healthcheckRouter)
app.use("/api/v1/auth",authRouter)

app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.get("/", (req, res) => {
    res.send("hello");
});

export default app;
