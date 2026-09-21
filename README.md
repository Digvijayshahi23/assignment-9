# Visitor Pass Management System

A comprehensive, full-stack MERN application for managing visitor passes digitally. Designed with premium modern aesthetics, role-based access control, and QR-code integration.

## Features
- **Role-Based Dashboards**: Tailored views for Admin, Security, and Host Employees.
- **Pre-Registration**: Hosts can invite visitors, automatically creating an appointment.
- **Digital Passes**: Generate secure QR codes and PDF badges for approved visitors.
- **Check-in/Check-out**: Security personnel can scan QR codes to log entry/exit.
- **Visitor Portal**: Visitors can view their passes digitally.
- **Premium UI**: Glassmorphism, dynamic animations, and responsive design.

## Tech Stack
- **Frontend**: React (Vite), React Router, Context API, Vanilla CSS.
- **Backend**: Node.js, Express, MongoDB (MongoMemoryServer for demo).
- **Libraries**: JWT, bcryptjs, qrcode, pdfkit, html5-qrcode.

## Setup Guide

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Backend Setup
```bash
cd backend
npm install
# The backend uses MongoMemoryServer, so no local MongoDB installation is required for the demo.
# It automatically seeds demo data on startup.
npm run dev
```
*Backend runs on http://localhost:5000*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on http://localhost:5173*

### 4. Docker Setup (Bonus)
The project includes Dockerfiles and a `docker-compose.yml` for a production-ready setup with Nginx.
```bash
docker-compose up --build
```
*App will run on http://localhost and backend on http://localhost:5001*

## Demo Accounts
The system automatically creates demo accounts on startup:
- **Admin**: `admin@test.com` (Password: `password123`)
- **Security**: `security@test.com` (Password: `password123`)
- **Host**: `host@test.com` (Password: `password123`)

## Workflow Demo
1. Log in as **Host** (`host@test.com`).
2. Click **+ Invite Visitor** to pre-register a visitor.
3. Log out and log in as **Admin** or **Security**.
4. Go to **Appointments** and approve the pending invite to generate a Pass.
5. Open the **Visitor Portal** (`http://localhost:5173/visitor`) and search for the visitor's email to view their digital QR pass.
6. Log in as **Security** (`security@test.com`) and go to the **Pass Scanner** to scan the QR code for Check-in.
# assignment-9
