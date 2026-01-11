🎟️ Event Booking System – Backend API

A Node.js + Express backend for an Event Booking System supporting role-based access control, event management, ticket booking, background async tasks, and event logging.

This project is designed as a machine test / interview-ready backend assignment, focusing on clean architecture, clarity, and correctness rather than heavy dependencies.

🚀 Features
👥 User Roles
Event Organizer

Create events

Update events

Customer

View available events

Book tickets

Cancel bookings

🔐 Role-Based Access Control (RBAC)

Implemented using Express middleware

Access is granted based on the user role

Unauthorized access is blocked with proper HTTP status codes

⚙️ Background Tasks (Async Processing)
1️⃣ Booking Confirmation

Triggered when a customer successfully books a ticket

Simulates sending a confirmation email

Implemented using async execution (setImmediate)

Console output:

📧 Booking confirmation email sent for booking <bookingId>

2️⃣ Event Update Notification

Triggered when an organizer updates an event

Notifies all customers who booked tickets for that event

Console output:

🔔 Event update notification sent to customer <customerId>

📒 Event Logging (EventEmitter)

Uses Node.js EventEmitter

Tracks booking creation and cancellation

Logs are stored in JSON Lines format

Example log entry:

{"event":"booking.created","timestamp":"2026-01-11T05:30:22.123Z","data":{"id":1,"eventId":1,"customerId":2}}

🛠️ Tech Stack

Node.js

Express.js

In-memory data store (no database)

EventEmitter for event tracking

Async background jobs using setImmediate

Note: In-memory storage is intentionally used to keep the solution simple, fast, and exam-friendly.

📁 Project Structure
event-booking-system/
│
├── src/
│ ├── app.js
│ ├── server.js
│
│ ├── routes/
│ │ └── event.routes.js
│
│ ├── controllers/
│ │ └── event.controller.js
│
│ ├── middleware/
│ │ ├── auth.middleware.js
│ │ └── role.middleware.js
│
│ ├── jobs/
│ │ └── background.jobs.js
│
│ ├── events/
│ │ └── event.emitter.js
│
│ ├── logs/
│ │ └── events.log.jsonl
│
│ └── data/
│ └── store.js
│
├── package.json
└── README.md

⚙️ Setup & Installation
1️⃣ Clone the Repository
git clone <repository-url>
cd event-booking-system

2️⃣ Install Dependencies
npm install

3️⃣ Start the Server
node src/server.js

Server runs at:

http://localhost:3000

🔐 Authentication Strategy (Simple & Test-Friendly)

Authentication is simulated using a request header:

user-id: <number>

Predefined Users
user-id Role
1 ORGANIZER
2 CUSTOMER
3 CUSTOMER
🌐 API Base URL
http://localhost:3000/api

📌 API Endpoints
🧑‍💼 Organizer APIs
Create Event
POST /api/events

Update Event
PUT /api/events/:id

Triggers Event Update Notification background task.

👤 Customer APIs
View Events
GET /api/events

Book Event
POST /api/events/:id/book

Triggers Booking Confirmation background task.

Cancel Booking
DELETE /api/bookings/:id

Triggers booking cancellation event logging.

🧪 API Test Cases (Postman / Manual Testing)

All test cases should be executed in sequence.

Test Case 1: Create Event (Organizer)

Request

POST /api/events
Headers:
user-id: 1

Body

{
"title": "Tech Conference 2026",
"date": "2026-02-15",
"availableTickets": 3
}

Expected Result

201 Created

Event stored successfully

Test Case 2: Customer Tries to Create Event (Forbidden)
POST /api/events
Headers:
user-id: 2

Expected Result

403 Forbidden

Access denied

Test Case 3: Customer Views Events
GET /api/events
Headers:
user-id: 2

Expected Result

List of available events

Test Case 4: Customer Books Ticket
POST /api/events/1/book
Headers:
user-id: 2

Expected Result

201 Created

Tickets reduced

Console log:

📧 Booking confirmation email sent for booking 1

Test Case 5: Another Customer Books Ticket
POST /api/events/1/book
Headers:
user-id: 3

Expected Result

Booking successful

Console log:

📧 Booking confirmation email sent for booking 2

Test Case 6: Organizer Updates Event
PUT /api/events/1
Headers:
user-id: 1

Expected Console Output

🔔 Event update notification sent to customer 2
🔔 Event update notification sent to customer 3

Test Case 7: Booking When Tickets Are Sold Out
POST /api/events/1/book

Expected Result

400 Bad Request

Booking failed

Test Case 8: Missing user-id Header
GET /api/events

Expected Result

401 Unauthorized

Test Case 9: Verify Event Logs

File

logs/events.log.jsonl

Expected Entries

{"event":"booking.created","timestamp":"...","data":{"id":1,"eventId":1,"customerId":2}}
{"event":"booking.cancelled","timestamp":"...","data":{"id":1,"eventId":1,"customerId":2}}

🧠 Design Decisions

No database → faster setup, exam-friendly

Middleware-based RBAC → clean separation of concerns

EventEmitter → lightweight async event tracking

JSON log format → easy to audit and debug

Modular structure → scalable and readable

🏆 Suitable For

Backend machine tests

Node.js / Express interviews

System design walkthroughs (basic)

Academic / training assignments

🔮 Possible Enhancements

Replace in-memory store with MongoDB

Add JWT-based authentication

Use BullMQ / Redis for background jobs

Add automated tests using Jest + Supertest

Add pagination & validation
