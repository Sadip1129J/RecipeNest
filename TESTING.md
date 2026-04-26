# Testing Report — RecipeNest 🧪

This document outlines the testing procedures performed to ensure the reliability, security, and functionality of the RecipeNest platform.

---

## 🔐 1. Authentication & Authorization

| Test Case | Description | Result |
| :--- | :--- | :--- |
| **Registration** | Create a new user with 'Chef' role. Verify BCrypt hashing in DB. | ✅ Pass |
| **Login (Valid)** | Authenticate with valid credentials. Verify JWT token receipt. | ✅ Pass |
| **Login (Invalid)** | Attempt login with wrong password. Verify 401 Unauthorized. | ✅ Pass |
| **Role Protection** | Attempt to access `/admin-dashboard` as a 'User'. Verify redirect to Home. | ✅ Pass |
| **Token Persistence** | Refresh page after login. Verify session persistence via localStorage. | ✅ Pass |

---

## 👨‍🍳 2. Chef Portfolio & Recipe CRUD

| Test Case | Description | Result |
| :--- | :--- | :--- |
| **Create Recipe** | Add a new recipe with ingredients and instructions. | ✅ Pass |
| **Field Validation** | Attempt to submit recipe with empty title. Verify browser/form validation. | ✅ Pass |
| **Edit Recipe** | Update existing recipe title and image. Verify changes in public profile. | ✅ Pass |
| **Delete Recipe** | Delete a recipe. Verify 'Confirmation Modal' appears and data is removed. | ✅ Pass |
| **Privacy** | Attempt to edit a recipe owned by another chef. Verify 403 Forbidden. | ✅ Pass |

---

## 🍴 3. User Experience & Social

| Test Case | Description | Result |
| :--- | :--- | :--- |
| **Recipe Search** | Search for "Momo" in the search bar. Verify results filter correctly. | ✅ Pass |
| **Category Filter** | Click "Breakfast" pill. Verify only breakfast recipes appear. | ✅ Pass |
| **Review Submission**| Submit a 5-star review. Verify average rating updates on details page. | ✅ Pass |
| **Bookmarking** | Save a recipe. Verify it appears in the User Dashboard. | ✅ Pass |
| **Responsive UI** | View app on mobile (375px). Verify sidebar and grid adapt correctly. | ✅ Pass |

---

## ⚙️ 4. Backend & Database (MongoDB)

| Test Case | Description | Result |
| :--- | :--- | :--- |
| **Seed Data** | Clear database and restart API. Verify default categories and users exist. | ✅ Pass |
| **Persistence** | Stop/Start API and Database. Verify all recipes and reviews remain. | ✅ Pass |
| **CORS** | Access API from unauthorized domain. Verify CORS policy blocks request. | ✅ Pass |
| **DTO Mapping** | Verify sensitive fields (PasswordHash) are NOT exposed in API responses. | ✅ Pass |

---

## 📊 5. Performance

- **Lighthouse Score**: ~92/100 for Performance/Accessibility (tested locally).
- **API Response Time**: Average <100ms for GET requests.
- **Image Handling**: Responsive images using Unsplash dynamic sizing.

---

**Summary**: The application is stable and satisfies all functional requirements outlined in the project scenario.
