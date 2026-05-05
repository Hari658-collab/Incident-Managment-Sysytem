const express = require('express');
const pool = require("./postgres");
const cors = require("cors");
const connectRedis = require("./redisClient");

const app = express();
app.use(cors());
app.use(express.json());

let redisClient;

connectRedis().then((client) => {
  redisClient = client;
});

const { isValidTransition } = require("./utils/workflow");

// ✅ ADD YOUR GET ROUTE HERE ======================================================================
app.get("/work-items", async (req, res) => {
  try {
    console.log("📥 GET /work-items called");

    const result = await pool.query("SELECT * FROM work_items");

    res.json(result.rows);
  } catch (err) {
    console.error("🔥 GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

console.log("Starting server...");

//Import radis


//exisiting health API
app.get("/health", (req, res) => {
  res.send("Hello, I am harichandana and welcome to node.js");
});

//Adding POST API here============================================================================
app.post("/signals", async (req, res) => {
  try {
      console.log("BODY RECEIVED:", req.body); // 👈 DEBUG

      const signal = req.body;
       console.log("📥 Signal received:", signal);
    // push into queue
      await redisClient.lPush("signal_queue", JSON.stringify(signal));
       console.log("📤 Pushed to Redis queue");

       res.json({
      message: "Signal added to queue",
      data: req.body,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

console.log("Registering /incidents route...");

// ✅ Get all incidents=========================================================================
app.get("/incidents", async (req, res) => {
     console.log("GET /incidents called");
  try {
     const cached = await redisClient.get("dashboard");
      if (cached) {
      console.log("⚡ From cache");
      return res.json(JSON.parse(cached));
    }

     const result = await pool.query(
         "SELECT * FROM work_items ORDER BY id DESC"
);
     await redisClient.set("dashboard", JSON.stringify(result.rows));

    console.log("📦 From DB");

    res.json(result.rows);
  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get incident by ID=======================================================================
app.get("/incidents/:id", async (req, res) => {
    const { status, endTime } = req.body;
  const id = req.params.id;

  try {
    let mttr = null;

    if (status === "CLOSED") {

    const result = await pool.query(
      "SELECT * FROM work_items WHERE id = $1",
      [id]
    );
     const startTime = result.rows[0].created_at;

      const start = new Date(startTime);
      const end = new Date(endTime);

      mttr = (end - start) / 1000; // seconds
    }
      await pool.query(
      "UPDATE work_items SET status=$1, mttr=$2 WHERE id=$3",
      [status, mttr, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Updating Incident");
  }
});

 //✅ Update incident status=========================================================================
app.put("/incidents/:id/status", async (req, res) => {
  try {
    const id = req.params.id;
    // ✅ ADD THIS CHECK
    if (!req.body || Object.keys(req.body).length === 0) {
       return res.status(400).send("Request body missing. Use Body → raw → JSON in Postman.");
}
    const { status, rca } = req.body;

    // 🔍 Get current incident  =======================================================================
    const result = await pool.query(
      "SELECT * FROM work_items WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Incident not found");
    }

    const currentStatus = result.rows[0].status;

    // ❌ Invalid transition check
    if (!isValidTransition(currentStatus, status)) {
      return res.status(400).send("Invalid status transition");
    }

    // ❌ RCA validation
    if (status === "CLOSED" && !rca) {
      return res.status(400).send("RCA required before closing");
    }

     // 🔥 MTTR calculation
    let mttr = null;

    if (status === "CLOSED") {
      const startTime = result.rows[0].created_at;

      const start = new Date(startTime);
      const end = new Date(endTime);

      mttr = (end - start) / 1000;
    }


    // ✅ Update
    await pool.query(
  "UPDATE work_items SET status = $1, rca = $2 WHERE id = $3",
  [status, rca || null, id]
);

    res.send("Status updated successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

app.get("/test", (req, res) => {
  res.send("test route working");
});

//Server start
app.listen(3000, () => {
  console.log("Server running on port 3000");
});