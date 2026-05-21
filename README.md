# FieldForce CRM

A premium, enterprise-grade mobile-first web application designed for comprehensive field sales management, real-time team tracking, and administrative oversight. Built with Next.js 16, React, Tailwind CSS, Base UI, and Firebase.

## Features

- **Real-Time Dashboard**: Monitor key performance indicators (KPIs), revenue growth, order distribution, and team attendance in a dynamic, widget-based dashboard.
- **Team & Employee Management**: Live tracking of field executives, activity feeds, battery/network statuses, and role-based access control.
- **Customer & Order Pipeline**: Comprehensive view of customer data, order lifecycle (pending, dispatched, delivered), payment tracking, and invoicing.
- **Task Management**: Create, assign, and track tasks for field teams with robust filtering (priority, status) and strict due-date management.
- **Analytics & Reports**: Visualized reporting across regions, revenue vs target comparisons, and historical performance using Recharts.
- **Responsive "Web View" Architecture**: Optimized for desktop rendering while strictly maintaining mobile-first UI proportions (perfect for embedding within hybrid mobile apps or PWAs).
- **Firebase Firestore Integration**: Complete integration with a real-time NoSQL cloud database for instantaneous cross-device synchronization and robust offline-first capabilities.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Base UI](https://base-ui.com/) / [Shadcn UI](https://ui.shadcn.com/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

## Getting Started

### Prerequisites

Ensure you have Node.js 18+ installed.

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/shamikhz/CRM-Admin.git
   cd fieldforce-crm
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables
   Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app` - Next.js App Router pages (Dashboard, Auth, etc.)
- `/src/components` - Reusable UI components, forms, and layout wrappers.
- `/src/firebase` - Firebase initialization and generic Firestore CRUD utilities.
- `/src/store` - Zustand stores for global state management (Auth, UI, Notifications).
- `/src/types` - Global TypeScript interfaces and type definitions.
- `/src/lib` - Utility functions and mock data generation.

## License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.
