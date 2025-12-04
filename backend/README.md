# 🧾 Hindustan Bills Backend

![Node.js](https://img.shields.io/badge/Node.js-v22.20.0-green)
![Express](https://img.shields.io/badge/Express-5.1.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19.0-brightgreen)
![License](https://img.shields.io/badge/License-ISC-lightgrey)

Backend API for **Hindustan Bills**, a smart retail checkout and billing system that allows customers to scan barcodes, add products to a virtual cart, pay online, and skip long billing queues.  
Built with **Node.js**, **Express**, and **MongoDB**.

---

## 🚀 Features

- 🔐 **User Authentication** – Register, Login (JWT-based)
- 👥 **Role-Based Access Control** – Customer, Retailer, Admin
- 📦 **Product Management** – Add, Update, List, and Delete products (Retailers/Admin only)
- 🧾 **Cart Management** – Add to cart, update quantity, remove items
- 💳 **Order Management** – Place order from cart, track order history
- 💰 **Mock Payment Integration** – Simulates successful/failed payments
- 📄 **Invoice PDF Generation** – (Coming soon)
- 📸 **Barcode Verification** – Validate scanned product barcodes
- ⚙️ **RESTful API Endpoints**
- ☁️ **MongoDB Atlas Support**

---

## 🧰 Technologies Used

- **Backend Framework:** Node.js (Express.js)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs, dotenv, cors
- **Dev Tools:** Nodemon, Postman

---

## 📂 Folder Structure
hindustan-bills-backend/
│
├── src/
│ ├── controllers/ # Business logic (auth, product, cart, order, payment)
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Route definitions
│ ├── middleware/ # Auth middleware (verifyToken, authorizeRoles)
│ ├── utils/ # Helpers (e.g. invoice generator)
│ ├── app.js # Express app setup
│ └── server.js # Server entry point
│
├── .env # Environment variables (ignored)
├── .env.example # Example of env file
├── package.json
└── README.md

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sidhansu10/HindustanBillsBackend.git
cd HindustanBillsBackend

```
---


### 2️⃣ Install Dependencies
npm install

---

### 3️⃣ Configure Environment Variables
Create a .env file in the project root:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

Or copy from the example:

cp .env.example .env

---

### 4️⃣ Run the Server
npm run dev


The server will start at:

http://localhost:5000

---

🧪 API Endpoints
Base URL → http://localhost:5000/api

👤 Auth
Method--Endpoint---Description
POST--/auth/register---Register a new user
POST--/auth/login---Login and get JWT token

📦 Products
Method--Endpoint---Role----Description
POST--/products/add---Retailer/Admin----Add new product
GET--/products---All----Get all products
GET--/barcode/:code---All----Verify barcode

🛒 Cart
Method--Endpoint---Description
POST--/cart/add---Add item to cart
PUT--/cart/update---Update item quantity
POST--/cart/remove---Remove item
GET--/cart---View current cart

🧾 Orders
Method--Endpoint---Description
POST--/orders/place---Place order from cart
GET--/orders---Get all user orders
PUT--/orders/status/:id---Update order status (Retailer/Admin)

💳 Payments
Method--Endpoint---Description
POST--/payments/mock---Simulate payment success/failure

🧠 Roles & Permissions
Role--Permissions
Customer--Can view/add products, manage cart, place & pay for orders
Retailer--Can manage products, update order statuses
Admin--Full access to all endpoints and user management (future scope)


📈 Future Enhancements
✅ PDF Invoice generation after payment
✅ Real Payment Gateway (Razorpay / Stripe)
✅ Order analytics dashboard
✅ QR-based checkout & verification
✅ Email/SMS invoice delivery
✅ Store-level analytics for retailers

💡 Project Info
Developer: Sidhansu
Project: Hindustan Bills
Frontend: Being developed by Priyanshu
Backend: Node.js + Express + MongoDB

🪪 License
This project is licensed under the ISC License.

---


🧩 .env.example
# ===============================
# 🌍 Server Configuration
# ===============================
PORT=5000
NODE_ENV=development

# ===============================
# 🔐 JWT Configuration
# ===============================
JWT_SECRET=your_jwt_secret_key

# ===============================
# 💾 MongoDB Configuration
# ===============================
MONGO_URI=your_mongodb_connection_string

# Example for local MongoDB:
# MONGO_URI=mongodb://127.0.0.1:27017/hindustanbills

# ===============================
# 💳 Mock Payment Settings (Optional)
# ===============================
PAYMENT_MODE=mock

---

🔥 Postman Collection (Hindustan Bills API)

Here’s a ready-to-import JSON file (save it as HindustanBills.postman_collection.json):
{
  "info": {
    "_postman_id": "a47e91c2-2199-4cfa-88f9-9bfbf8cb64b2",
    "name": "Hindustan Bills Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth - Register",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"123456\",\n  \"role\": \"customer\"\n}"
        },
        "url": { "raw": "http://localhost:5000/api/auth/register", "protocol": "http", "host": ["localhost"], "port": "5000", "path": ["api", "auth", "register"] }
      }
    },
    {
      "name": "Auth - Login",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"123456\"\n}"
        },
        "url": { "raw": "http://localhost:5000/api/auth/login", "protocol": "http", "host": ["localhost"], "port": "5000", "path": ["api", "auth", "login"] }
      }
    },
    {
      "name": "Products - Add",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" },
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Milk 1L\",\n  \"price\": 50,\n  \"barcode\": \"1234567890123\"\n}"
        },
        "url": { "raw": "http://localhost:5000/api/products/add", "protocol": "http", "host": ["localhost"], "port": "5000", "path": ["api", "products", "add"] }
      }
    },
    {
      "name": "Cart - Add Item",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" },
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"productId\": \"<product_id>\",\n  \"quantity\": 2\n}"
        },
        "url": { "raw": "http://localhost:5000/api/cart/add", "protocol": "http", "host": ["localhost"], "port": "5000", "path": ["api", "cart", "add"] }
      }
    },
    {
      "name": "Order - Place",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" },
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "url": { "raw": "http://localhost:5000/api/orders/place", "protocol": "http", "host": ["localhost"], "port": "5000", "path": ["api", "orders", "place"] }
      }
    },
    {
      "name": "Payment - Mock",
      "request": {
        "method": "POST",
        "header": [
          { "key": "Content-Type", "value": "application/json" },
          { "key": "Authorization", "value": "Bearer {{token}}" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"orderId\": \"<order_id>\",\n  \"success\": true\n}"
        },
        "url": { "raw": "http://localhost:5000/api/payments/mock", "protocol": "http", "host": ["localhost"], "port": "5000", "path": ["api", "payments", "mock"] }
      }
    }
  ]
}

💡How to Use

# Save this file as HindustanBills.postman_collection.json.
# Open Postman → Click Import → Upload this JSON file.
# After logging in, copy your JWT token → set it as a global variable:
# Go to Postman → Environment → Add Variable → token
# You can now test all routes quickly:
-> Register/Login
-> Add Products
-> Add to Cart
-> Place Order
-> Make Payment
