# Server Documentation Guide

## 1. Prerequisites

Before starting, make sure you have these installed:

- [Node.js 20+](https://nodejs.org/)
- [npm 9+](https://www.npmjs.com/)

## 2. Initial Setup

```bash
# Go to the server directory
cd server

# Install dependencies
npm install

```

## 3. Set up Environment Variables

### Create a .env file

```bash
cp .env.example .env
```

### Fill out all the env varaibles

## 4. Database

### Create the database

-[Tidbcloud](https://tidbcloud.com)

### Run migrations

```bash
npx dbmate up
```

### To rollback the last migration

```bash
npx dbmate rollback
```

## 5 Run the sever

```bash
npm run dev
```

## 6 Folder Structure

<pre>
server/
├── src/                  # Main source code directory
│   ├── routes/           # Express router or API endpoints
│   ├── services/         # business logic, basically service that a app provide such as creation of user, creation of thread and etc.
│   ├── repositories/     # DataBase query functions
│   ├── middlewares/      # Custom middlewares
│   ├── strategies/       # Passport strategies (e.g., Google OAuthJWT)
│   └── db/migrations     # Database connection pool
├── .env                  #Environment variables file
├── package.json          #Node.js dependencies
└── SERVER_DOCUMENTATION.md
<pre>
