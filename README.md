Hotel Management System
This is a simple Hotel Management System built with Typescript, Node.js, Express.js, and MongoDB. The system allows users to manage rooms and room types, and provides authentication and authorization features for admin and guest users.

Prerequisites
Node.js (v12 or later)
MongoDB .


Dependencies
This API uses the following dependencies:
express
mongoose
dotenv
jsonwebtoken
joi
typescript
Environment variables
This API requires the following environment variables to be set

Installation
Clone the repository
bash

git clone https://github.com/vicky140/updated-version-of-hotel-management-system.git
Install dependencies
bash

cd hotel-management-system
npm install
Set environment variables
Create a .env file in the root directory of the project and add the following variables:

makefile

MONGODB_URI=mongodb://localhost/hotel
JWT_SECRET=mysecretkey
Replace mongodb://localhost/hotel with the URI for your MongoDB instance, and replace mysecretkey with a secret key of your choice.

Start the server
sql

npm start
The server will start listening on port 3000 by default. You can change the port by setting the PORT environment variable.

Usage
Authentication
The system uses JSON Web Tokens (JWT) for authentication. To obtain a token, send a POST request to the /auth/login endpoint with a JSON body containing the user's email and password:

bash

POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
If the email and password are valid, the server will respond with a JWT:


HTTP/1.1 200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6Imd1ZXN0IiwiaWF0IjoxNTE2MjM5MDIyfQ.H_x6wCg17QJF3HqI9X5J6ig5z6R5dB6YPztzV8nKLbg"
}
Include this token in the Authorization header of subsequent requests to authenticate as this user:

sql

GET /rooms
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6Imd1ZXN0IiwiaWF0IjoxNTE2MjM5MDIyfQ.H_x6wCg17QJF3HqI9X5J6ig5z6R5dB6YPztzV8nKLbg
Authorization
The system has two user roles: "admin" and "guest". Admin users can perform all actions, while guest users can only view rooms.

To require authentication and authorization for a route, use the verifyToken and verifyRole middleware functions:

javascript

const { verifyToken, verifyRole } = require("./middleware/auth");

// Require authentication for all routes
app.use(verifyToken);

// Require admin role for a route
app.post("/rooms", verifyRole("admin"), (req, res) => {
  // Create a new room
});

To view a list of all rooms, send
a GET request to the /api/rooms endpoint.

To add a new room, send a POST request to the same endpoint with the following data in the request body:


{
  "name": "Standard Room 1",
  "roomType": "<room type id>",
  "price": 150
}
<room type id> is the id of the room type to which the new room belongs. To get the list of room types and their ids, send a GET request to the /api/roomtypes endpoint.

To update an existing room, send a PUT request to /api/rooms/:id, where :id is the id of the room to be updated. Include the new data for the room in the request body, like this:


{
  "name": "Standard Room 1",
  "roomType": "<room type id>",
  "price": 150
}
To delete a room, send a DELETE request to /api/rooms/:id, where :id is the id of the room to be deleted.

Authentication and Authorization
Some endpoints in this API require authentication and/or authorization.

To register a new user, send a POST request to /api/users/register with the following data in the request body:

perl

{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password"
}
This will create a new user with the "guest" role.

To log in as a user, send a POST request to /api/users/login with the following data in the request body:

perl

{
  "email": "johndoe@example.com",
  "password": "password"
}
This will return a JSON web token (JWT), which you can use to authenticate future requests that require authentication.

To access a protected endpoint, include the JWT in the Authorization header of the request, like this:

makefile

Authorization: Bearer <jwt>
To access an endpoint that requires a specific role, include the Authorization header as above, and also ensure that the JWT payload includes a role field with the appropriate value ("admin" for admin-only endpoints).

Error handling
If an error occurs in the API, it will return a JSON response with a message field describing the error. For validation errors, the response will also include an errors field containing an array of error messages for each validation error.

For example, if you try to create a new room with invalid data, you might get a response like this:


{
  "message": "Validation error",
  "errors": [
    "name must be at least 3 characters",
    "price is required"
  ]
}
Dependencies
This API uses the following dependencies:

express
mongoose
dotenv
jsonwebtoken
joi
Environment variables
This API requires the following environment variables to be set:


POST /api/rooms: Create a new room. The request body should include the name, room type, and price of the room. This endpoint should be restricted to admin users only.
PUT /api/rooms/:roomId: Update an existing room. The request body should include the updated name, room type, and price of the room. This endpoint should be restricted to admin users only.
DELETE /api/rooms/:roomId: Delete an existing room. This endpoint should be restricted to admin users only.
GET /api/room-types: Retrieve a list of all room types.
POST /api/room-types: Create a new room type. The request body should include the name of the room type. This endpoint should be restricted to admin users only.
PUT /api/room-types/:roomTypeId: Update an existing room type. The request body should include the updated name of the room type. This endpoint should be restricted to admin users only.
DELETE /api/room-types/:roomTypeId: Delete an existing room type. This endpoint should be restricted to admin users only.
POST /api/bookings: Create a new booking. The request body should include the guest's name, email address, check-in date, check-out date, and the room ID of the room being booked. This endpoint should be available to all users.



