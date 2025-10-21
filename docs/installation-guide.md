# Installation Guide - Pizza Order App

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Git

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd pizza-order-app
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install --legacy-peer-deps
```

### 4. Setup PostgreSQL Database

**Option A: Local Installation**
1. Download and install PostgreSQL from https://www.postgresql.org/download/
2. Create database:
```sql
CREATE DATABASE pizza_order_app;
CREATE USER pizza_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pizza_order_app TO pizza_user;
```

**Option B: Cloud Database**
- Use Supabase, ElephantSQL, or AWS RDS
- Get connection details from your provider

### 5. Setup Environment Variables

Create `.env` file in the `server` directory:
```env
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration
DB_NAME=pizza_order_app
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

CLIENT_URL=http://localhost:3000
```

### 6. Seed Sample Data
### 4. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd client

# Install dependencies
npm install

# Create environment file
echo REACT_APP_API_URL=http://localhost:5000/api > .env
```

### 5. Database Setup

#### Option A: Local MongoDB
1. Start MongoDB service on your machine
2. The app will automatically create the database and collections

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in `.env`

### 6. Start the Application

#### Terminal 1 - Backend Server
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend Development Server
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## Verification Steps

1. **Backend Health Check**
   - Visit: http://localhost:5000/api/health
   - Should return: `{"success": true, "message": "Pizza Order API is running!"}`

2. **Frontend Loading**
   - Visit: http://localhost:3000
   - Should load the React application

3. **Database Connection**
   - Check server console for: `MongoDB Connected: <host>`

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Ensure MongoDB is running locally
- Check connection string in `.env`
- Verify network connectivity for cloud databases

### Issue: Port Already in Use
**Solution:**
```bash
# Kill process using port 5000
npx kill-port 5000

# Or change PORT in .env file
PORT=5001
```

### Issue: Module Not Found
**Solution:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Errors
**Solution:**
- Verify `CLIENT_URL` in server `.env`
- Check if both servers are running
- Clear browser cache

## Development Tools Setup

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- MongoDB for VS Code
- Thunder Client (API testing)

### Git Setup
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial project setup"

# Add remote repository
git remote add origin <your-github-repo-url>

# Push to GitHub
git push -u origin main
```

## Next Steps

After successful installation:

1. **Create Admin User**: Use the registration endpoint to create your first admin user
2. **Add Sample Data**: Use the provided seeders to populate initial data
3. **Test API Endpoints**: Use Thunder Client or Postman to test API functionality
4. **Start Development**: Begin implementing features according to the roadmap

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all dependencies are installed correctly
3. Ensure environment variables are set properly
4. Refer to the troubleshooting section above

For additional help, refer to:
- `README.md` for project overview
- `docs/api-documentation.md` for API details
- `docs/user-manual.md` for usage instructions
