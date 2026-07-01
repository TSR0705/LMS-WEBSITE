# Codebase Guide

Welcome to the team! This guide is designed to accelerate your onboarding and teach you how to navigate, read, and understand this codebase effectively.

This document will save you days of hunting through files.

---

## Where to Start Reading

If you want to trace how the application actually works, read the files in this exact order:

1. **`package.json`**: Understand the core dependencies (Next.js 15, Sanity, Stripe, Clerk, Tailwind).
2. **`middleware.ts`**: This is the front door. Look at how Clerk intercepts requests and defines public vs. protected routes.
3. **`sanity.config.ts` & `sanity/schemaTypes/index.ts`**: Understand the shape of the data. Everything flows from these schemas.
4. **`app/layout.tsx`**: The root layout. Notice how the `ClerkProvider` wraps the entire app, and where the `<SanityLive />` component is injected to handle real-time draft updates.
5. **`app/(dashboard)/layout.tsx`**: Look at how the dashboard navigation and user context are established.

---

## Important Folders

The codebase follows the standard Next.js App Router conventions with a few specific domain folders.

- **`app/`**: The routing layer. We use Route Groups (folders wrapped in parentheses like `(user)` and `(dashboard)`) to organize routes without affecting the URL path. This allows us to share layouts across specific sections.
- **`actions/`**: Contains Next.js Server Actions. These are functions that run securely on the server but can be called directly from client components (e.g., `createStripeCheckout.ts`).
- **`sanity/`**: Contains everything related to the CMS.
  - `sanity/schemaTypes/`: The database schemas.
  - `sanity/lib/`: Helper functions to fetch data (e.g., `getCourses.ts`, `getStudentByClerkId.ts`).
- **`components/`**: Reusable UI. Built mostly with Tailwind CSS and Radix UI primitives.

---

## How Data Moves (The Core Pattern)

We follow a strict **Server-First Data Fetching** pattern.

You will rarely see `useEffect` or `fetch` used on the client side to retrieve data.

### The Standard Pattern:
1. A **Server Component** (a `page.tsx` file) is requested.
2. The component awaits a data fetching function from `sanity/lib/`.
3. The component renders the data directly into the HTML.
4. If interactivity is needed, the Server Component passes the raw data down to a **Client Component** (marked with `"use client";`) as props.

**Example Flow (Lesson Page):**
```typescript
// app/(dashboard)/courses/[courseId]/lessons/[lessonId]/page.tsx
import { getLessonById } from "@/sanity/lib/courses/getLessonById";
import VideoPlayer from "@/components/VideoPlayer";

export default async function LessonPage({ params }) {
  // 1. Fetch data on the server
  const lesson = await getLessonById(params.lessonId);
  
  // 2. Render Server HTML
  return (
    <div>
      <h1>{lesson.title}</h1>
      {/* 3. Pass data to interactive Client Component */}
      <VideoPlayer url={lesson.videoUrl} />
    </div>
  );
}
```

---

## Important Components

### `<VideoPlayer />` (`components/VideoPlayer.tsx`)
This is a critical client component that wraps `react-player`. It is responsible for rendering YouTube/Vimeo URLs.
*Hidden Detail:* It utilizes a strict `useEffect` to ensure it only mounts after hydration. If this is removed, Next.js Turbopack will throw hydration mismatch errors because the server cannot pre-render the third-party iframe exactly as the client expects.

### `<SanityLive />` (`sanity/lib/live.ts` & `app/layout.tsx`)
This invisible component subscribes to Sanity's real-time event stream. When a content editor makes a change in the CMS, this component forces Next.js to invalidate its router cache and instantly update the UI.

---

## Important Schemas (`sanity/schemaTypes/`)

To understand the business logic, you must understand the relational mapping in Sanity:

- **`student`**: Maps a Clerk `userId` to a Sanity Document `_id`. This is the bridge between Auth and Data.
- **`course`**: Contains metadata, price, and an array of references to `module` documents.
- **`module`**: A structural folder inside a course containing references to `lesson` documents.
- **`lesson`**: The actual content (video URL, rich text, Loom links).
- **`enrollment`**: A transactional record linking a `student` reference to a `course` reference. 
- **`lessonCompletion`**: Tracks which student finished which lesson.

---

## Hidden Implementation Details & Conventions

### 1. The Enrollment Gate
Access to a course is not determined by a boolean on the User object. It is determined by the existence of an `Enrollment` document.
Look at `app/(dashboard)/courses/[courseId]/page.tsx`. Before rendering, it checks if an enrollment exists. If not, it redirects.

### 2. Stripe Webhook Reliability
In `app/api/stripe-checkout/webhook/route.ts`, the code relies heavily on `session.metadata`. 
When we create a Stripe session in `createStripeCheckout.ts`, we attach `courseId` and `userId` to the metadata. When Stripe fires the webhook back to our server, we read that metadata to know exactly who to enroll in what course. Never modify the checkout session without ensuring that metadata remains intact.

### 3. API Tokens
We use two distinct Sanity tokens:
- `SANITY_API_TOKEN`: Has strictly **READ-ONLY** permissions. Used for Live Fetching and Draft Preview.
- `SANITY_API_ADMIN_TOKEN`: Has **FULL ACCESS** permissions. Used ONLY in Server Actions and Webhooks to create Students and Enrollments. Never expose this to a client component.

### 4. Client vs Server Boundaries
Keep client components (`"use client"`) as small as possible and at the absolute bottom of the component tree. Pass data into them as props. Do not import `sanity/lib/` fetching functions into client components.

Welcome aboard. Read the code, break things locally, and ask questions!
