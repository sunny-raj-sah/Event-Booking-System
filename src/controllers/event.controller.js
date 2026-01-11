const { events, bookings } = require("../data/store");
const bookingEmitter = require("../events/booking.emitter");

const {
  sendBookingConfirmation,
  notifyEventUpdate,
} = require("../jobs/background.jobs");

// Organizer: Create Event
exports.createEvent = (req, res) => {
  const { title, date, availableTickets } = req.body;

  if (!title || !date || !availableTickets) {
    return res.status(400).json({ error: "All fields required" });
  }

  const event = {
    id: events.length + 1,
    title,
    date,
    availableTickets,
  };

  events.push(event);
  res.status(201).json(event);
};

// Organizer: Update Event
exports.updateEvent = (req, res) => {
  const event = events.find((e) => e.id === Number(req.params.id));

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  Object.assign(event, req.body);
  notifyEventUpdate(event.id);

  res.json({ message: "Event updated", event });
};

// Customer: View Events
exports.getEvents = (req, res) => {
  res.json(events);
};

// Customer: Book Event
exports.bookEvent = (req, res) => {
  const event = events.find((e) => e.id === Number(req.params.id));

  if (!event || event.availableTickets <= 0) {
    return res.status(400).json({ error: "Booking failed" });
  }

  event.availableTickets--;

  const booking = {
    id: bookings.length + 1,
    eventId: event.id,
    customerId: req.user.id,
  };

  bookings.push(booking);
  bookingEmitter.emit("booking.created", booking);

  sendBookingConfirmation(booking);

  res.status(201).json({
    message: "Booking successful",
    booking,
  });
};

exports.cancelBooking = (req, res) => {
  const bookingIndex = bookings.findIndex(
    (b) => b.id === Number(req.params.id)
  );

  if (bookingIndex === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const booking = bookings[bookingIndex];
  bookings.splice(bookingIndex, 1);

  bookingEmitter.emit("booking.cancelled", booking);

  res.json({ message: "Booking cancelled" });
};
