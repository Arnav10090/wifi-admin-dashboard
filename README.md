# WiFi Admin Dashboard

A web-based dashboard for managing WiFi devices, user permissions, and network settings.

## Features
- User authentication and role-based access control (RBAC)
- Dashboard for monitoring connected devices and network info
- Settings management

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- (Optional) [VS Code](https://code.visualstudio.com/) or your preferred code editor

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd wifi-admin-dashboard
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory. Add any required environment variables (e.g., database connection strings, authentication secrets). Example:

```
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_secret
# Add other variables as needed
```

> **Note:** Check the codebase or ask the maintainer for the exact required variables.

### 4. Set Up the Database
Run migrations and seed initial data:
```sh
npm run migrate     # or: node sync-db.js
npm run seed        # or: node seeders/initial-data.js
```

> **Note:** Ensure your database is running and accessible.

### 5. Start the Development Server
```sh
npm run dev
```

The app should now be running at [http://localhost:3000](http://localhost:3000)

## Project Structure
```
app/            # Next.js app directory
components/     # React components
models/         # Sequelize models
migrations/     # Database migrations
seeders/        # Database seeders
lib/            # Utility libraries
config/         # Configuration files
```

## Useful Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run migrate` — Run database migrations
- `npm run seed` — Seed the database

## Troubleshooting
- Double-check your `.env` variables if you get connection/auth errors.
- Make sure your database server is running.
- Delete `node_modules/` and run `npm install` if you have dependency issues.

## License
MIT License