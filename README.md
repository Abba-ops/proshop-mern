# ProShop E-commerce Platform

## Overview

ProShop is a full-stack e-commerce platform developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It serves as a comprehensive example project for those learning to build scalable and feature-rich web applications. The platform includes essential e-commerce functionalities, such as user authentication, product listing, shopping cart management, and order processing.

## Technologies Used

### Frontend:
- React.js
- React Router for navigation
- Redux for state management
- Bootstrap for responsive UI design

### Backend:
- Node.js with Express.js for the server
- MongoDB as the database using Mongoose for ODM
- JSON Web Token (JWT) for user authentication
- Bcrypt for password hashing

## Features

### User Authentication:
- Secure user registration and login
- JWT-based authentication for protected routes

### Product Management:
- Dynamic product listing with details and images
  ![Product Image 1](https://i.ibb.co/SNx8Yst/Screenshot-7.png)
  ![Product Image 2](https://i.ibb.co/VTS5Js2/Screenshot-5.png)
  ![Product Image 3](https://i.ibb.co/JcF9hzR/Screenshot-6.png)
- Product pagination and search functionality

### Shopping Cart:
- Add/remove products to/from the cart
- Update quantity and view the total price

### Order Processing:
- Checkout process with shipping information
- View and manage order history

## Getting Started

To run the ProShop project locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone [repository_url]
    ```

2. **Navigate to the project directory:**
    ```bash
    cd proshop
    ```

3. **Install dependencies for the server:**
    ```bash
    npm install
    ```

4. **Install dependencies for the client:**
    ```bash
    cd client
    npm install
    ```

5. **Create a `.env` file in the root of the `proshop` directory based on the provided `.env.example` file. Update the values with your own configuration.**

6. **Return to the root of the `proshop` directory:**
    ```bash
    cd ..
    ```

7. **Run the development server:**
    ```bash
    npm run dev
    ```

8. **Open the application in your browser:**
    ```
    http://localhost:3000
    ```

Happy coding! 🚀
