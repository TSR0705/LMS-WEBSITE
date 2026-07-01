# Deployment Guide

This guide covers everything required to deploy the LMS to production on Vercel and configure the surrounding external services.

Because the system relies heavily on webhook coordination and Edge rendering, configuration MUST be precise.

---

## 1. Vercel Deployment

The repository is built strictly for Next.js App Router, making Vercel the optimal zero-configuration hosting provider.

### Initial Setup
1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and click **Add New... > Project**.
3. Import your GitHub repository.
4. Leave the Build (`next build --turbopack`) and Install Commands (`npm install`) as their defaults.
5. Expand the **Environment Variables** section. You must copy every key from your `.env.local` file (Except `NEXT_PUBLIC_BASE_URL`).
6. Click **Deploy**.

*(Note: Vercel automatically maps `VERCEL_PROJECT_PRODUCTION_URL` to the `baseUrl` helper inside `lib/baseUrl.ts`, meaning you do not need to manually configure base URLs for production).*

---

## 2. Clerk Configuration (Authentication)

Clerk must be told where your production application lives so it can route users back after OAuth flows.

1. Navigate to the [Clerk Dashboard](https://dashboard.clerk.com/).
2. Go to **Domains & URLs**.
3. Update the **Application URL** to your new Vercel production domain (e.g., `https://your-app.vercel.app`).
4. Ensure your Vercel Environment Variables contain the **Live** (Production) keys, not the *Test* keys, if you are launching publicly.

---

## 3. Stripe Configuration (Payments & Webhooks)

Stripe requires two main configurations: API Keys and a Webhook Endpoint.

### Generating Live Keys
1. In the [Stripe Dashboard](https://dashboard.stripe.com/), toggle off "Test Mode".
2. Copy your Publishable Key and Secret Key into Vercel as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`.

### Configuring the Webhook
This is the most critical step. If the webhook is not configured, users will pay for courses but never receive access.

1. Go to the Stripe **Developers > Webhooks** tab.
2. Click **Add an endpoint**.
3. Set the Endpoint URL to: `https://<YOUR_VERCEL_DOMAIN>/api/stripe-checkout/webhook`
4. Under "Select events to listen to", select exactly **`checkout.session.completed`**.
5. Click **Add endpoint**.
6. On the resulting page, click **Reveal** under "Signing secret". 
7. Copy this secret into your Vercel Environment Variables as `STRIPE_WEBHOOK_SECRET`.
8. Go to Vercel > Deployments and **Redeploy** to inject the new secret.

---

## 4. Sanity Configuration (CMS & CORS)

For the Sanity Studio (`/studio`) to function properly on a deployed domain, you must whitelist the domain in Sanity's CORS settings.

1. Navigate to the [Sanity Manage Dashboard](https://www.sanity.io/manage).
2. Select your Project and go to the **API** tab.
3. Under **CORS Origins**, click **Add CORS origin**.
4. Enter your Vercel production domain.
5. **CRITICAL:** Check the box for **Allow credentials**. (Without this, editors will not be able to log into the Studio).
6. Click **Save**.

---

## 5. Verification Checklist

Once all services are configured, open an incognito window and perform these smoke tests:

- [ ] **Public Routing:** Verify you can access the homepage and course list without being redirected to a login screen.
- [ ] **Authentication:** Click Sign In, create an account, and ensure you are correctly routed back to `/my-courses`.
- [ ] **Authorization (Negative Test):** Attempt to directly access a lesson URL for a course you have not purchased. You should be redirected away.
- [ ] **Payment Flow:** Click "Enroll" on a course. Verify it takes you to Stripe Checkout with the correct Price and Image.
- [ ] **Webhook Provisioning:** Complete the payment. Verify Stripe redirects you to the course page, and that the course is now unlocked (proving the webhook successfully hit Sanity).
- [ ] **Admin Access:** Navigate to `/studio`, log in with your Sanity credentials, and verify you can edit a Draft and see it update live on the frontend.

## Common Deployment Issues

- **Course is paid for but not unlocked:** Your `STRIPE_WEBHOOK_SECRET` in Vercel does not match the one provided by the Stripe Dashboard. Check the Vercel Runtime Logs for `Webhook signature verification failed`.
- **Sanity Studio is stuck on a blank screen:** You forgot to add your Vercel domain to the Sanity CORS origins, or you forgot to check "Allow credentials".
- **Clerk loops on login:** The Application URL in the Clerk dashboard is incorrect.
