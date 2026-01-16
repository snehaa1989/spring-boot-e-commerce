# E-commerce Backend

Spring Boot backend for the e-commerce application with JWT authentication and MongoDB.

## Features

- JWT-based authentication
- Role-based authorization (USER, ADMIN)
- RESTful APIs for products, categories, and orders
- MongoDB integration
- CORS support

## Prerequisites

- Java 17+
- Maven 3.6+
- MongoDB

## Running the Application

1. Start MongoDB on localhost:27017
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- POST `/api/auth/signin` - User login
- POST `/api/auth/signup` - User registration

### Products
- GET `/api/products` - Get all products
- GET `/api/products/{id}` - Get product by ID
- GET `/api/products/category/{categoryId}` - Get products by category
- GET `/api/products/search?keyword={keyword}` - Search products
- POST `/api/products` - Create product (ADMIN only)
- PUT `/api/products/{id}` - Update product (ADMIN only)
- DELETE `/api/products/{id}` - Delete product (ADMIN only)

### Categories
- GET `/api/categories` - Get all categories
- GET `/api/categories/{id}` - Get category by ID
- POST `/api/categories` - Create category (ADMIN only)
- PUT `/api/categories/{id}` - Update category (ADMIN only)
- DELETE `/api/categories/{id}` - Delete category (ADMIN only)

### Orders
- GET `/api/orders` - Get all orders (ADMIN only)
- GET `/api/orders/my-orders` - Get current user's orders
- GET `/api/orders/{id}` - Get order by ID
- POST `/api/orders` - Create order
- PUT `/api/orders/{id}/status` - Update order status (ADMIN only)
- DELETE `/api/orders/{id}` - Delete order (ADMIN only)

## Default Data

The application automatically initializes:
- Roles: USER, ADMIN
- Categories: Electronics, Clothing, Books
- Sample products for each category
