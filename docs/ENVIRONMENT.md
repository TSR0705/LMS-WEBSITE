# Environment Variables Reference

This document catalogs every environment variable required to run, build, and deploy the LMS.

The system relies on variables across three primary domains: Sanity (CMS), Stripe (Payments), and Clerk (Authentication).

> [!WARNING]  
> Never commit `.env.local` to version control. If a secret is leaked, rotate it immediately in the respective provider's dashboard.

---

## Sanity (CMS)

### `NEXT_PUBLIC_SANITY_PROJECT_ID`
- **Purpose:** Identifies your specific Sanity project instance.
- **Required:** Yes
- **Context:** Client and Server (Safe to expose to the browser).

### `NEXT_PUBLIC_SANITY_DATASET`
- **Purpose:** Specifies which dataset to query (usually `production`).
- **Required:** Yes
- **Context:** Client and Server.

### `SANITY_API_TOKEN`
- **Purpose:** Provides read access to unpublished/draft documents. Required for the Live Preview functionality to work in the Studio.
- **Required:** Yes (for draft preview functionality).
- **Context:** **SERVER ONLY.** Do not prefix with `NEXT_PUBLIC_`.
- **Security:** Leaking this allows unauthorized read access to unreleased course content.

### `SANITY_API_ADMIN_TOKEN`
- **Purpose:** Provides full read/write access to the Sanity Database. Used exclusively by Server Actions and Webhooks to create `Student` and `Enrollment` documents.
- **Required:** Yes.
- **Context:** **SERVER ONLY.**
- **Security:** Critical. Leaking this allows total control over your database.

### `SANITY_STUDIO_PROJECT_ID` & `SANITY_STUDIO_DATASET`
- **Purpose:** Specifically configures the embedded Sanity Studio (`/studio`). 
- **Required:** Optional (Falls back to `NEXT_PUBLIC_...` versions if omitted).
- **Context:** Client and Server.

---

## Platform Routing

### `NEXT_PUBLIC_BASE_URL`
- **Purpose:** Defines the root URL of the application. Used heavily in Stripe Checkout to construct the `success_url` and `cancel_url` redirect paths.
- **Required:** Yes (for local development).
- **Default:** `http://localhost:3000` locally.
- **Context:** Client and Server.
- **Note:** In production on Vercel, the application dynamically utilizes `VERCEL_PROJECT_PRODUCTION_URL`, making this variable strictly necessary for local environments.

---

## Stripe (Payments)

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Purpose:** Initializes the Stripe client for frontend interactions (if any). Currently primarily used to identify the connected Stripe account.
- **Required:** Yes.
- **Context:** Client and Server.

### `STRIPE_SECRET_KEY`
- **Purpose:** Authenticates Server Actions to create Stripe Checkout Sessions.
- **Required:** Yes.
- **Context:** **SERVER ONLY.**
- **Security:** Critical. Leaking this allows attackers to initiate financial transactions or read financial data.

### `STRIPE_WEBHOOK_SECRET`
- **Purpose:** Used to cryptographically verify that incoming `POST` requests to the webhook route actually originated from Stripe.
- **Required:** Yes (Payments will succeed, but enrollments will fail to provision without this).
- **Context:** **SERVER ONLY.**
- **Security:** If leaked, an attacker could spoof webhooks and grant themselves free access to paid courses.

---

## Clerk (Authentication)

### `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Purpose:** Injects the Clerk frontend UI components (Sign In, User Button) and handles Edge authentication checks.
- **Required:** Yes.
- **Context:** Client and Server.

### `CLERK_SECRET_KEY`
- **Purpose:** Authenticates calls to the Clerk Backend API (e.g., retrieving user profile details during checkout).
- **Required:** Yes.
- **Context:** **SERVER ONLY.**
- **Security:** Critical. Leaking this exposes user identity data.
