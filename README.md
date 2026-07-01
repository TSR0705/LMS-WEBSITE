# LMS Platform

An enterprise-grade Learning Management System (LMS) built for high performance, secure content delivery, and seamless student enrollment.

## Project Overview

This repository houses a modern, scalable LMS that provides content creators with a platform to sell and deliver video-based courses. It bridges a Headless CMS (Sanity) with a modern React framework (Next.js App Router) to deliver extremely fast, dynamically rendered pages. 

### Problem Statement

Creators need a platform to monetize educational video content without managing complex infrastructure, database provisioning, or payment processing pipelines. This system solves that by providing a fully integrated stack: CMS for content authoring, secure authentication for access control, and automated payment webhooks for enrollment provisioning.

### Key Features

- **Dynamic Content Management:** Course creation, lesson organization, and video embedding powered by Sanity CMS.
- **Secure Authentication:** Identity management and protected routes via Clerk.
- **Automated Enrollments:** Seamless integration with Stripe Checkout and webhooks for real-time course access provisioning.
- **Progress Tracking:** Lesson completion tracking for students.
- **Live Preview:** Real-time draft content preview via Sanity Live Fetching.
- **Admin Studio:** Embedded Sanity Studio for managing content without leaving the application.

## Tech Stack

- **Framework:** [Next.js 15.3.9](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **CMS / Database:** [Sanity](https://www.sanity.io/)
- **Payments:** [Stripe](https://stripe.com/)
- **Video Delivery:** `react-player` (v2.16.0)

## Architecture Overview

The system utilizes a modern Serverless architecture optimized for Edge delivery:
1. **Frontend:** React Server Components (RSCs) pre-render heavy UI and Sanity queries on the server, shipping minimal JavaScript to the client.
2. **Backend/API:** Next.js Route Handlers (`app/api`) and Server Actions manage mutations and webhook processing.
3. **Data Layer:** Sanity acts as the primary database, storing structured content (Courses, Lessons) and transactional data (Students, Enrollments, Progress).
4. **Auth Layer:** Clerk Middleware protects the Dashboard and API routes, intercepting requests before they hit the server.

For deep dives into the system design, see [ARCHITECTURE.md](docs/ARCHITECTURE.md) and [SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md).

## Repository Structure

```text
├── actions/             # Next.js Server Actions (e.g., Stripe Checkout)
├── app/                 # Next.js App Router (Pages, Layouts, API Routes)
│   ├── (admin)/         # Sanity Studio Route Group
│   ├── (dashboard)/     # Protected Student Dashboard
│   ├── (user)/          # Public Marketing / Course Browsing
│   └── api/             # API Route Handlers (Webhooks, Draft Mode)
├── components/          # Reusable UI Components (Radix + Tailwind)
├── docs/                # Architecture and System Documentation
├── lib/                 # Shared utilities (Base URL, Stripe Client)
├── sanity/              # Sanity Schema, Queries, and Live Fetching
└── middleware.ts        # Clerk Authentication Middleware
```

For onboarding and codebase navigation, refer to the [CODEBASE_GUIDE.md](docs/CODEBASE_GUIDE.md).

## Installation

### Prerequisites
- Node.js 18+ (20+ recommended)
- `npm` (or `pnpm`/`yarn`/`bun`)

```bash
# Clone the repository
git clone https://github.com/TSR0705/LMS-WEBSITE.git
cd LMS-WEBSITE

# Install dependencies (Legacy peer deps required for specific Clerk/Next compatibilities)
npm install --legacy-peer-deps
```

## Environment Variables

Copy the provided example file to create your local environment configuration:

```bash
cp .env.example .env.local
```

You must populate this file with keys from Sanity, Clerk, and Stripe. See [ENVIRONMENT.md](docs/ENVIRONMENT.md) for a detailed breakdown of each required variable.

## Running Locally

1. Start the Next.js development server with Turbopack:
   ```bash
   npm run dev
   ```
2. The application will be available at `http://localhost:3000`.
3. The Admin CMS (Sanity Studio) is available at `http://localhost:3000/studio`.

*(Optional)* To test Stripe webhooks locally, forward them to your local server:
```bash
stripe listen --forward-to localhost:3000/api/stripe-checkout/webhook
```

## Production Deployment

This application is configured for zero-config deployment on **Vercel**. 

Standard deployment commands:
- **Build Command:** `next build --turbopack`
- **Install Command:** `npm install`

For a step-by-step production rollout guide, including Webhook and CORS configuration, read [DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Important Concepts

- **Draft Mode:** The application utilizes Next.js Draft Mode combined with `next-sanity/live` to allow content editors to see unpublished changes in real-time without rebuilding the site.
- **Server Actions:** We use Server Actions (e.g., `actions/createStripeCheckout.ts`) over standard API routes for internal mutations to ensure type-safety and tight integration with React forms.
- **Enrollment Gates:** Access to lesson content is strictly guarded by querying Sanity for an `Enrollment` document linking the active Clerk User ID to the requested Course ID.

## Security Notes

- **Token Safety:** Never expose `SANITY_API_TOKEN` or `SANITY_API_ADMIN_TOKEN` to the client. The application uses these exclusively in Server Components and Route Handlers.
- **Webhook Verification:** The Stripe webhook route explicitly verifies incoming signatures using `STRIPE_WEBHOOK_SECRET` to prevent spoofed payment confirmations.

## Performance Notes

- **Caching:** Sanity queries leverage Next.js fetch caching.
- **Hydration:** Heavy client-side components like `VideoPlayer` are optimized to avoid hydration mismatches by ensuring they only mount after the initial client render.

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, branch strategy, and pull request process.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.
