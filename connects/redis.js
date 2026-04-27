const { createClient } = require("redis");

const client = createClient();

client.on("error", (err) => {
    console.log("Redis error:", err);
});

async function connectRedis() {
    await client.connect();
    console.log("Redis connected");
}

module.exports = { client, connectRedis };