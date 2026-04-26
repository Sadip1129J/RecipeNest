# RecipeNest 🍳 — Full-Stack Chef Portal

RecipeNest is a premium, full-stack web application designed for chefs to showcase their culinary portfolios and for food lovers to discover exquisite recipes. Built with a modern ASP.NET Core backend and a React (Tailwind v4) frontend, the platform offers a seamless experience for browsing, saving, and reviewing world-class dishes.

---

## 🌟 Key Features

### 👨‍🍳 For Chefs
- **Professional Portfolio**: Showcase your bio, specialties, and location.
- **Recipe Management**: Create, edit, and delete recipes with a rich interface (ingredients, instructions, images).
- **Culinary Stats**: Track your performance with average ratings and recipe counts.
- **Secure Access**: Role-based authentication ensures only you can manage your creations.

### 🍴 For Food Lovers
- **Discover**: Browse recipes by category, search by title/ingredient, or explore trending dishes.
- **Personal Dashboard**: Save your favorite recipes to your personal collection.
- **Engage**: Rate and review recipes with a star system and detailed comments.
- **Connect**: Visit public chef profiles to learn about the creators behind the food.

### 🛡️ For Administrators
- **Global Overview**: Platform-wide statistics on users, recipes, and engagement.
- **Content Moderation**: Manage any recipe, category, or user account.
- **System Control**: Add/remove categories to keep the platform organized.

---

## 🛠️ Technology Stack

### **Backend (ASP.NET Core 8.0)**
- **Architecture**: REST API with Repository/Service Pattern.
- **Database**: MongoDB (NoSQL) for flexible schema management.
- **Security**: JWT (JSON Web Tokens) for authentication and BCrypt for password hashing.
- **Mapping**: AutoMapper for DTO (Data Transfer Object) conversions.

### **Frontend (React)**
- **Styling**: Tailwind CSS v4 (The latest utility-first CSS framework).
- **Icons**: Lucide React for modern, consistent iconography.
- **State Management**: React Context API for global Authentication and User state.
- **Routing**: React Router DOM for smooth SPA transitions.

---

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js (v18+)
- MongoDB (running locally on port 27017 or via Atlas)

### 1. Backend Setup
```bash
cd backend/RecipeNest.Api
dotnet restore
dotnet run
```
The API will be available at `http://localhost:5174`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📂 Project Structure

- `/backend`: ASP.NET Core Web API project.
  - `/Models`: MongoDB entities.
  - `/Services`: Business logic and database interactions.
  - `/Controllers`: RESTful endpoints.
  - `/Data`: MongoDB context and Seed data.
- `/frontend`: React application.
  - `/src/pages`: Main application views (Home, Dashboards, Profiles).
  - `/src/components`: Reusable UI components (Sidebar, Modal, RecipeCard).
  - `/src/services`: Axios API wrappers.
  - `/src/context`: Auth context provider.

---

## ✅ Marking Criteria Checklist

- [x] **Full-stack functionality**: Fully working React + ASP.NET Core + MongoDB.
- [x] **Chef Features**: Profile management, Portfolio, and CRUD for recipes.
- [x] **Admin Features**: Global management and statistics.
- [x] **Security**: JWT, BCrypt, and Protected Routes implemented.
- [x] **UI/UX**: Premium design using Tailwind v4 and Lucide icons.
- [x] **Database**: Real persistence with MongoDB (Categories, Users, Recipes, Reviews).

---

## 📄 License
Created for University Coursework — 2026.
