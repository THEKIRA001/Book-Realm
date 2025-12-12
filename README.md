# 📚 Book Realm - Full Stack E-Commerce Application

Book Realm is a robust, full-stack e-commerce platform designed for browsing and purchasing technical books. Built with **Modern Angular (v17+)** and **Node.js**, it leverages the latest web development standards including **Angular Signals**, **Standalone Components**, and a custom **TypeScript Backend**.

## 🚀 Features

### Frontend (Client)
* **Modern State Management:** Powered entirely by **NgRx Signal Store** for reactive, predictable state updates without boilerplate.
* **Dynamic Inventory:** Real-time stock checking. Users cannot add more items than available in the backend.
* **Toast Notifications:** Custom-built global notification system for feedback (e.g., "Out of Stock", "Login Required").
* **Shopping Cart:** Persistent cart state using `localStorage`.
* **User Authentication:** Secure Login and Registration with JWT handling.
* **Order History:** Users can view past orders with detailed breakdowns.
* **Responsive Design:** Fully responsive UI built with SCSS and CSS Variables.

### Backend (Server)
* **REST API:** Built with Express.js and TypeScript.
* **JSON-Based Database:** Custom file-system database (no external DB setup required) for Users, Books, and Orders.
* **Security:**
    * **JWT Authentication:** Protected routes using middleware.
    * **Password Hashing:** Secure storage using `bcryptjs`.
* **Inventory Logic:** Server-side validation to prevent overselling stock.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** Angular 17
* **Language:** TypeScript
* **State Management:** @ngrx/signals
* **Styling:** SCSS
* **Routing:** Angular Router (w/ Guards & Interceptors)

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** Local JSON Storage (File System)
* **Auth:** JSON Web Tokens (JWT)

---

## ⚙️ Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm**

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/book-realm.git](https://github.com/your-username/book-realm.git)
cd book-realm 
```

### 2. Backend Setup
Create a .env file in the backend/ directory
``` Code snippet
PORT=3000
JWT_SECRET=super-secret-key
```

bash command
```
cd backend

# Install dependencies
npm install

# Start the server (Development mode with nodemon)
npm run dev
```

### 3. Frontend Setup
bash command
```
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Start the Angular application
npm start
```

### 4. Access the App
Open your browser and navigate to: http://localhost:4200


---


## 📂 Project Structure

<img width="729" height="604" alt="image" src="https://github.com/user-attachments/assets/53ec296d-8720-49eb-b406-af602d2d8ca5" />


---


## 🧪 Key Functionalities to Try
* **Register & Login**: Create a new account.
* **Browse**: View the paginated list of books.
* **Manage Cart**: Add items. Try adding more than the available quantity (e.g., >100) to see the Toast Error.
* **Checkout**: Proceed to checkout. If not logged in, you will be redirected with a notification.
* **Profile**: Check your order history in the "My Orders" section.


---


## 🔄 Application Workflow

1.  **Authentication**
    * Users **Register** or **Login** via the frontend.
    * The backend verifies credentials and issues a **JSON Web Token (JWT)**.
    * The token is stored in the frontend state to authenticate future requests.

2.  **Browsing & Inventory**
    * The application fetches the book catalog from the backend (`books.json`).
    * **Frontend Logic:** Books with `0` quantity are automatically filtered out from the browse view.

3.  **Shopping Cart**
    * Users add books to their cart, which persists in local storage.
    * **Validation:** The UI prevents users from adding more items than currently available in stock.
    * Unauthenticated users can build a cart but are redirected to login upon checkout.

4.  **Order Processing**
    * When a user places an order, a secure API request is sent with the JWT.
    * **Backend Logic:**
        1.  Verifies the user identity.
        2.  Re-checks stock availability on the server side.
        3.  **Deducts** the sold quantity from the global inventory file.
        4.  Records the transaction in `orders.json`.

5.  **State Synchronization**
    * Upon success, the frontend clears the cart.
    * The **Books Store** automatically reloads to reflect the new, lower stock levels immediately.
    * The user is redirected to their **Order History** to view the purchase details.