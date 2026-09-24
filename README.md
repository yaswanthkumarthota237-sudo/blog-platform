# Blog Platform with Comments

A full-stack blogging app (MERN) built for Thiranex Task #4.

## Features
- User registration, login, JWT authentication
- Create, edit, delete blog posts (with image upload and category tags)
- Comment section on every post
- Profile page: update or delete account, view your own posts
- RESTful APIs with MongoDB Atlas

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, multer
- Frontend: React, Vite, React Router, Axios

## Run Locally
Backend:

    cd backend
    npm install
    npm run dev

Create backend/.env with PORT, MONGO_URI and JWT_SECRET.

Frontend:

    cd frontend
    npm install
    npm run dev

## API
- POST /api/auth/register, /api/auth/login
- GET/PUT/DELETE /api/auth/me
- GET/POST /api/posts, GET/PUT/DELETE /api/posts/:id
- GET/POST /api/posts/:id/comments, DELETE /api/comments/:id
