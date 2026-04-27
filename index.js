require("dotenv").config();


const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { connecttoMongoDB } = require("./connect");
const { connectRedis } = require("./connects/redis");

const urlRoute = require("./routes/urll");
const urlanalytics = require("./routes/analytics");
const authroute = require("./routes/authroute");

const URL = require("./models/url");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());

const limiter = rateLimit({
    windowMs: 10 * 1000, // 10 sec window
    max: 5,

    handler: (req, res) => {
        return res.status(429).json({
            message: "Too many requests",
            retryAfter: 10,
        });
    },
});

app.use(limiter);


app.use("/url", urlRoute);
app.use("/auth", authroute);
app.use("/", urlanalytics);


app.get("/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;

        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: {
                        timestamp: Date.now(),
                    },
                },
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).send("Short URL not found");
        }

        return res.redirect(entry.redirectURL);
    } catch (err) {
        console.error("Redirect Error:", err);
        return res.status(500).send("Server error");
    }
});

connecttoMongoDB(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB error:", err);
    });


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});