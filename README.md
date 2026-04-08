# HopeLink v2 🤝

> A community-driven donation management platform connecting donors, recipients, and volunteers seamlessly.

HopeLink v2 is a full-stack platform built to streamline the distribution of donations by coordinating between people who want to give (donors), people in need (recipients), and the volunteers who fulfill those deliveries and manage community events.

## 🚀 Features

### Multi-Role User System
Dedicated interfaces and functionality tailored for four distinct roles:
* **Donors:** Post items for donation, track donation statuses, and view history.
* **Recipients:** Request items, get matched with available donations, and confirm deliveries.
* **Volunteers:** View delivery tasks, accept requests to fulfill, and manage delivery schedules.
* **Administrators:** Oversee platform activity, verify user identities, manage events, and access analytical dashboards.

### Core Capabilities
* **Smart Matching Algorithm:** Intelligently match available donations with open requests based on category and need.
* **Logistics & Delivery Tracking:** Real-time visibility into the fulfillment lifecycle for both donors and recipients.
* **Community Events:** Create and manage community drives and distribution events.
* **Analytics & Reporting:** Comprehensive visual dashboards and PDF report generation for administrators.
* **Geospatial Implementation:** Location picking and viewing integrations powered by Google Maps setup.
* **Secure Document Verification:** Identity verification built right into the platform.

## 🛠 Tech Stack

**Frontend Framework & UI**
* **React 18** powered by **Vite** for ultra-fast development and build times.
* **Tailwind CSS** & **Radix UI** primitives for a robust, accessible, and highly customizable interface.
* **Framer Motion** for polished micro-animations and route transitions.
* **Lucide React** for consistent, clean iconography.

**State Management & Data Fetching**
* **Zustand** for lightweight global state management.
* **React Query (@tanstack/react-query)** for performant data synchronization, caching, and state hydration.
* **React Hook Form** for robust and validated form handling.

**Backend & Database Services**
* **Supabase** acting as the primary BaaS, providing PostgreSQL database infrastructure, Row Level Security, and Realtime subscriptions.
* **Express.js** providing a robust custom backend API server layered over the database.
* **bcryptjs** and **jsonwebtoken** for secure, custom authentication pathways.

**Data Visualization & Reporting**
* **Recharts** for beautiful and responsive administrator analytics.
* **jsPDF** & **html2canvas** for generating downloadable compliance and analytical reporting documents.

## 📦 Project Structure

```text
src/
├── components/   # Reusable UI components (buttons, modals, inputs)
├── contexts/     # React Context providers (Auth, Theme)
├── hooks/        # Custom React hooks (Data fetching, window size)
├── lib/          # Helper libraries and external service initializations
├── shared/       # Shared utility functions and constants
├── stores/       # Zustand state stores
└── modules/      # Feature-based domain boundaries
    ├── admin         # Oversight & analytics tools
    ├── auth          # Login, Register, Forgot Password
    ├── dashboard     # Unified dashboard layouts
    ├── delivery      # Delivery tracking and assignment
    ├── donor         # Donation posting and history
    ├── events        # Community event management 
    ├── feedback      # User ticketing and system feedback
    ├── legal         # ToS, Privacy Policy, Cookies
    ├── marketing     # Landing pages and 'About Us' 
    ├── matching      # Request & Donation correlation engine
    ├── notifications # Real-time alerts
    ├── profile       # User identity and settings
    ├── recipient     # Receiving and requesting workflows
    └── volunteer     # Task pipelines and scheduling 
```

## 💻 Running the App Locally

### Prerequisites
* Node.js (v18 or higher recommended)
* NPM or Yarn
* A Supabase project and Google Maps API key (for required `.env` variables)

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables. Duplicate the sample env file (if available) and fill your credentials:
   ```bash
   cp .env.example .env
   ```

3. Spin up the local development environment (This runs both the frontend Vite server and backend Express API concurrently):
   ```bash
   npm run dev
   ```
   * *The application will usually be available at `http://localhost:3000` (controlled in vite.config.js).*

### Production Build
To create a chunk-optimized production bundle:
```bash
npm run build
```

## 📜 License
This project is licensed under the [MIT License](LICENSE).
