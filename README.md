# Recipe Nest - Full Stack Recipe Management System

Recipe Nest is a comprehensive full-stack application designed for managing recipes, categories, and user profiles. This project features a robust C# .NET backend and a modern React frontend.

# Recipe Nest - Full Stack Recipe Management System

Recipe Nest is a comprehensive full-stack application designed for managing recipes, categories, and user profiles. This project features a robust C# .NET backend and a modern React frontend.

---

## Setup Instructions

This section provides step-by-step instructions for setting up and running Recipe Nest locally.

## Prerequisites

Before starting, ensure the following tools are installed on your system:

| Tool | Required Version | Download Link |
| :--- | :--- | :--- |
| **.NET SDK** | 8.0 or later | [Download .NET 8.0](https://dotnet.microsoft.com/download/dotnet/8.0) |
| **Node.js** | 18.0+ (LTS recommended) | [Download Node.js](https://nodejs.org/) |
| **npm** | 9.0+ (bundled with Node.js) | Included with Node.js |
| **MongoDB** | 7.0+ (Community Edition) | [Download MongoDB](https://www.mongodb.com/try/download/community) |
| **Git** | Latest | [Download Git](https://git-scm.com/) |

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/<your-username>/recipe-nest-fullstack.git
cd recipe-nest-fullstack
```

## Step 2: Set Up MongoDB

Ensure MongoDB is running locally on the default port (`27017`).

### On Windows
If installed as a service, it starts automatically.

### On macOS (Homebrew)
```bash
brew services start mongodb-community
```

### On Ubuntu/Linux
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Verify MongoDB is running
```bash
mongosh --eval "db.runCommand({ connectionStatus: 1 })"
```

> **Note:** If using **MongoDB Atlas (cloud)**, update the connection string in `backend/RecipeNest.Api/appsettings.json`.

---

## Step 3: Configure the Backend

```bash
cd backend/RecipeNest.Api
```

Review and update `appsettings.json` with your configuration:

```json
{
  "MongoDb": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "RecipeNestDb"
  },
  "Jwt": {
    "Secret": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "RecipeNestApi",
    "Audience": "RecipeNestClient",
    "ExpiryInHours": 24
  }
}
```

---

## Step 4: Run the Backend API

```bash
# Restore NuGet packages
dotnet restore

# Build the project
dotnet build

# Run the API server (default: http://localhost:5174)
dotnet run
```

On first startup, the application will automatically seed the database with:
*   **7 default categories** (Breakfast, Lunch, Dinner, Dessert, Appetizer, Snack, Vegan)
*   **3 test users**: Admin, Chef, and regular User
*   **Sample profiles and recipes**

**Swagger Documentation:** [http://localhost:5174/swagger](http://localhost:5174/swagger)

---

## Step 5: Set Up the Frontend

```bash
cd frontend

# Install npm dependencies
npm install

# Configure environment variables
echo "VITE_API_BASE_URL=http://localhost:5174/api" > .env
```

## Step 6: Run the Frontend

```bash
# Start the Vite development server
npm run dev
```

**Local URL:** [http://localhost:5173](http://localhost:5173)

---

## Step 7: Verify the Application

1.  Open the application in your browser.
2.  Register a new account or log in with a seeded test account.
3.  Verify the home page loads with featured recipes and category filters.
4.  Test search, browsing, and (if logged in as Chef) recipe management.

---

## Test Account Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@recipenest.com` | `Admin@123` |
| **Chef** | `chef@recipenest.com` | `Chef@123` |
| **User** | `user@recipenest.com` | `User@123` |

---

## Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **MongoDB connection refused** | Ensure MongoDB is running: `sudo systemctl status mongod` |
| **CORS errors** | Verify the frontend URL is whitelisted in `Program.cs` |
| **dotnet command not found** | Install .NET 8.0 SDK |
| **npm command not found** | Install Node.js v18+ |
| **Port 5173 in use** | Kill the existing process or change port in `vite.config.js` |
| **JWT token errors** | Ensure `Jwt:Secret` is at least 32 characters |

