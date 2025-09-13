# Modern LMS Platform - Next.js 15 & Sanity CMS

A modern, feature-rich Learning Management System built with Next.js 15, Sanity CMS, Clerk, and Stripe. Features real-time content updates, course progress tracking, and secure payment processing.

## Features

### For Students

- 📚 Access to comprehensive course content
- 📊 Real-time progress tracking
- ✅ Lesson completion system
- 🎯 Module-based learning paths
- 🎥 Multiple video player integrations (YouTube, Vimeo, Loom)
- 💳 Secure course purchases
- 📱 Mobile-friendly learning experience
- 🔄 Course progress synchronization

### For Course Creators

- 📝 Rich content management with Sanity CMS
- 📊 Student progress monitoring
- 📈 Course analytics
- 🎨 Customizable course structure
- 📹 Multiple video hosting options
- 💰 Direct payments via Stripe
- 🔄 Real-time content updates
- 📱 Mobile-optimized content delivery

### Technical Features

- 🚀 Server Components & Server Actions
- 👤 Authentication with Clerk
- 💳 Payment processing with Stripe
- 📝 Content management with Sanity CMS
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 📱 Responsive design
- 🔄 Real-time content updates
- 🔒 Protected routes and content
- 🌙 Dark mode support

### UI/UX Features

- 🎯 Modern, clean interface
- 🎨 Consistent design system using shadcn/ui
- ♿ Accessible components
- 🎭 Smooth transitions and animations
- 📱 Responsive across all devices
- 🔄 Loading states with skeleton loaders
- 💫 Micro-interactions for better engagement
- 🌙 Dark/Light mode toggle

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn
- Stripe Account
- Clerk Account
- Sanity Account

### Environment Variables

Create a `.env.local` file with:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
# Read Token
SANITY_API_TOKEN=your-sanity-read-token
# Full Access Admin Token
SANITY_API_ADMIN_TOKEN=your-sanity-admin-token

# For Sanity Studio to read
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lms-platform

# Install dependencies
npm install

# Start the development server
npm run dev

# In a separate terminal, start Sanity Studio
npm run sanity:dev
```

### Setting up Sanity CMS

1. Create a Sanity account
2. Create a new project
3. Install the Sanity CLI:
   ```bash
   npm install -g @sanity/cli
   ```
4. Initialize Sanity in your project:
   ```bash
   sanity init
   ```
5. Deploy Sanity Studio:
   ```bash
   sanity deploy
   ```

### Setting up Clerk

1. Create a Clerk application
2. Configure authentication providers
3. Set up redirect URLs
4. Add environment variables

### Setting up Stripe

1. Create a Stripe account
2. Set up webhook endpoints
3. Configure payment settings
4. Set up webhook forwarding for local development:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe-checkout/webhook
   ```

## Architecture

### Content Schema

- Courses

  - Title
  - Description
  - Price
  - Image
  - Modules
  - Instructor
  - Category

- Modules

  - Title
  - Lessons
  - Order

- Lessons

  - Title
  - Description
  - Video URL
  - Content (Rich Text)
  - Completion Status

- Students

  - Profile Information
  - Enrolled Courses
  - Progress Data

- Instructors
  - Name
  - Bio
  - Photo
  - Courses

### Key Components

- Course Management System

  - Content creation and organization
  - Module and lesson structuring
  - Rich text editing
  - Media integration

- Progress Tracking

  - Lesson completion
  - Course progress calculation
  - Module progress visualization

- Payment Processing

  - Secure checkout
  - Course enrollment
  - Stripe integration

- User Authentication
  - Clerk authentication
  - Protected routes
  - User roles

## Usage

### Creating a Course

1. Access Sanity Studio
2. Create course structure with modules and lessons
3. Add content and media
4. Publish course

### Student Experience

1. Browse available courses
2. Purchase and enroll in courses
3. Access course content
4. Track progress through modules
5. Mark lessons as complete
6. View completion certificates

## Development

### Key Files and Directories

```
/app                    # Next.js app directory
  /(dashboard)          # Dashboard routes
  /(user)              # User routes
  /api                 # API routes
/components            # React components
/sanity                # Sanity configuration
  /lib                 # Sanity utility functions
  /schemas             # Content schemas
/lib                   # Utility functions
```

### Core Technologies

- Next.js 15
- TypeScript
- Sanity CMS
- Stripe Payments
- Clerk Auth
- Tailwind CSS
- Shadcn UI
- Lucide Icons

## Features in Detail

### Course Management

- Flexible course structure with modules and lessons
- Rich text editor for lesson content
- Support for multiple video providers
- Course pricing and enrollment management

### Student Dashboard

- Progress tracking across all enrolled courses
- Lesson completion status
- Continue where you left off
- Course navigation with sidebar

### Video Integration

- URL Video Player
- Loom Embed Support
- Responsive video playback

### Payment System

- Secure Stripe checkout
- Course access management
- Webhook integration
- Payment status tracking

### Authentication

- User registration and login
- Protected course content
- Role-based access control
- Secure session management

### UI Components

- Modern, responsive design
- Loading states and animations
- Progress indicators
- Toast notifications
- Modal dialogs




#### What You'll Learn:

- 📚 Comprehensive Full Stack Development Training
- 🎯 50+ Real-World Projects
- 🤝 Access to the PAPAFAM Developer Community
- 🎓 Weekly Live Coaching Calls
- 🤖 AI & Modern Tech Stack Mastery
- 💼 Career Guidance & Interview Prep

#### Course Features:

- ⭐ Lifetime Access to All Content
- 🎯 Project-Based Learning
- 💬 Private Discord Community
- 🔄 Regular Content Updates
- 👥 Peer Learning & Networking
- 📈 Personal Growth Tracking

## Support

For support, join our Discord community or email support@example.com

---

Built with ❤️ using Next.js, Sanity, Clerk, and Stripe
