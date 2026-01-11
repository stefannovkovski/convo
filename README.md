<p align="center">
  <img src="frontend/convo/public/convo-logo-dark.jpg" width="140" alt="Convo Logo" />
</p>

# Convo – Social Media Platform

A full-stack social media application built with modern web technologies, featuring posts, likes, comments, follows, and real-time style interactions.


Prerequisites

- Docker & Docker Compose
- Git

## Video Presentation 

https://www.loom.com/share/cca16a7dc6834ca4ab246222103f2993

## Running the Application 

### 1. Clone the repository

```bash
git clone https://github.com/stefannovkovski/convo
cd convo
```
### 2. Start all services
```bash
docker-compose up --build
```
First run may take 3–5 minutes.

### 3. Access the application
-  Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5433

The application will automatically:
- Set up the PostgreSQL database
- Run database migrations
- Start the backend server
- Start the frontend application

## Architecture
The application follows a modern three-tier architecture consisting of a frontend (presentation layer), backend (business logic), and database (data layer). The frontend is built with Next.js and React and communicates with the backend through a RESTful API using well-defined HTTP endpoints.

The backend is implemented as a modular monolith using NestJS, where each major feature (authentication, posts, comments, likes, follows) is organized into its own module with dedicated controllers, services, and repositories. This ensures clean separation of concerns and good maintainability.

Requests flow through a layered backend design: controllers handle HTTP and validation, services contain business logic, and repositories manage data access via Prisma ORM to a PostgreSQL database with proper relations and constraints.

Authentication is handled using stateless JWT tokens with passwords securely hashed using bcrypt. The entire system is containerized with Docker and orchestrated using Docker Compose for consistent development and deployment environments.

## Technology Stack

### Frontend

Next.js, React, Material UI, Axios, TypeScript

### Backend

NestJS, Prisma ORM, PostgreSQL, JWT authentication, Bcrypt password hashing, TypeScript

### DevOps

Docker & Docker Compose
