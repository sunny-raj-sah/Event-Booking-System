const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

class BookingEmitter extends EventEmitter {}

const bookingEmitter = new BookingEmitter();

const logFilePath = path.join(__dirname, "../../logs/events.log.json");

// Ensure logs folder exists
fs.mkdirSync(path.dirname(logFilePath), { recursive: true });

// Generic JSON logger
const logEvent = (eventType, payload) => {
  const logEntry = {
    event: eventType,
    timestamp: new Date().toISOString(),
    data: payload,
  };

  fs.appendFile(logFilePath, JSON.stringify(logEntry) + "\n", (err) => {
    if (err) console.error("Log write failed", err);
  });

  console.log("📘 EVENT LOG:", logEntry);
};

// Event listeners
bookingEmitter.on("booking.created", (data) => {
  logEvent("booking.created", data);
});

bookingEmitter.on("booking.cancelled", (data) => {
  logEvent("booking.cancelled", data);
});

module.exports = bookingEmitter;
