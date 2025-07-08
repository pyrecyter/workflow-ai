# Workflow AI

This project was created using the Gemini CLI.

## About

This is a Next.js application that allows users to create and manage events. It includes user authentication, event creation, and a dashboard to view and manage events.

## Getting Started

### Prerequisites

- Node.js
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/workflow-ai.git
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```
3. Create a `.env.local` file by copying the `.env.example` file:
   ```bash
   cp .env.example .env.local
   ```
4. Edit the `.env.local` file and provide the required environment variables:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secret key for signing JWTs.
   - `NEXT_PUBLIC_API_URL`: The URL of your API. For local development, this will be `http://localhost:3000`.

### Running the Application

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.