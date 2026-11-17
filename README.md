# AI Reels Pro

AI Reels Pro is a Next.js application for creating short-form videos with
generative AI. Users can describe an idea, choose a visual style and duration,
and generate a video with an AI-written script, images, narration, and captions.

## Features

- Clerk authentication with protected dashboard routes
- AI-generated video scripts using Google Gemini
- AI-generated scene images with selectable styles
- Text-to-speech narration using Google Cloud
- Automatic captions using AssemblyAI
- Firebase Storage for generated audio and images
- Neon PostgreSQL database managed with Drizzle ORM
- 30 starting credits per user
- 10 credits consumed per generated video
- Video preview and saved video data in the dashboard

## Tech stack

- Next.js 16 App Router
- React 19
- Tailwind CSS
- Clerk
- Drizzle ORM and Neon
- Google Gemini and Google Cloud Text-to-Speech
- AssemblyAI
- Firebase Storage
- Remotion

## Requirements

- Node.js 20 or newer
- npm
- A Clerk application
- A Neon PostgreSQL database
- Google Gemini and Google Cloud credentials
- AssemblyAI credentials
- Firebase Storage with Firebase Admin credentials

## Installation

1. Clone the repository and enter the project directory:

   ```bash
   git clone <repository-url>
   cd ai-short-video-generator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add the required
   environment variables:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   NEXT_PUBLIC_DRIZZLE_DATABASE_URL=your_neon_database_url

   GEMINI_API_KEY=your_gemini_api_key
   IMAGEN_API_KEY=your_image_generation_api_key
   GOOGLE_API_KEY=your_google_cloud_api_key
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key

   # Use either the base64 service account option...
   FIREBASE_SERVICE_ACCOUNT=base64_encoded_service_account_json

   # ...or these three Firebase Admin variables:
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   ```

   Keep `.env.local` private. Do not commit API keys or service-account
   credentials.

4. Push the database schema:

   ```bash
   npm run db:push
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## How to use

1. Open the landing page and select **Get started**.
2. Create an account or log in with Clerk.
3. From the dashboard, choose **Create New Video**.
4. Select a topic:
   - A built-in story type, such as comedy or a bedtime story
   - **Custom Prompt** and enter your own idea
5. Choose a visual style, such as Realistic, Disney, Comics, Water Colors, or
   GTA.
6. Select a duration of 15 or 30 seconds.
7. Click **Create Video** and wait for the script, images, narration, and
   captions to finish generating.
8. Preview the generated video in the player dialog.

Each account starts with 30 credits. Every successfully saved video costs 10
credits. A user must have at least 10 credits to start generating a video.

## Available scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run lint      # Run ESLint
npm run db:push   # Push the Drizzle schema to the database
npm run db:studio # Open Drizzle Studio
```

## Project structure

```text
app/
  (auth)/          Clerk sign-in and sign-up pages
  api/              Video generation API routes
  dashboard/        Protected video creation and dashboard UI
  _context/         Shared client-side user and video state
  page.js           Public AI Reels Pro landing page
configs/
  db.js             Neon and Drizzle database client
  schema.js         Users and video data schema
  firebaseAdmin.js  Firebase Admin Storage configuration
proxy.js             Clerk middleware and dashboard protection
```

The Clerk middleware protects `/dashboard` and its nested routes. Unauthenticated
users are redirected to sign in before they can access dashboard content.
