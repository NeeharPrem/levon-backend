# API Documentation

## 1. Product (CRUD operations)

### Create a New Product

- **POST** `/api/products`

- **Request Body**:

  ```json
  {
    "name": "product name",
    "price": 10000
  }
  ```

- **Responses**:
  - **201 Created**: Product added successfully with product data.
  - **400 Bad Request**: Invalid input data.

### Retrieve All Products

- **GET** `/api/products`

- **Responses**:
  - **200 OK**: Array of product objects.
  - **500 Internal Server Error**: Internal server Error.

### Retrieve a Single Product by ID

- **GET** `/api/products/:id`

- **Parameters**:
  - `id` (required): The ID of the product to retrieve.

- **Responses**:
  - **200 OK**: Product object.
  - **404 Not Found**: Product with the specified ID does not exist.
  - **500 Internal Server Error**: An error occurred on the server.

### Update a Product by ID

- **PUT** `/api/products/:id`

- **Parameters**:
  - `id` (required): The ID of the product to update.

- **Request Body**:

  ```json
  {
    "name": "updated product name",
    "price": 12345
  }
  ```

- **Responses**:
  - **200 OK**: Product updated successfully, product data.
  - **400 Bad Request**: Invalid input data.
  - **404 Not Found**: Product not found.
  - **500 Internal Server Error**: Internal Server Error.

### Delete a Product by ID

- **DELETE** `/api/products/:id`

- **Parameters**:
  - `id` (required): The ID of the product to delete.

- **Responses**:
  - **200 OK**: Product deleted successfully.
  - **404 Not Found**: Product not found.
  - **500 Internal Server Error**: Internal Server Error.

## 2. User Authentication

### Register a New User

- **POST** `/api/auth/register`

- **Request Body**:

  ```json
  {
    "name": "username",
     "email":"user email",
    "password": "password"
  }
  ```

- **Responses**:
  - **201 Created**: Account created successfully.
  - **400 Bad Request**: Invalid input data or user already exists.

### Login and Receive JWT

- **POST** `/api/auth/login`

- **Request Body**:

  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```

- **Responses**:
  - **200 OK**: Logged in successfully and userJWT returned.
  - **401 Unauthorized**: Invalid username or password.

## 3. Protected Routes

### Get User Profile (Protected Route)

- **GET** `/api/users/profile`

- useJWT is passed as cookie

- **Responses**:
  - **200 OK**: User profile data.
  - **401 Unauthorized**: Unauthorized.

## 4. Weather Data Fetching

- **GET** `/api/weather/:place`

- **Responses**:
  - **200 OK**: Current weather data.
  - **500 Internal Server Error**: Internal Server Error.