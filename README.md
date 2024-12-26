# Purwadhika Mini Project Repository

### Event Management Platform

- Project Goals & Parameters: https://docs.google.com/document/d/1JkNlK4M180IyCoRk3aQsXiDIdG10uXhJVKVMTgk9qM4/edit?tab=t.0#heading=h.j7ohfg6cqy5p

### ConcertHub

ConcertHub is a concert-management platform built with TypeScript, Express.js for Back-end, and React and Next.js for Front-end. Users can create accounts as participants or organizers to view/purchase tickets for events or create/manage them as organizers.

This project was meant as a 2-man project, but my partner was unable to complete their part. Project is incomplete; only Feature 2 of the Project Goals & Parameters has been completed, along with basic UI/UX features.

### Active Features

- Login and Register as Participants or Organizers
- Referral codes on registration & purchases
- Organizer dashboard for event history, statistics, & management
- Supabase database integration
  - Database random populator available in footer

### Technologies

- **Languages**: TypeScript, HTML, CSS (Tailwind CSS)
- **Back-end**: Node.js, Express.js, Prisma, JSON Web Token, Nodemailer
- **Front-end**: React, Next.js, Redux, Formik, ApexCharts
- **Database**: Supabase

### Project Setup

- **Prerequisites**

  TypeScript

  - **Back-end**: Node.js, Express.js
  - **Front-end**: Next.js with React & TypeScript

- **Easy Installation (Run in terminal)**

  - **Back-end**: Run in `./apps/api`.

    - `npm init --y`
    - `npm i typescript @types/node ts-node nodemon -D`
    - `npx tsc --init`
    - `npm i dotenv`
    - `npm i express`
    - `npm i @types/express -D`
    - `npm i prisma`
    - `npx prisma init`
    - `npm i @prisma/client`
    - `npm i bcrypt`
    - `npm i -D @types/bcrypt`
    - `npm i jsonwebtoken`
    - `npm i -D @types/jsonwebtoken`
    - `npm i jwt-decode`
    - `npm i cors`
    - `npm i -D @types/cors`
    - `npm i express-validator`
    - `npm i multer`
    - `npm i -D @types/multer`
    - `npm i nodemailer`
    - `npm i @types/nodemailer -D`
    - `npm i handlebars`
    - `npm i helmet`
    - `npm i milliseconds`
    - `npm i -D @types/milliseconds`

  - **Front-end**: Run in `./apps/web`.

    - `npx create-next-app@latest .`
    - `npm install @jridgewell/gen-mapping`
    - `npm i axios formik yup`
    - `npm i --save @fortawesome/fontawesome-svg-core`
    - `npm i --save @fortawesome/free-solid-svg-icons`
    - `npm i --save @fortawesome/free-regular-svg-icons`
    - `npm i --save @fortawesome/free-brands-svg-icons`
    - `npm i --save @fortawesome/react-fontawesome@latest`
    - `npm i sweetalert2`
    - `npm i apexcharts --save`
    - `npm install --save react-apexcharts`
    - `npm i @reduxjs/toolkit react-redux`

- **Environment Variables**

  - **Back-end**: .env in `./apps/api`.

    - SECRET_KEY="I12edasc*&9vmid3CND*"
    - SECRET_KEY2="secondkey2983u409wo"
    - PORT=8080
    - NODEMAILER_EMAIL="miniprojectpurwadhika@gmail.com"
    - NODEMAILER_PASSWORD="rcom afcn hdup yayf"
    - ADMIN_EMAIL="juliangenesiusmuljadi@gmail.com"
    - BASE_WEB_URL="http://localhost:3000"
    - DATABASE_URL="postgresql://postgres.iozenelazdhyuxlnpskl:Ae9yNVKr8\*ydMcv@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    - DIRECT_URL="postgresql://postgres.iozenelazdhyuxlnpskl:Ae9yNVKr8\*ydMcv@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

  - **Front-end**: .env in `./apps/web`.

    - NEXT_PUBLIC_BASE_API_URL=http://localhost:8080
    - NEXT_PUBLIC_BASE_WEB_URL=http://localhost:3000
    - NEXT_PUBLIC_SECRET_KEY=I12edasc*&9vmid3CND*

- **Running the Project Locally**

  1.  Open terminals both in `./apps/api` and `./apps/web`.
  2.  Run `npm run dev` on both.
  3.  Open `http://localhost:3000` on your preferred browser.

- **Database Management**

  Run `npx prisma migrate dev` to sync Prisma with the database.

### Folders

- ./
  - apps/ --- # Project only required using this folder
    - api/ --- # Back-end folder
      - prisma/ --- # Prisma database management
      - src/
        - config/ ----------- # .env management
        - controllers/ ------ # Contains all main logic and handles all main API requests & responses
        - databasepopulation/ # Contains logic & endpoints for database random population
        - mailer/ # Nodemailer management and email templates
        - middlewares/ # Request validations, token verifications, & error handling
        - routers/ # API main endpoints
    - web/ # Front-end folder
      - src/
        - app/ # Next.js app folder. Folder structure dictates routing
        - assets/ # Various images
        - components/ # Contains logic and views for pages
        - databasepopulation/ # Contains logic for database random population
        - errorhandler/ # SweetAlerts2 error handling
        - interfaces/ # Various reusable interfaces
        - redux/ # Redux slices & store
        - verifytoken/ # Functions to verify access tokens
