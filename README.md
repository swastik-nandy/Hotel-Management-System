# 🏨 Luxe Hotels – Full-Stack Hotel Booking Management System

Luxe Hotels is a fully-featured hotel management web application built with **Spring Boot** (backend) and **React.js** (frontend). It offers luxury-themed booking with real-time availability filtering, elegant payment and confirmation pages, PDF invoice generation, email notifications, and a clean UI.

> ✅ **Deployed on Render** with full **Docker-based CI/CD** integration  
> 📦 The backend is containerized, configured with `.env`, and the frontend is built and started with bpm as a web service on another instance and deployed separately on    
"Render.com".

---

## 🚀 Features

### 🌐 Frontend
- Transparent, Apple-style UI with luxury aesthetics
- Dynamic room filter by date, branch, and type
- Booking summary and PDF download on confirmation
- Tailwind CSS, React Router, Framer Motion animations
- Responsive layout for mobile and desktop

### 🔧 Backend
- RESTful Spring Boot APIs
- PostgreSQL + Hibernate for persistence
- PDF generation using Flying Saucer + Thymeleaf
- EmailService with JavaMailSender
- Scheduler for room cleanup
- Flyway for SQL migrations
- Rate limiting and CORS config
- JWT security scaffolding in place

---

## 🧱 Project Structure

```
├── Backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── Render/.env
│   ├── logs/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/hotel/
│       │   ├── controller/
│       │   ├── service/
│       │   ├── dto/
│       │   ├── config/
│       │   ├── scheduler/
│       │   ├── security/
│       │   ├── repository/
│       │   └── model/
│       ├── resources/
│       │   ├── application.properties
│       │   ├── application-retry.properties
│       │   ├── db/migration/
│       │   └── templates/receipt.html
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── public/images/
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx, main.jsx
│       ├── pages/
│       ├── components/
│       ├── api/
│       └── assets/
```

---

## ⚙️ Environment Setup

### 🔐 `.env.example` for Backend

```env
DB_URL=jdbc:postgresql://localhost:5432/luxe_hotels
DB_USERNAME=postgres
DB_PASSWORD=yourpassword

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your@email.com
SMTP_PASSWORD=your_app_password

HOTEL_NAME=Luxe Hotels
WEBHOOK_URL=https://webhook.site/your-webhook
JWT_SECRET=your_jwt_secret
```

---

## 🗃️ SQL Schema (Flyway)

Flyway handles migrations automatically using:

- `V1__init.sql` – Creates base schema
- `V2__init.sql` & `V3__init.sql` – Add dummy data and structural improvements

These files are auto-run from `resources/db/migration/`.

---

## 🧾 PDF Invoice

- `receipt.html` is the Thymeleaf invoice template.
- Uses Flying Saucer to render beautiful downloadable PDFs.
- Automatically triggered post-booking.
- Download endpoint: `/api/pdf/download/{bookingId}`

---

## 📬 Email Notification

- Triggered on booking confirmation
- Contains booking summary + PDF attachment
- Powered by `EmailService.java`
- Uses SMTP credentials from `.env`

---

## 🔐 Security Overview

- JWT authentication structure ready
- Public API paths allowed via `.permitAll()` in `SecurityConfig`
- Auth endpoints like `/api/auth/**` scaffolded for future admin/staff roles

---

## 📡 Webhooks

- Sends booking data to external systems
- Customizable via `WebhookService`
- Compatible with Zapier, Slack, webhook.site, etc.

---

## 🪵 Logging

- Configured via `logback-spring.xml`
- Supports file + console logging
- Log files stored under `/logs/` with rotation enabled

---

## 🔗 API Endpoints Summary

| Endpoint                        | Method | Description                     |
|--------------------------------|--------|---------------------------------|
| `/api/room/**`                 | GET    | Room data                       |
| `/api/branch/**`               | GET    | Branch data                     |
| `/api/price`                   | GET    | Pricing info                    |
| `/api/filter/**`               | POST   | Room availability filter        |
| `/api/book`                    | POST   | Start booking                   |
| `/api/booking/add`             | POST   | Save booking                    |
| `/api/booking-status`          | GET    | Booking status check            |
| `/api/booking/{id}/receipt`    | GET    | View booking receipt (HTML)     |
| `/api/pdf/download/{id}`       | GET    | Download receipt as PDF         |
| `/api/availability`           | GET    | Simple availability check       |
| `/api/health`, `/api/ping`     | GET    | Render health check             |

---

## 🧪 Developer Notes

- Use `application.properties` to configure service URLs and profiles
- Retry logic defined in `application-retry.properties`
- Availability is derived dynamically from booking data

---

## 🛠️ Future Roadmap

- Admin dashboard for room stats, revenue, customer info
- Employee login system and staff management
- Razorpay/Stripe integration for real payments
- QR codes for bookings and room scanning

---

## 👤 Author

**Swastik Nandy**  
 Email : swastiknandy2003@gmail.com  
 Linkedin: [@swastik-nandy](https://www.linkedin.com/in/swastik-nandy/)

---

## 📄 License

This repository is open-source under the MIT License. You’re welcome to fork or clone it for personal or commercial use. However, all contributions to this main repo must go through pull requests. CI/CD and production deployments are privately secured and maintained by the author.