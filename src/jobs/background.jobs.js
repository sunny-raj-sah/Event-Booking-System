const { bookings } = require("../data/store");

// Background Task 1
const sendBookingConfirmation = (booking) => {
  setImmediate(() => {
    console.log(`📧 Booking confirmation email sent for booking ${booking.id}`);
  });
};

// Background Task 2
const notifyEventUpdate = (eventId) => {
  setImmediate(() => {
    const relatedBookings = bookings.filter((b) => b.eventId === eventId);

    relatedBookings.forEach((b) => {
      console.log(
        `🔔 Event update notification sent to customer ${b.customerId}`
      );
    });
  });
};

module.exports = {
  sendBookingConfirmation,
  notifyEventUpdate,
};
