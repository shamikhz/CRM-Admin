# FieldForce CRM System Architecture & Documentation

## Overview
The FieldForce CRM system is a dual-application, real-time ecosystem designed to manage, monitor, and empower field sales teams. It consists of two distinct web applications:
1. **CRM Admin Portal (`fieldforce-crm`)**: A comprehensive command center for managers and administrators to oversee operations, track KPIs, manage employees, and handle global data.
2. **Sales Executive Portal (`fieldforce-se`)**: A mobile-optimized, Progressive Web App (PWA) designed for field sales executives to track their daily tasks, log customer visits, manage orders, and report their real-time active status.

---

## 🛠️ Technology Stack (Shared)
Both applications share a modern, high-performance, and type-safe technology stack:

- **Core Framework**: **Next.js 14+ (App Router)** - Used for both SSR (Server-Side Rendering) and optimized client-side routing.
- **Language**: **TypeScript** - Ensures strict type-safety across data models (Users, Orders, Tasks, Customers).
- **Styling**: **Tailwind CSS** - Utility-first CSS framework for rapid, responsive, and consistent styling.
- **UI Architecture**: **Shadcn UI & Base UI** - Accessible, headless UI components (Dialogs, Dropdowns, Selects, Cards) heavily customized for a premium "glassmorphism" and modern aesthetic.
- **Animations**: **Framer Motion** - Used for smooth page transitions, micro-interactions, and staggered list loading animations.
- **Icons**: **Lucide React** - Clean, consistent SVG icon set.
- **State Management**: **Zustand** - Lightweight, fast global state management (e.g., handling global Notification counts and Authentication states).
- **Forms & Validation**: **React Hook Form + Zod** - Client-side form handling with strict schema-based data validation.
- **Backend & Database**: **Firebase (Firestore & Authentication)** - Serverless NoSQL database providing real-time data synchronization (`onSnapshot`), user authentication, and persistent cloud storage.

---

## 🏢 1. CRM Admin Portal (`fieldforce-crm`)

### Purpose
The Admin portal is built for desktop-first usage, offering deep analytical views, complex data grids, and complete CRUD (Create, Read, Update, Delete) control over the entire business ecosystem.

### Key Workflows & Features
- **Real-Time Data Sync**: Instead of traditional REST API polling, the Admin app uses Firebase's `onSnapshot` listeners. When an order is updated or an employee logs in from the field, the Admin dashboard updates instantly without a page refresh.
- **Live Employee Tracking**: Features a dynamic visual indicator (Green/Red dot) on employee avatars. This is directly tied to the `isActive` boolean in Firestore, which toggles automatically when an employee logs into or out of the SE app.
- **Defensive Rendering**: The UI is built to gracefully handle missing or undefined data structures (e.g., `order.products?.length || 0`), ensuring the app never crashes due to legacy or incomplete database records.

### Core Modules
1. **Dashboard Overview**: High-level KPIs, revenue charts, and active team metrics.
2. **Order Management**: Complex data tables to track order statuses (`pending`, `paid`, `delivered`). Allows admins to natively edit invoices, change payment statuses, or delete fraudulent orders directly from the grid.
3. **Employee/Team Management**: Complete control over the sales force. Admins can create new profiles which instantly provisions them a space in the Firestore database.
4. **Customer Database**: Central repository of all retail shops, distributors, and direct clients with mapped geographical regions.
5. **Global Notification System**: A persistent notification dropdown powered by Zustand and Firestore, allowing admins to "Mark as Read" (which updates the database directly) and tracks system alerts.

---

## 📱 2. Sales Executive Portal (`fieldforce-se`)

### Purpose
The Sales Executive (SE) app is a mobile-first Progressive Web App (PWA) designed to be used in the field. It focuses on simplicity, speed, and workflow efficiency.

### Key Workflows & Features
- **Authentication & Presence**: Uses Firebase Auth (`signInWithEmailAndPassword`). Upon successful login, a custom wrapper function automatically updates the user's `isActive` status in Firestore to `true`. Upon clicking logout, it updates to `false` before terminating the session.
- **Offline Capabilities (PWA)**: Implements a Service Worker (`sw.js`) and a `manifest.json` allowing the app to be installed directly to the home screen of a mobile device, caching critical static assets for poor network conditions.
- **Role-Based Access Control (RBAC)**: The login page strictly verifies the user's role. If an Admin tries to log in to the SE app, access is denied.

### Core Modules
1. **Login & Demo Access**: Secure login interface with a "Load Demo Executive" feature that auto-provisions a test account for rapid development and testing.
2. **SE Dashboard**: A personalized view showing the executive's specific daily targets, active visits, and pending tasks.
3. **Visit/Task Logging**: Allows the executive to check into a location, fill out visit reports, and submit them directly to Firestore, which immediately alerts the Admin portal.
4. **Order Entry**: A streamlined mobile form for executives to punch in new orders while standing in front of a customer.
5. **Profile Management**: Displays assigned region, personal stats, and the crucial secure "Logout" workflow.

---

## 🔄 Data Flow Architecture (How They Connect)

The two applications do not communicate with each other directly; instead, they use **Firebase Firestore** as a central nervous system.

1. **Write Operations**: When the SE app submits a new `Order`, it calls `setDoc` or `addDoc` to the `orders` collection in Firebase.
2. **Real-Time Propagation**: Firebase registers this write operation.
3. **Read Operations**: The Admin app, which has an active `onSnapshot` listener attached to the `orders` collection, instantly receives the new document payload.
4. **UI Update**: The React state (`setOrders`) is updated in the Admin app, triggering a UI re-render that dynamically adds the new row to the Orders table and updates the KPI revenue counters in milliseconds.

### Security & ID Management
A critical aspect of the architecture is the handling of Firebase Document IDs. When fetching data via `subscribeToCollection` or `getDocuments`, the system explicitly maps the true Firebase `doc.id` to the local object's `id` property **after** spreading the document data (`...doc.data()`). This guarantees that even if seeded mock data contains fake ID strings, the application will always use the true cryptographic Firebase ID for subsequent Update and Delete operations, ensuring absolute data integrity.
