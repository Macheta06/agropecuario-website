# Digital Catalog - Hardware Store Solution

A full-stack, mobile-first digital product catalog designed for local hardware stores. This project allows shop owners to easily digitize their large inventory and share it with customers via a professional web interface with direct WhatsApp integration.

## 🚀 Project Overview

The system consists of a **React frontend** and a **Node.js backend**, connected to a **MongoDB** database. It features a robust data ingestion system that categorizes thousands of rows from Excel files into logical hardware departments.

### Key Features
- **Categorization Engine**: Intelligent keyword-based strategy for product classification.
- **High-Performance Catalog**: Optimized to handle 5,000+ items with smooth pagination and search.
- **WhatsApp Direct Ordering**: Pre-formatted messages sent directly to the store's number.
- **Modern UI**: Dark mode, industrial aesthetics, and built with **Tailwind CSS v4**.

## 📂 Repository Structure

```text
Agropecuario/
├── client/          # Frontend: React + Vite + TS + Tailwind v4
├── server/          # Backend: Node.js + Express + MongoDB + Mongoose
├── .gitignore       # Global git ignore configuration
└── README.md        # This file
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS v4.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: MongoDB (Mongoose).
- **Tooling**: XLSX Parser for inventory ingestion.

## ⚡ Quick Start

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd Agropecuario
   ```

2. **Setup the Server**:
   Check [server/README.md](./server/README.md) for detailed instructions.
   - Install dependencies, set `.env` with MongoDB URI, and run `npm run dev`.

3. **Setup the Client**:
   Check [client/README.md](./client/README.md) for detailed instructions.
   - Install dependencies, set `.env` with VITE_API_URL and VITE_WHATSAPP_NUMBER, and run `npm run dev`.

4. **Data Ingestion (Optional)**:
   Place your inventory Excel file in the project root and run `npm run seed` from the `server/` directory to populate the database.

---
*Developed for professional hardware store digitalization.*
