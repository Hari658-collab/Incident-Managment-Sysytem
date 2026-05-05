const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
  socket: {
    connectTimeout: 10000,
  },
});

client.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    console.log("✅ Redis connected");
  }
  return client;
}

module.exports = connectRedis;