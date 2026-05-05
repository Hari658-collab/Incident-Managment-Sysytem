console.log("🚨 WORKER FILE LOADED 🚨");

const Signal = require("./models/Signal");
const connectRedis = require("./redisClient");
const connectDB = require("./mongo");
const pool = require("./postgres");
const connectMongo = require("./mongo");



let counter = 0;

console.log("Worker started...");

async function startWorker() {
  const redisClient = await connectRedis();
  await connectDB();

  console.log("✅ Redis connected");

    await connectMongo();  
  console.log("✅ MongoDB connected");

  while (true) {
    const result = await redisClient.brPop("signal_queue", 0);

    const signal = JSON.parse(result.element);

    counter++;

    console.log("📦 Processing:", signal);

    if (signal.severity === "P0") {
      console.log("🚨 URGENT ALERT: Production Issue!");
    }

    await Signal.create({
      componentId: signal.componentId,
      severity: signal.severity,
      message: signal.message,
      receivedAt: new Date()
    });

    console.log("✅ Saved signal to MongoDB");

    const key = `component:${signal.componentId}`;

    const exists = await redisClient.get(key);

    const existing = await pool.query(
      "SELECT * FROM work_items WHERE component_id = $1 AND status != 'closed'",
      [signal.componentId]
    );

    if (!exists && existing.rows.length === 0) {
      console.log("🆕 Creating Work Item");

      const result = await pool.query(
        "INSERT INTO work_items (component_id, status, severity) VALUES ($1, $2, $3) RETURNING *",
        [signal.componentId, "open", signal.severity]
      );

      const workItemId = result.rows[0].id;

      console.log("✅ Work item created:", workItemId);

      await redisClient.set(key, workItemId.toString(), {
        EX: 10
      });
    } else {
      console.log("⏳ Skipping duplicate signal for:", signal.componentId);
    }
  }
}

setInterval(() => {
  console.log("Signals/sec:", counter);
  counter = 0;
}, 5000);

startWorker();