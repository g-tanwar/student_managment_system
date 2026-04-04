# Backend Folder Structure & Architecture Convention

For a scalable, modular Node.js/Express Student Management System using MongoDB, we will utilize a lightweight Layered Architecture (Controller-Service-Repository). Because Mongoose models largely act as the Repository layer natively, our core layers will be Routes -> Controllers -> Services -> Models.

## 1. Directory Structure

```text
backend/
├── src/
│   ├── config/            # Environment variables mapping, DB connection, and constants
│   ├── controllers/       # HTTP layer (extracts req config, calls service, sends res)
│   ├── middlewares/       # Express middlewares (Auth, error handling, logging)
│   ├── models/            # Mongoose schemas and database models (Repository layer)
│   ├── routes/            # Route definitions mapped to controllers
│   ├── services/          # Core Business Logic (Where the actual work happens)
│   ├── utils/             # Reusable helper functions, custom error classes
│   ├── validations/       # Request validation schemas (e.g., Joi or Zod)
│   ├── app.js             # Express app instance creation and middleware assembly
│   └── server.js          # Application entry point (starts server)
├── logs/                  # Ignored in git, used if Winston/Morgan logs to file
├── test/                  # Test suites (unit/integration)
├── .env                   # Local environment variables (Git ignored)
├── .env.example           # Template for environment variables
├── .gitignore             # Files/folders to ignore in Git
├── package.json           # Node dependencies and scripts
└── package-lock.json
```

## 2. Layer Purposes

*   **`config/`**: Centralizes config. Parses `process.env` so the rest of the app doesn't have `process.env.XXX` scattered everywhere. Contains DB connection logic (`db.js`).
*   **`controllers/`**: Strict HTTP scope. A controller function receives `(req, res, next)`, extracts data from `req.body`/`req.params`, passes it mathematically down to a Service, and formats the Service's return value into an HTTP response using `res.status().json()`. **No complex business logic here.**
*   **`services/`**: The brain of the application. Contains pure Node.js functions representing business rules. It accepts parameters, speaks to the Database via `models`, processes algorithms, and returns results (or throws custom Errors). Crucial for reusability and testing.
*   **`models/`**: Defines the shape of the data using Mongoose Schemas. Enforces database-level constraints.
*   **`routes/`**: Wires the API endpoints. Attaches specific HTTP methods (GET, POST) and paths mapping to specific Controller functions. Applies middle-wares (like authentication or validation) *before* hitting the controller.
*   **`middlewares/`**: Functions that intercept requests. Examples: `auth.middleware.js` (to verify JWTs), `validate.middleware.js` (to run request data against validation schemas before it reaches the controller to prevent bad data). Also holds the global centralized `errorHandler.js`.
*   **`validations/`**: Schema definitions strictly enforcing request payloads (making sure `password` is > 8 chars, `email` is valid, etc.).
*   **`utils/`**: General purpose tools like `jwtUtils.js` (sign/decode), `hashUtils.js` (bcrypt wrappers), `ApiError.js` (a custom error class extending JavaScript's `Error`).

## 3. File Naming Conventions

Consistency makes the codebase highly navigable:

1.  **Folders:** Everything is lowercase and plural (`controllers`, `services`, `routes`).
2.  **Models:** PascalCase and singular because they export JavaScript Classes/Constructors.
    *   *Example:* `User.js`, `Student.js`, `Attendance.js`
3.  **Routes:** lowercase dot-notation indicating domain and type.
    *   *Example:* `auth.routes.js`, `student.routes.js`
4.  **Controllers:** camelCase suffixing the domain.
    *   *Example:* `authController.js`, `studentController.js`
5.  **Services:** camelCase suffixing the domain.
    *   *Example:* `authService.js`, `studentService.js`
6.  **Validations:** camelCase suffixing the domain.
    *   *Example:* `authValidation.js`, `studentValidation.js`
7.  **Middlewares:** lowercase dot-notation.
    *   *Example:* `auth.middleware.js`, `error.middleware.js`

## 4. Why this approach?
*   **Separation of Concerns:** If you want to change out Express for Fastify later, you only change Routes and Controllers. The Services remain perfectly intact.
*   **Centralized Error Handling:** Instead of try/catching and sending `res` in every service/controller, services just `throw new ApiError(400, 'Invalid input')`, and a singular global error middleware safely catches it and formats a unified JSON response.
*   **Thin Controllers, Fat Services:** Keeps the HTTP layer very fast to read and debug.
