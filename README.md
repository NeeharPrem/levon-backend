# Node.js and MongoDB Application

This application provides backend using Node.js and MongoDB, offering APIs for Integrating into differnt platforms.

## Table of Contents
1. [Setup Instructions](#setup-instructions)
2. [API Endpoints](#api-endpoints)
3. [Authentication and Authorization](#authentication-and-authorization)
4. [Data Fetching and Caching](#data-fetching-and-caching)
5. [Database Integration](#database-integration)
6. [Real-time Features](#real-time-features)
7. [Error Handling and Logging](#error-handling-and-logging)
8. [Cloud Deployment](#cloud-deployment)
9. [Additional Features](#additional-features)

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/NeeharPrem/levon-backend.git
   cd levon-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build :
   ```
   npx tsc
   ```

4. Set up the database:
   - Ensure MongoDB is installed and running on your system.

5. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=enter_a_jwt_secret
     ```

6. Start the application:
   ```
   npm run start
   ```

6. To run the application using pm2:
   ```
   npm install pm2 -g

   pm2 start dist/server.js
   ```

The server should now be running on `http://localhost:3000`.

## API Endpoints

1. Product Inventory (CRUD operations):
   - POST `/api/products` - Create a new product
   - GET `/api/products` - Retrieve all products
   - GET `/api/products/:id` - Retrieve a single product by ID
   - PUT `/api/products/:id` - Update a product by ID
   - DELETE `/api/products/:id` - Delete a product by ID

2. User Authentication:
   - POST `/api/auth/register` - Register a new user
   - POST `/api/auth/login` - Login and receive JWT

3. Protected Routes:
   - GET `/api/users/profile` - Get user profile (protected route)

4. External Data Fetching:
   - GET `/api/weather/:place` - Fetch weather data

## Authentication and Authorization

- JWT (JSON Web Tokens) are used for authentication.
- Protected routes require a valid JWT in the Authorization header.

## Data Fetching and Caching

- External API data is cached for better API performance.

## Database Integration

- MongoDB is used as the primary database.
- User informations stored in MongoDB.

## Real-time Features

- WebSocket is implemented using Socket.IO.
- Clients can connect to receive real-time notifications when a new product added.

## Error Handling and Logging

- Error handling middleware is implemented.
- Winston is used for logging errors.

## Cloud Deployment

- The application is deployed on AWS.
- Deployed BaseURL: https://13.233.120.219


## API Documentation

API documentation can be found in the `docs/api.md` file.

## Architecture Explanation
This Node.js application follows the MVC (Model-View-Controller) architecture. The controller manages the data flow between the model and the view. In this current implementation, there is no view component.