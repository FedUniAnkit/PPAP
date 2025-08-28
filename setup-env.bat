@echo off
echo 🍕 Pizza Order App - Environment Setup
echo =====================================

echo.
echo Creating .env file for server...
cd server

if not exist .env (
    copy .env.example .env
    echo ✅ .env file created from .env.example
    echo.
    echo ⚠️  IMPORTANT: Please edit server/.env file with your PostgreSQL credentials:
    echo    - DB_NAME=pizza_order_app
    echo    - DB_USER=postgres  
    echo    - DB_PASSWORD=your_password
    echo    - DB_HOST=localhost
    echo    - DB_PORT=5432
    echo    - JWT_SECRET=your_long_random_secret_key
    echo.
) else (
    echo ℹ️  .env file already exists
)

echo.
echo 📦 Installing dependencies...
echo Installing server dependencies...
call npm install

echo.
echo Installing client dependencies...
cd ..\client
call npm install --legacy-peer-deps

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Edit server/.env with your PostgreSQL credentials
echo 2. Start PostgreSQL service
echo 3. Run: cd server && npm run seed
echo 4. Run: cd server && npm run dev (in one terminal)
echo 5. Run: cd client && npm start (in another terminal)
echo.
echo 🌐 App will be available at: http://localhost:3000
echo 🔧 API will be available at: http://localhost:5000
echo.
pause
