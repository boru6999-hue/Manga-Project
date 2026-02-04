# Manga Project – Server Architecture

## Зорилго
Энэхүү баримт бичиг нь Manga Project-ийн backend серверийн
архитектур, логик урсгал, folder бүтэц болон аюулгүй байдлын
шийдлүүдийг тодорхойлно.

Сервер нь frontend-ээс ирэх хүсэлтийг боловсруулж,
өгөгдлийн сантай харилцан ажиллах үндсэн үүрэгтэй.

---

## 1. Logical Architecture

Client (Browser / React App)
   ↓
API Gateway (Express / Nest Controller Layer)
   ↓
Service Layer (Business Logic)
   ↓
Database (MySQL)

### Тайлбар
- **Client**  
  React frontend, Axios ашиглан API дуудна
- **API Gateway**  
  Request хүлээн авч validation, auth шалгана
- **Service Layer**  
  Бизнес логик, data боловсруулах
- **Database**  
  MySQL – өгөгдөл хадгалалт

---

## 2. Backend Technology Stack

- Runtime: Node.js
- Framework: Express.js (эсвэл NestJS)
- Database: MySQL
- ORM / Query: Prisma / Sequelize / mysql2
- Authentication: JWT
- Validation: Zod / Joi
- Logging: Morgan / Winston

---

## 3. Backend Folder Structure

```txt
backend/
└─ src/
   ├ controllers/     # Request → Response
   ├ services/        # Business logic
   ├ routes/          # API routes
   ├ models/          # DB models / schema
   ├ middlewares/     # Auth, validation, error handling
   ├ utils/           # Helper functions
   ├ config/          # Env, DB config
   └ app.js           # App entry point
