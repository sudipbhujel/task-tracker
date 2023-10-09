# Task Priority and Deadline Tracker

## Technology Used

- NestJs (ExpressJs), Mongoose (MongoDB), REST API, React

**Demo Link:**

_Client_: [https://tasktracker.up.railway.app/](https://tasktracker.up.railway.app/)

_API DOCS_: [https://api-tasktracker.up.railway.app/swagger](https://api-tasktracker.up.railway.app/swagger)

_note: the application is deployed in https://railway.app_

## Features

- Dockerize both backend and client application and setup docker-compose file
- Used conventional commits styled git commit message

**Backend**

1. Open API compliant api documentation using swagger docs - [https://api-tasktracker.up.railway.app/swagger](https://api-tasktracker.up.railway.app/swagger)
1. Server Side cookie setup for user authentication (JWT)
1. Proper request and response validation
1. CORS, Helmet setup
1. Use of MondoDB with mongoose package

**Frontend**

1. Setup linter, prettier
1. React Context to manage state of user
1. Light weight shadcn ui library
1. Use of react-hook-form with input validation
1. Debounced input in search of task
1. Use of filter, sorting and persist these state in query
1. React query to fetch, mutate and communication with rest api
1. User registration, login flow

## Run application

You can run this application by two methods, with docker and without docker.

**With docker**

- Navigate to root folder
  ```bash
  docker compose up
  ```

**Without Docker**

### Backend

- Navigate to `backend` folder
- Install dependencies
  ```bash
  pnpm i
  ```
- Setup environment variables
  - Create a `.env` file
  - Use [.env.example](.env.example) file for the key value types in `.env`
- Start application
  ```bash
  pnpm run dev
  ```

### Client

- Navigate to `client` folder
- Install dependencies
  ```bash
  pnpm i
  ```
- Setup environment variables
  - Create a `.env` file
  - Use [.env.example](.env.example) file for the key value types in `.env`
- Start application
  ```bash
  pnpm run dev
  ```

## Rooms for Improvements

- We can implement optimistic update in react using the features of `@tanstack/react-query` like cancel query
- Task notifications or reminders for approaching deadlines using `cron` jobs, send notification through `socket` and use `socket` in frontend to consume server sent payload
