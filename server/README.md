# Agropecuario Catalog - Backend

Node.js + Express + MongoDB API for the Digital Hardware Store Catalog.

## Features
- **Scalable Architecture**: Organized in Routes, Controllers, and Services layers.
- **Mongoose Integration**: Typed models for Products and Categories with text indexing.
- **Massive Seeder**: Custom script to process large Excel inventory files efficiently.
- **RESTful API**: Endpoints for paginated products and category filtering.

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file based on `.env.example`:
   ```bash
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. (Optional) Run seeder:
   The seeder parses the inventory file. Note: The inventory file is excluded from version control.
   ```bash
   npm run seed
   ```
