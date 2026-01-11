const express = require("express");
const eventRoutes = require("./routes/event.routes");

const app = express();

app.use(express.json());

// Routes
app.use("/api", eventRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Event Booking API running" });
});

module.exports = app;
