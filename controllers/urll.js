const shortid = require("shortid");
const URL = require("../models/url");
const { z } = require("zod");

// ✅ Input validation schema
const urlSchema = z.object({
    url: z.string().url()
});

async function handleGenerateNewShortURL(req, res) {
    // ✅ validate request body
    const result = urlSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: "Invalid URL format" });
    }

    const body = result.data.url;

    const shortId = shortid();

    await URL.create({
        shortId: shortId,
        redirectURL: body,
        visitHistory: [],
        createdBy: req.user.id
    });

    return res.json({ id: shortId });
}

async function handlegetanalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

async function getMyURLs(req, res) {
    const userId = req.user.id;

    const urls = await URL.find({
        createdBy: userId
    });

    return res.json(urls);
}

module.exports = {
    handleGenerateNewShortURL,
    handlegetanalytics,
    getMyURLs
};