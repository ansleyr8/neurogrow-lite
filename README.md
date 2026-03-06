# NeuroGrow Lite

NeuroGrow Lite is a small full-stack feature built with Next.js and TypeScript that allows users to browse developmental milestones by category and recommended age.

This project was completed as part of a technical assessment focused on:

- React + Next.js
- TypeScript
- API and data integration
- Code structure and maintainability
- Accessibility and user experience

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Mock API (in-memory data)
- PostgreSQL schema design (documented below)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000/milestones] with your browser to see the result.



This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## PostgreSQL Schema Design

In a production version of NeuroGrow Lite, milestone data could be stored in a PostgreSQL database. 

### Table: `milestones`

```sql
CREATE TABLE milestones (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    recommended_age INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### SQL Queries

#### Filter by category

```sql
SELECT *
FROM milestones
WHERE category = 'Cognitive';
```

#### Filter by age

```sql
SELECT *
FROM milestones
WHERE recommended_age <= 5;
```

#### Filter by category and age

```sql
SELECT *
FROM milestones
WHERE category = 'Motor'
    AND recommended_age <= 5
ORDER BY recommended_age DESC;
```

The `ORDER BY recommended_age DESC` ensures milestones closest to the selected age appear first, matching the frontend sorting logic.


## Assumptions & Design Decisions

### 1. Age Representation
- Milestones use `recommendedAge` in years.
- Assumed age range: 0-18 years.
- Age filtering uses `recommendedAge <= selectedAge` to represent milestones appropriate for a child up to that age.
- Results are sorted descending so milestones closest to the entered age appear first.

### 2. Filtering Behavior
- Category filtering works independently of age.
- Age is optional.
- If age input is invalid or outside the 0-18 range, a validation message is shown and filtering is not applied.
- Sorting logic matches backend SQL (`ORDER BY recommended_age DESC`).

### 3. Mock API vs Database
- Used in-memory mock data for the 2-hour assessment constraint.
- PostgreSQL schema and SQL queries are documented to demonstrate backend design understanding.
- In production, this would be replaced with a REST or GraphQL API backed by PostgreSQL.

### 4. Accessibility Considerations
- Skip-to-content link for keyboard users.
- `aria-live` regions for dynamic updates.
- Visible focus states for interactive elements.
- Semantic HTML structure (`h1`, `h3`, `article`).
- Text-to-speech support via browser SpeechSynthesis API.
- High-contrast text and soft background colors.

### 5. UI & Visual Design Decisions
- Minimalist, healthcare-oriented layout.
- Calm color palette with indigo accents.
- Soft color-coded category badges for quick visual scanning.
- Card-based layout for cognitive clarity.
- SaaS-style summary strip displaying result count and active filters.

### 6. Text-to-Speech Design
- Each milestone includes a Listen button.
- Speech content includes title, age, and category.
- Existing speech is cancelled before new playback to prevent overlap.
- Edge case for older browser that dont support web speech api

### 7. Scalability Considerations
- Project structured using modular folders: components, types, utils, data.
- Filter logic extracted into a reusable utility.
- Types centralized for maintainability.
- Easily extendable to user-specific milestone tracking in the future.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
