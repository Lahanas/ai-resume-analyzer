# Resumind

An AI-powered resume analyzer. Upload a resume (and optionally a job title/description), and get back an ATS score plus structured feedback on tone & style, content, structure, and skills.

## How it works

- **Upload** — drop a PDF resume, optionally with a target company, job title, and job description. It's converted to an image for preview and stored.
- **Analyze** — the resume is sent to an AI model (Claude Sonnet) with a structured prompt asking for a JSON-formatted breakdown: an overall score, an ATS-compatibility score with tips, and category scores (tone & style, content, structure, skills) each with actionable tips.
- **Keyword match** — if a job description was provided, the resume's text is extracted client-side (via `pdfjs-dist`) and compared against the significant terms in the job description (stopword-filtered, frequency-ranked) to show a match percentage with which terms were found vs. missing.
- **Review** — see your resume next to its scorecard, with expandable sections for each category's detailed tips.
- **Track** — past submissions are listed on the home page with summary stats (total analyzed, average score, best score), and can be deleted individually.

## Stack

- React Router v7 (SSR framework mode), TypeScript, Vite
- TailwindCSS v4
- Zustand for client state
- [Puter.js](https://puter.com) for auth, file storage, key-value storage, and AI inference — no backend server or API keys to manage; everything runs client-side against Puter's free platform APIs
- `pdfjs-dist` for client-side PDF → image conversion and text extraction (resume preview + keyword matching)

## What's actually custom here

The auth/storage/AI plumbing comes from Puter.js. What's built on top of it:
- The upload flow, error handling, and status states
- The keyword-match feature (`app/lib/keywordMatch.ts`, `app/lib/resumeText.ts`) — extracting resume text and comparing it against job description terms, entirely client-side, no AI call involved
- The scorecard UI (gauges, accordions, badges) and the home dashboard stats

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. You'll be prompted to sign in via Puter (free, no setup required) before uploading a resume.

## Deployment

A `Dockerfile` is included for containerized deployment to any platform that supports Docker (AWS ECS, Google Cloud Run, Fly.io, etc.).
