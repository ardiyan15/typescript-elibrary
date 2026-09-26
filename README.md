# eLibrary
Web application for managing an eLibrary system, built with Express.js and TypeScript.

The project is fully containerized using Docker Compose, including the application, MySQL, Redis, and RabbitMQ services.

---

## Features
   - Master Data User (Create, Read, Update, Delete)
   - Master Book (Create Read. Update Delete)
   - Localization / Multi Language (English, Bahasa Indonesia)
   - Import User Data
   - Datatable Serverside
   - User Role Management
   - Authentication Login
   - User Authorization
   - 404 Page
   - Error Page
   - Telegram Notification
   - Profile Setting
   - Log Activity
   - Open API Documentation
   - Unit Test

---

## Tech Stack

   ### Backend
   - Node.js
   - Express.js
   - TypeScript
   - Sequelize ORM
   - MySQL
   - Redis
   - RabbitMQ
   - JWT
   - EJS Template Engine

   ### Frontend
   - Bootstrap
   - jQuery
   - SweetAlert 2
   - SB Admin 2 Template

   ### Architecture
   - MVC (Model View Controller)
   - Repository Pattern

   ### Documentation & Testing
   - OpenAPI / Swagger
   - Jest
   - Supertest
   
---

# Running with Docker

## Prerequisites

Make sure the following are installed:

- Docker
- Docker Compose

Services

The application runs using the following Docker services:

| Service    | Description                    | Internal Port | Host Port |
| ---------- | ------------------------------ | ------------: | --------: |
| `elibrary` | Express TypeScript application |          3000 |      3000 |
| `mysql`    | MySQL database                 |          3306 |      3307 |
| `redis`    | Redis cache                    |          6379 |         - |
| `rabbitmq` | RabbitMQ message broker        |          5672 |         - |
| `rabbitmq` | RabbitMQ Management UI         |         15672 |     15672 |

Project Structure

eLibrary-typescript/
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.ts
│
├── public/
├── views/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md

Setup
1. Clone Repository

git clone https://github.com/ardiyan25/eLibrary-typescript.git
cd eLibrary-typescript

2. Build and Start Containers

Run:
docker compose up -d --build

This will:

=> Build the Node.js application image
=> Start the Express application
=> Start MySQL
=> Start Redis
=> Start RabbitMQ
=> Create the MySQL database
=> Connect the application to the required services

3. Check Container Status

Run:
docker compose ps

All required services should be running.

Example

NAME                              STATUS
elibrary-typescript-elibrary-1   Up
elibrary-typescript-mysql-1      Up
elibrary-typescript-redis-1      Up
elibrary-typescript-rabbitmq-1   Up

Access Application

Frontoffice

Open:
http://localhost:3000

Backoffice

Open:
http://localhost:3000/backoffice

Swagger / OpenAPI

Open:
http://localhost:3000/api-docs

The Swagger URL may vary depending on the current Swagger configuration.

RabbitMQ Management

Open:
http://localhost:15672

Default credentials:
Username: elibrary
Password: elibrary123

Database

MySQL runs inside a Docker container.

Application Configuration

The application uses the following configuration inside Docker:

| Configuration | Value                  |
| ------------- | ---------------------- |
| Host          | `mysql`                |
| Port          | `3306`                 |
| Database      | `e_library_typescript` |
| Username      | `root`                 |
| Password      | empty                  |

The database is persisted using a Docker named volume:
mysql_data:/var/lib/mysql

This means the database data will remain available even if the MySQL container is recreated.

4. Screeshot
   
   ![{53FF336F-1468-4021-BD95-ABE601BA0870}](https://github.com/user-attachments/assets/32edb962-4e74-4fa2-8ff6-9e61700855bf)

   ![{4D3962A3-4D18-4C81-B096-69B0B5417762}](https://github.com/user-attachments/assets/27cba99f-3e32-43b0-a800-67e9d3b7effe)

   ![{E9ACE355-BE08-44BD-8F68-355DB983CCEA}](https://github.com/user-attachments/assets/1d5ab395-b361-4677-be5a-d1c7779f66d7)

   ![{C1D9509F-59FB-485F-84FC-B11C66172B50}](https://github.com/user-attachments/assets/f9e62db4-0e5c-4d5b-b039-ad2f47415baa)

   ![{D15F53E0-64A2-4376-A40C-3FE47576EDF4}](https://github.com/user-attachments/assets/11759435-8ad4-46d4-b892-231abda25344)

   ![{97D4E5E3-7E45-4AE8-9CEC-D46AFE0FA128}](https://github.com/user-attachments/assets/049d168b-30ba-4dff-a0bb-4526487a5f54)

   ![{65C9C50D-D83C-461C-8883-A210B8030437}](https://github.com/user-attachments/assets/260623a1-9e97-444a-92a4-0624a0446591)

   ![{E647CE07-B2AB-43AB-9A87-ACED34D4F534}](https://github.com/user-attachments/assets/1db5e4e0-be41-4b1f-8e3c-ccf1d499f8a0)

   ![{9EA04303-DE4C-4610-8E10-18490EF25500}](https://github.com/user-attachments/assets/f4882816-c269-47cc-9b97-2700a416fd5c)

   ![{AB7A40A5-8888-4674-846F-2B79D88A7519}](https://github.com/user-attachments/assets/f97d56f2-8000-4dde-9536-6b91897bf522)

   ![{308848DF-E750-4938-BA5D-A1E302F944DD}](https://github.com/user-attachments/assets/81e4e8b0-5c96-40ad-9615-7b31e2dd43c5)

   ![{7DC86D03-A466-4788-815C-1F07DDE52C6A}](https://github.com/user-attachments/assets/2715ad92-bd3b-459a-877e-713e5a8a0d6a)

   ![{E1DC6AA3-1C79-4F85-BBCF-2AD781C0B042}](https://github.com/user-attachments/assets/83a4ce3d-7b0f-475b-b14e-9d40610d6a22)

   ![{90059658-D7F8-4F5C-B18D-FB865C4F5358}](https://github.com/user-attachments/assets/1ecc9e51-facb-4f11-aaad-3b181c30bc99)


