# System Design

This document details the high-level system design of the LMS platform, focusing on infrastructure, scalability, caching strategies, and potential bottlenecks.

## High-Level Infrastructure

The platform is designed around a fully managed, serverless stack. This minimizes DevOps overhead and allows the system to scale from zero to massive traffic spikes instantly without manual intervention.

- **Hosting & Compute:** Vercel (Edge Network + Node.js Serverless Functions)
- **Database & Content API:** Sanity Content Data Lake
- **Authentication Provider:** Clerk (Edge-compatible JWKS)
- **Payment Gateway:** Stripe

## Component Design

### Frontend (Next.js App Router)
The frontend relies heavily on React Server Components (RSCs). By pushing rendering to the server:
- Client-side JavaScript bundles are kept extremely small.
- Sensitive environment variables and Sanity queries remain securely on the server.
- The UI can be aggressively cached at the CDN level.

### Backend (Serverless)
We do not maintain a persistent Node.js server. Instead, backend logic is executed ephemerally via Next.js Server Actions and Route Handlers.
- **Stateless:** Every function execution is independent. State is stored either in JWT cookies (Clerk) or in the Sanity Database.
- **Cold Starts:** Handled efficiently by Vercel's Edge network and Node 18+ fast execution environments.

### CMS / Database (Sanity)
Sanity is used as a unified data store. It holds both:
1. **Unstructured / Content Data:** Rich text (BlockContent), Videos, Images, Course descriptions.
2. **Relational / Transactional Data:** Students, Enrollments, Lesson Progress.

While unconventional to use a CMS for transactional data, Sanity's GROQ (Graph-Relational Object Queries) engine allows for highly complex joins and relational queries, making it highly effective for an LMS of this scale.

## Caching Strategy

Next.js 15 features an aggressive, multi-layered caching system.

1. **Request Memoization:** If the same GROQ query is fired multiple times during a single React render pass (e.g., in a Layout and a Page), Next.js automatically deduplicates the request.
2. **Data Cache:** Responses from Sanity's API are cached. 
3. **Full Route Cache:** Static pages (like the marketing homepage or public course listings) are compiled to HTML at build time and served instantly from Vercel's Edge CDN.

### Live Preview vs. Caching
To balance caching with real-time editing:
- Public visitors hit the cached CDN responses.
- Content editors triggering "Draft Mode" bypass the Data Cache and Full Route Cache entirely, fetching directly from the Sanity Content Lake on every request to see live updates.

## Scalability Considerations

The serverless architecture is inherently scalable. The primary considerations are API rate limits from third-party services.

### Strengths
- **Compute Scalability:** Vercel will automatically spin up thousands of concurrent serverless functions to handle traffic spikes.
- **Database Scalability:** Sanity's Global CDN is designed to serve high-throughput queries without the connection-pooling limits of traditional SQL databases.
- **Auth Scalability:** Clerk evaluates JWTs at the Edge, meaning authentication checks add zero latency to the main compute thread.

### Potential Bottlenecks

1. **Sanity API Rate Limits (Writes)**
   - Sanity has limits on concurrent mutations.
   - *Scenario:* If 10,000 students purchase a course at the exact same second, the Stripe Webhook route will attempt 10,000 simultaneous writes to create `Enrollment` documents.
   - *Mitigation:* Stripe webhooks automatically retry on 429 (Too Many Requests) or 500 errors. However, implementing a background queue (like Inngest or Upstash) between Stripe and Sanity would smooth out write spikes.

2. **Sanity API Rate Limits (Reads)**
   - If the Next.js cache is purged globally, a massive traffic spike could send thousands of identical read queries to Sanity.
   - *Mitigation:* Implement Next.js Incremental Static Regeneration (ISR) or `stale-while-revalidate` caching for heavy queries.

3. **Stripe Webhook Concurrency**
   - Vercel Serverless functions have a concurrency limit based on the pricing tier.
   - *Mitigation:* Ensure webhook processing is as lightweight as possible to free up the function quickly.

## Future Scaling Strategy

If the platform grows significantly, the following architectural shifts should be considered:

1. **Database Split:** Migrate transactional data (Students, Enrollments, Progress, Payments) to a dedicated PostgreSQL database (e.g., Supabase or Neon), while keeping Sanity strictly for Course Content. This separates read-heavy content queries from write-heavy transactional operations.
2. **Video Hosting:** Currently, videos are embedded from YouTube/Vimeo via `react-player`. If proprietary video hosting is required, integrate Mux or AWS MediaConvert to handle HLS adaptive bitrate streaming securely.
3. **Edge Middleware:** Move the course authorization gate (`checkCourseAccess`) out of the Server Component and into Vercel Edge Middleware using Edge-compatible database drivers (like Upstash Redis) to block unauthorized requests before they even spin up a serverless function.
