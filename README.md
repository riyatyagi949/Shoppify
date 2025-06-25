# 🛍️ Shoppify — A MERN Stack E-Commerce Platform

Shoppify is a modern and responsive full-stack e-commerce application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It allows users to browse, search, and purchase products while enabling the admin to manage inventory, orders, and users from a dedicated admin dashboard.

---

## 🚀 Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Admin Dashboard:** Role-based access with secure endpoints

---

## 📁 Folder Structure

Shoppify/
├── client/ # React frontend
├── admin/ # Admin panel
├── server/ # Backend - Node.js + Express
├── .gitignore
├── README.md
└── package.json

---

## ⚙️ Setup Instructions

### 📦 Prerequisites

- Node.js & npm installed
- 
- MongoDB running locally or MongoDB Atlas URI

---

### 🔧 Clone the Repository

git clone https://github.com/riyatyag/Shoppify.git

cd Shoppify

🧩 Install Dependencies

# For Frontend

cd client

npm install


# For Admin Panel

cd admin

npm install


# For Backend

cd server

npm install


# ⚙️ Environment Setup

Create a .env file inside the server folder and add the following:

env

PORT=4001

MONGO_URI=your_mongo_connection_string

JWT_SECRET=your_jwt_secret_key

🏁 Running the Project

# ➤ Start Frontend (React)

cd client

npm start

Runs on http://localhost:3000

# ➤ Start Admin Panel

cd admin

npm run dev

Runs on http://localhost:5173 or your configured Vite port

# ➤ Start Backend (Express)

cd server

nodemon index.js

Runs on http://localhost:4001

# 🔐 Features
🛒 Product listing with filters

🧾 Cart and checkout functionality

🧍 User registration and authentication

🧑‍💼 Admin panel for product and order management

📦 Order tracking and status updates

📊 Dashboard analytics (optional)


⭐ Show Some Love
If you found this project helpful or inspiring, please ⭐ star this repo and share it! Your support means a lot. 😊








