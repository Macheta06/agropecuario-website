# Agropecuario Catalog - Frontend

Modern React + Vite + TypeScript web application for a digital hardware store catalog.

## Features
- **Tailwind CSS v4**: Utilizing the latest CSS-first configuration and high-performance design system.
- **Mobile-First Design**: Industrial dark-mode aesthetic optimized for smartphone browsing.
- **Performance Optimized**: Search with debounced inputs and shimmer (skeleton) loading states.
- **WhatsApp Integration**: Automated order messages for every product item.

## Prerequisites
- Node.js (v18+)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file based on `.env.example`:
   ```bash
   VITE_API_URL=http://localhost:3000/api
   VITE_WHATSAPP_NUMBER=57XXXXXXXXXX
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Design System
The project follows a "Hardware Store" aesthetic:
- **Primary Color**: Industry Orange (#f97316)
- **Background**: Deep Surface Dark (#0a0a0a)
- **Typography**: Inter (Sans-serif)
