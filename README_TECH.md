# RecipeNest Technology Stack

RecipeNest is a premium full-stack application built using a modern, scalable architecture. This document outlines the technologies used across the project and explains their specific roles.

## 🏗️ Architecture Overview
The project follows a decoupled **Client-Server** architecture:
- **Frontend**: A high-performance Single Page Application (SPA).
- **Backend**: A robust RESTful API following the Service-Controller pattern.
- **Database**: A flexible NoSQL document store.

---

## 🎨 Frontend Technologies

### Core Framework
*   **React (v19)**
    *   **Where**: Entire user interface.
    *   **How**: Component-based architecture for reusable UI elements (Cards, Navbars, Modals).
    *   **Why**: React provides a reactive, efficient way to manage complex UI states and provides a great developer experience with hooks like `useEffect` and `useState`.
*   **Vite (v8)**
    *   **Where**: Build tool and development server.
    *   **How**: Handles module bundling, Hot Module Replacement (HMR), and environment variable injection.
    *   **Why**: Significantly faster than older tools like Create React App, providing near-instant startup and rebuild times.

### Styling & UI
*   **Vanilla CSS3**
    *   **Where**: `global.css`, `admin.css`.
    *   **How**: CSS Variables (tokens) for colors, spacing, and typography. Modern layout techniques like Flexbox and Grid.
    *   **Why**: Chosen to provide maximum design flexibility and "pixel-perfect" control over the premium landing page aesthetics without the constraints of a utility-first framework.
*   **Lucide React**
    *   **Where**: Icons throughout the site (Search, ChefHat, Star, etc.).
    *   **How**: Used as React components.
    *   **Why**: A clean, consistent, and lightweight icon library that matches modern design trends.

### State & Routing
*   **React Router (v7)**
    *   **Where**: `App.jsx`.
    *   **How**: Declarative routing with support for dynamic parameters (`/recipes/:id`) and role-based route protection.
    *   **Why**: The industry standard for navigation in React SPAs.
*   **React Context API**
    *   **Where**: `AuthContext.jsx`.
    *   **How**: Provides user authentication status and profile data to all components in the tree.
    *   **Why**: Simplifies global state management without the complexity of Redux for authentication-heavy applications.

### Communication
*   **Axios**
    *   **Where**: `api.js` and service files.
    *   **How**: Configured with a base URL and interceptors to automatically attach JWT tokens to every request.
    *   **Why**: Offers a cleaner API than the native `fetch`, better error handling, and easy request/response interception.

---

## ⚙️ Backend Technologies

### Core Framework
*   **ASP.NET Core (v8.0)**
    *   **Where**: Entire API layer.
    *   **How**: Controllers handle HTTP requests, while Services contain the business logic.
    *   **Why**: A high-performance, enterprise-grade framework that is cross-platform and provides excellent support for dependency injection and security.

### Database
*   **MongoDB (Driver v3.8)**
    *   **Where**: Data persistence layer.
    *   **How**: Stores Recipes, Users, ChefProfiles, Reviews, and Categories as JSON-like documents.
    *   **Why**: Recipes often have varying structures (different numbers of ingredients/steps). MongoDB's schema-less nature makes it ideal for culinary data compared to rigid relational databases.

### Security & Auth
*   **JWT (JSON Web Tokens)**
    *   **Where**: `JwtHelper.cs`, `AuthController.cs`.
    *   **How**: Generates a signed token upon login which the client stores and sends in the `Authorization` header.
    *   **Why**: Allows for secure, stateless authentication, which is scalable and works across different domains.
*   **BCrypt.Net-Next**
    *   **Where**: `PasswordHelper.cs`.
    *   **How**: Salting and hashing user passwords before storage.
    *   **Why**: Provides industry-standard protection against brute-force and rainbow table attacks.

### Pattern & Logic
*   **DTOs (Data Transfer Objects)**
    *   **Where**: `DTOs/` directory.
    *   **How**: Maps internal models to specific objects for API responses (e.g., hiding password hashes).
    *   **Why**: Enhances security and prevents over-fetching by only sending necessary data to the client.
*   **Error Handling Middleware**
    *   **Where**: `ErrorHandlingMiddleware.cs`.
    *   **How**: A centralized try-catch block in the request pipeline that returns consistent JSON error responses.
    *   **Why**: Ensures that the API never leaks stack traces to the client and provides a unified error format.

---

## 🛠️ Tools & DevOps
*   **Environment Variables (`.env`)**: Manages sensitive configuration like the API base URL.
*   **CORS (Cross-Origin Resource Sharing)**: Configured in `Program.cs` to allow the Vite dev server (`port 5173`) to communicate with the API (`port 5174`).
*   **Git**: Used for version control.
