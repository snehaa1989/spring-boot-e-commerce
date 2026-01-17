# E-commerce Frontend

Angular frontend for the e-commerce application with JWT authentication and Material Design.

## Features

- JWT-based authentication
- Role-based authorization (USER, ADMIN)
- Product browsing and search
- Category management
- Order management
- Responsive Material Design UI
- Role-based routing guards

## Prerequisites

- Node.js 16+
- Angular CLI 17+

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   ng serve
   ```

The application will be available at `http://localhost:4200`

## Configuration

The frontend is configured to connect to the backend at `http://localhost:8080`. 
Make sure the backend is running before starting the frontend.

## Available Routes

- `/` - Products page (default)
- `/login` - User login
- `/register` - User registration
- `/products` - Product listing
- `/categories` - Category listing
- `/orders` - User orders (requires authentication)

## Features

### Authentication
- User registration and login
- JWT token management
- Automatic logout on token expiration
- Role-based access control

### Products
- Browse all products
- Search products by name
- Filter by category
- View product details

### Orders
- View order history
- Track order status
- Order management for admins

### Categories
- Browse product categories
- Category management for admins

## Development

The application uses:
- Angular 17
- Angular Material for UI components
- RxJS for reactive programming
- CSS for styling

## Build

To build for production:
```bash
ng build --configuration production
```

The build artifacts will be stored in the `dist/` directory.
