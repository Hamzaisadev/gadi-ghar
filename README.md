# 🚗 Gadi Ghar — Car Marketplace

## 📊 Repo Stats & Demo

<p align="center">
  <img src="https://img.shields.io/github/stars/hamzaisadev/gadi-ghar?style=for-the-badge" alt="GitHub stars"/>
  <img src="https://img.shields.io/github/forks/hamzaisadev/gadi-ghar?style=for-the-badge" alt="GitHub forks"/>
  <img src="https://img.shields.io/github/issues/hamzaisadev/gadi-ghar?style=for-the-badge" alt="GitHub issues"/>
  <img src="https://img.shields.io/github/last-commit/hamzaisadev/gadi-ghar?style=for-the-badge" alt="Last commit"/>
  <img src="https://img.shields.io/github/commit-activity/m/hamzaisadev/gadi-ghar?style=for-the-badge" alt="Commit activity"/>
  <img src="https://komarev.com/ghpvc/?username=hamzaisadev&repo=gadi-ghar&color=blue&style=for-the-badge" alt="Repo views"/>
</p>

<p align="center">
  <h1 align="center">PAKISTAN'S FIRST AI CAR MARKETPLACE</h1>
</p>

---

## 🌟 Overview

**Gadi Ghar** is a full-featured web app for buying, selling, and managing cars. It’s tailored for the Pakistani market, supporting price ranges in PKR, and features:
- Admin and user flows
- Image uploads (manual & AI)
- Wishlisting, filtering, and more!

---

## 🚀 Features

- 🔎 **Browse & Filter:** Search cars by make, model, year, body type, and **price range**
- 🛠️ **Admin Panel:** Add, edit, and manage car listings
- 🖼️ **Image Uploads:** Manual & AI-generated options
- ❤️ **User Auth & Wishlists:** Save your favorite cars
- 📱 **Responsive UI:** Built with Tailwind CSS
- 🏢 **Dealership Info:** Manage working hours & details

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM, PostgreSQL
- **Auth:** Clerk
- **Image Storage:** Supabase
- **Quality:** ESLint, Prettier

---

## 🗄️ Database Schema

The core `Car` model supports a price range:

```prisma
model Car {
  id         String   @id @default(uuid())
  make       String
  model      String
  year       Int
  minPrice   Decimal  @db.Decimal(10, 2)
  maxPrice   Decimal  @db.Decimal(10, 2)
  // ...other fields...
}
```

- **minPrice** and **maxPrice** capture the price range in PKR.
- Multiple indexes for efficient filtering.

---

## 💸 Price Filtering Logic

Cars are filtered using their price range. When a user selects a price or a price range, all cars whose min-max price overlaps with the user's selection are shown.

**Example (Prisma/SQL logic):**
```js
where: {
  minPrice: { lte: userMax },
  maxPrice: { gte: userMin }
}
```
This ensures accurate and user-friendly results for all price-based searches.

---

## ⚡ Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd gadi-ghar
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up your environment:**
   - Copy `.env.example` to `.env` and fill in your secrets
4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```
5. **Start the development server:**
   ```bash
   npm run dev
   ```
6. **Open:** [http://localhost:3000](http://localhost:3000)

---

## 🧰 Development Scripts

- `npm run dev` — Start the development server
- `npm run lint` — Lint code with ESLint
- `npx prisma studio` — Open Prisma Studio to view/edit your database

---

## 🗂️ Project Structure

- `/app` — Next.js app directory (routes, pages, admin panel)
- `/components` — Reusable UI components, sections, and utilities
- `/lib` — Server-side utilities, Prisma client, and data helpers
- `/prisma` — Prisma schema and migrations
- `/public` — Static assets

---

## 📝 Notes on Filtering Approach

> **Price range filtering:**
>
> Cars are filtered using their minPrice and maxPrice fields. This ensures all cars matching the user's selected price or price range are included, providing the most accurate and user-friendly experience.

---

## 📄 License

MIT (or your chosen license)

---

### Made with ❤️ for the Pakistani car market!

## 📊 Repo Stats & Demo

<p align="center">
  <img src="https://img.shields.io/github/stars/hamzaisadev/gadi-ghar?style=for-the-badge" alt="GitHub stars"/>
  <img src="https://img.shields.io/github/forks/hamzaisadev/gadi-ghar?style=for-the-badge" alt="GitHub forks"/>
  <img src="https://img.shields.io/github/issues/hamzaisadev/gadi-ghar?style=for-the-badge" alt="GitHub issues"/>
  <img src="https://img.shields.io/github/last-commit/hamzaisadev/gadi-ghar?style=for-the-badge" alt="Last commit"/>
  <img src="https://img.shields.io/github/commit-activity/m/hamzaisadev/gadi-ghar?style=for-the-badge" alt="Commit activity"/>
  <img src="https://komarev.com/ghpvc/?username=hamzaisadev&repo=gadi-ghar&color=blue&style=for-the-badge" alt="Repo views"/>
</p>

<p align="center">

  <h1 align="center">PAKISTANS FIRST AI CAR MARKETPLACE</h1>
</p>

---

Welcome to **Gadi Ghar**, a modern car marketplace for Pakistan, built with 💎 Next.js, Prisma, and PostgreSQL. This project is designed to showcase both technical depth and beautiful user experience, supporting PKR price ranges (crores/lakhs) and advanced admin/user flows.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Price Filtering Logic](#price-filtering-logic)
- [Getting Started](#getting-started)
- [Development Scripts](#development-scripts)
- [Project Structure](#project-structure)
- [Notes on Filtering Approach](#notes-on-filtering-approach)
- [License](#license)

---

## 🌟 Overview

**Gadi Ghar** is a full-featured web app for buying, selling, and managing cars. It’s tailored for the Pakistani market, supporting price ranges in PKR, and features:
- Admin and user flows
- Image uploads (manual & AI)
- Wishlisting, filtering, and more!

---

## 🚀 Features

- 🔎 **Browse & Filter:** Search cars by make, model, year, body type, and **price range**
- 🛠️ **Admin Panel:** Add, edit, and manage car listings
- 🖼️ **Image Uploads:** Manual & AI-generated options
- ❤️ **User Auth & Wishlists:** Save your favorite cars
- 📱 **Responsive UI:** Built with Tailwind CSS
- 🏢 **Dealership Info:** Manage working hours & details

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM, PostgreSQL
- **Auth:** Clerk
- **Image Storage:** Supabase
- **Quality:** ESLint, Prettier

---

## 🗄️ Database Schema

The core `Car` model supports a price range:

```prisma
model Car {
  id         String   @id @default(uuid())
  make       String
  model      String
  year       Int
  minPrice   Decimal  @db.Decimal(10, 2)
  maxPrice   Decimal  @db.Decimal(10, 2)
  // ...other fields...
}
```

- **minPrice** and **maxPrice** capture the price range in PKR.
- Multiple indexes for efficient filtering.

---

## 💸 Price Filtering Logic

### Real-World Filtering (Best Practice)
Users expect to see cars whose price range overlaps with their filter range. The best practice is:

```sql
SELECT * FROM Car
WHERE minPrice <= userMaxFilter AND maxPrice >= userMinFilter
```

This ensures all relevant cars are shown, even for wide ranges.

---

## ⚡ Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd gadi-ghar
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up your environment:**
   - Copy `.env.example` to `.env` and fill in your secrets
4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```
5. **Start the development server:**
   ```bash
   npm run dev
   ```
6. **Open:** [http://localhost:3000](http://localhost:3000)

---

## 🧰 Development Scripts

- `npm run dev` — Start the development server
- `npm run lint` — Lint code with ESLint
- `npx prisma studio` — Open Prisma Studio to view/edit your database

---

## 🗂️ Project Structure

- `/app` — Next.js app directory (routes, pages, admin panel)
- `/components` — Reusable UI components, sections, and utilities
- `/lib` — Server-side utilities, Prisma client, and data helpers
- `/prisma` — Prisma schema and migrations
- `/public` — Static assets

---

## 📝 Notes on Filtering Approach

> **Why use a single price field for filtering?**
>
> This project uses a hidden `price` field (average of minPrice and maxPrice) for filtering, to simplify the filtering logic and make it easier to understand.  
> In a real production system, always filter using the min/max range overlap logic for accurate and user-friendly results.  
> This design decision is documented here for transparency and to demonstrate awareness of best practices.

---

## 📄 License

MIT (or your chosen license)

---

### Made with ❤️ for the Pakistani car market!
