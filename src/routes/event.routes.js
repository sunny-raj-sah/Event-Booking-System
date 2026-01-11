const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const controller = require("../controllers/event.controller");

// Organizer routes
router.post(
  "/events",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  controller.createEvent
);

router.put(
  "/events/:id",
  authMiddleware,
  roleMiddleware(["ORGANIZER"]),
  controller.updateEvent
);

// Customer routes
router.get(
  "/events",
  authMiddleware,
  roleMiddleware(["CUSTOMER"]),
  controller.getEvents
);

router.post(
  "/events/:id/book",
  authMiddleware,
  roleMiddleware(["CUSTOMER"]),
  controller.bookEvent
);

router.delete(
  "/bookings/:id",
  authMiddleware,
  roleMiddleware(["CUSTOMER"]),
  controller.cancelBooking
);

module.exports = router;
