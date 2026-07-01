# API Reference

This document outlines the exposed API routes and internal Server Actions used by the LMS.

Because the architecture utilizes Next.js App Router Server Actions, most data fetching and mutation bypass traditional REST API structures in favor of type-safe RPC (Remote Procedure Call) functions.

---

## 1. Stripe Webhook Endpoint

### `POST /api/stripe-checkout/webhook`

**Purpose:** 
Receives asynchronous event notifications from Stripe. Currently listens exclusively for `checkout.session.completed` to provision course access by creating an Enrollment document in Sanity.

**Authentication:**
Secured via Stripe Signature validation using `STRIPE_WEBHOOK_SECRET`. This route bypasses Clerk authentication.

**Request:**
- **Body:** Raw text payload from Stripe containing the Event object.
- **Headers:** Must include `stripe-signature`.

**Response:**
- `200 OK`: Event processed successfully.
- `400 Bad Request`: Missing signature, signature verification failed, or missing metadata.
- `500 Internal Server Error`: Server mutation failure.

**Related Files:**
- `app/api/stripe-checkout/webhook/route.ts`
- `sanity/lib/student/createEnrollment.ts`

---

## 2. Draft Mode Toggles

These routes interact with the Next.js Draft Mode API to toggle the caching layer, allowing content editors to view unpublished Sanity content.

### `GET /api/draft-mode/enable`

**Purpose:** Enables Draft Mode by setting a secure cookie on the user's browser.
**Authentication:** Requires a valid Sanity Presentation URL secret (automatically handled by the Studio).
**Response:** `Redirect` back to the referring URL.
**Related Files:** `app/api/draft-mode/enable/route.ts`

### `GET /api/draft-mode/disable`

**Purpose:** Disables Draft Mode and purges the secure cookie, returning the user to the cached production view.
**Authentication:** Public.
**Response:** `Redirect` to `/`.
**Related Files:** `app/api/draft-mode/disable/route.ts`

---

## 3. Core Server Actions (Internal RPCs)

Server Actions act as POST API endpoints automatically managed by Next.js. They are invoked directly from Client Components.

### `createStripeCheckout(courseId: string, userId: string)`

**Purpose:** 
Validates a user's intent to purchase a course, ensures a Student record exists in Sanity, and generates a Stripe Checkout session URL.

**Method:** `POST` (Abstracted via Server Action)

**Authentication:** 
Executes securely on the server. Relies on the caller passing a valid `userId` provided by the `useAuth()` Clerk hook.

**Logic Flow:**
1. Queries the full Course document from Sanity.
2. Queries the User details from Clerk.
3. Syncs the User to the Sanity `student` schema via `createStudentIfNotExists`.
4. If the course price is `0`, bypasses Stripe entirely, creates the Enrollment directly, and returns a redirect URL to the course.
5. If the course has a price, creates a Stripe Checkout session, embedding `courseId` and `userId` into the `metadata` object.
6. Returns the Stripe Session URL.

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Errors:**
- Throws Error if Course is not found.
- Throws Error if User details cannot be fetched.

**Related Files:**
- `actions/createStripeCheckout.ts`

---

*(Note: Data fetching, such as retrieving courses or lessons, is handled directly in React Server Components via the `sanityFetch` utility, and therefore does not expose an accessible HTTP API route.)*
