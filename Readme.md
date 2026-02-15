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

Step 1: Start Your Server

Before testing anything in Postman:

Open your terminal

Go to your project folder

Run:

node src/server.js

Make sure it prints something like:

Server running on http://localhost:3000

Leave the terminal open — this will show background task logs like booking confirmations and notifications.

Step 2: Open Postman

Download Postman if you don’t have it.

Open it and create a new collection (optional but recommended):

Name: Event Booking System

Step 3: Set Environment Variables (Optional but easier)

Go to Environments → Create New

Add variables:

Key Value Description
baseUrl http://localhost:3000/api
Base URL of API
organizerId 1 Predefined Organizer user-id
customer1 2 Predefined Customer user-id
customer2 3 Another Customer user-id

This lets you use {{baseUrl}} in all requests instead of typing the URL every time.

Step 4: Test Health Check (No Role Needed)

Method: GET

URL: http://localhost:3000/ (or {{baseUrl}} if using variable)

Headers: none

Send request → Response should be:

{ "message": "Event Booking API running" }

✅ This ensures your server is working.

Step 5: Organizer Creates Event (Allowed)

Method: POST

URL: {{baseUrl}}/events

Headers:

Key Value
user-id 1 (or {{organizerId}})
Content-Type application/json

Body → raw JSON:

{
"title": "Tech Conference 2026",
"date": "2026-02-15",
"availableTickets": 3
}

Send request → Expected response:

{
"id": 1,
"title": "Tech Conference 2026",
"date": "2026-02-15",
"availableTickets": 3
}

✅ Organizer can create events.

Step 6: Customer Tries to Create Event (Forbidden)

Method: POST

URL: {{baseUrl}}/events

Headers:

Key Value
user-id 2 (or {{customer1}})
Content-Type application/json

Body → raw JSON:

{
"title": "Unauthorized Event",
"date": "2026-02-20",
"availableTickets": 5
}

Send request → Expected response:

{ "error": "Access denied" }

✅ Customer cannot create events.

Step 7: Customer Views Events (Allowed)

Method: GET

URL: {{baseUrl}}/events

Headers:

Key Value
user-id 2 (or {{customer1}})

Send request → Expected response: Array of events

[
{
"id": 1,
"title": "Tech Conference 2026",
"date": "2026-02-15",
"availableTickets": 3
}
]

✅ Customer can view events.

Step 8: Customer Books Ticket (Allowed)

Method: POST

URL: {{baseUrl}}/events/1/book

Headers:

Key Value
user-id 2 (or {{customer1}})
Content-Type application/json

Body: none (booking uses event ID and user-id)

Send request → Expected response:

{
"message": "Booking successful",
"booking": { "id": 1, "eventId": 1, "customerId": 2 }
}

Check server console → should see:

📧 Booking confirmation email sent for booking 1

✅ Customer successfully booked a ticket.

Step 9: Organizer Tries to Book Ticket (Forbidden)

Method: POST

URL: {{baseUrl}}/events/1/book

Headers:

Key Value
user-id 1 (Organizer)
Content-Type application/json

Send request → Expected response:

{ "error": "Access denied" }

✅ Organizer cannot book tickets.

Step 10: Customer Cancels Booking (Allowed)

Method: DELETE

URL: {{baseUrl}}/bookings/1

Headers:

Key Value
user-id 2 (or {{customer1}})

Send request → Expected response:

{ "message": "Booking cancelled" }

Check server console → should see booking cancelled event logged (if using EventEmitter)

✅ Customer can cancel their booking.

Step 11: Organizer Tries to Cancel Booking (Forbidden)

Method: DELETE

URL: {{baseUrl}}/bookings/1

Headers:

Key Value
user-id 1 (Organizer)

Send request → Expected response:

{ "error": "Access denied" }

✅ Organizer cannot cancel bookings.

Step 12: Test Missing user-id Header

Method: GET

URL: {{baseUrl}}/events

Headers: None

Send request → Expected response:

{ "error": "Unauthorized" }

✅ This ensures authentication is required.

Step 13: Background Task Verification (Console Logs)

Booking confirmation: when a customer books a ticket → console logs:

📧 Booking confirmation email sent for booking <id>

Test Case: Verify Event Logs

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
