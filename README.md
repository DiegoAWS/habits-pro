# Habits Pro - Gamified Habit Tracker 🎯

A gamified habit tracker app that helps users develop habits through scheduling, task completion tracking, and visual streak representations.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or bun
- Supabase account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habits-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Create a `habits` table with the following columns:
     - `id` (uuid, primary key)
     - `name` (text)
     - `schedule` (text)
     - `streak` (integer)
     - `last_completed` (date)
     - `created_at` (timestamp with timezone)

5. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

## 📋 Project Manifest

### 🎯 Overview
This document outlines the steps to build a Minimum Viable Product (MVP) for a gamified habit tracker app. The app aims to help users develop habits through scheduling, task completion tracking, and visual streak representations (e.g., images or icons showing streak lengths). The MVP will be built in under 2 hours, relying heavily on AI for code generation and guidance.

### 🛠️ Tech Stack
- **Frontend**: React (with TypeScript)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (for database and storage; anonymous access only, no auth for MVP)
- **Additional**: Local storage for temporary data if needed, but prioritize Supabase for persistence

### ✨ Key Features (MVP Scope)
- ✅ Create, view, and delete habits
- 📅 Schedule habits (e.g., daily or weekly recurrence)
- ✅ Mark habits as completed for the day
- 🔥 Display streak counters with simple images (e.g., chain icons or badges that change based on streak length)
- 🌐 No authentication; data is public/anonymous (auth to be added later)
- 📱 Simple UI: Dashboard with habit list, completion buttons, and streak visuals

### 📝 Assumptions and Constraints
- MVP focuses on core functionality; no advanced features like notifications or sharing
- Use AI (e.g., Grok or similar) to generate boilerplate code, components, and integrations
- Total time: 2 hours – allocate ~30min for setup, ~1h for implementation, ~30min for testing/debugging
- Skip complex error handling; focus on happy paths
- Streak images: Use free icons (e.g., from Heroicons or simple SVG) or placeholders; store/upload via Supabase if needed

### ⏰ High-Level Timeline
- **Setup** (20-30min)
- **UI Components** (30-40min)
- **Backend Integration** (20-30min)
- **Functionality and Testing** (20-30min)

## 🚀 Step-by-Step Development Plan

### Step 1: Project Setup (20-30 minutes) ⚙️

**Create a new React app with TypeScript:**
```bash
npx create-react-app habit-tracker --template typescript
```

**Install dependencies:**
- Tailwind CSS: Follow official setup (add tailwindcss, postcss, autoprefixer; configure tailwind.config.js and postcss.config.js)
- Supabase client: `npm install @supabase/supabase-js`
- Any UI helpers: Optionally react-icons for streak visuals

**Initialize Supabase:**
- Sign up for a free Supabase project if not already done
- Get Supabase URL and anon key from the dashboard
- Create a `.env` file with `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`
- Set up a Supabase table: `habits` with columns like `id` (uuid), `name` (text), `schedule` (text, e.g., "daily"), `streak` (int), `last_completed` (date)

**Clean up default React files:** Remove unnecessary components and styles
**Test setup:** Run the app (`npm start`) and ensure Tailwind works (e.g., add a styled div)

### Step 2: Design and Build UI Components (30-40 minutes) 🎨

**Main Layout:** Create a simple dashboard page with header (app title), habit list, and add habit form

**Components:**
- **HabitForm**: Form to add new habit (inputs: name, schedule type dropdown – daily/weekly)
- **HabitList**: List of habits, each as a card showing name, schedule, current streak (with image/icon), and a "Complete Today" button
- **StreakVisualizer**: Component that renders an image or icon based on streak count (e.g., bronze for 1-3, silver for 4-7; use SVGs or emojis as placeholders)

**Use Tailwind for styling:** Responsive, mobile-first; keep it minimal (e.g., cards with shadows, buttons with hover effects)
**State Management:** Use React hooks (useState, useEffect) for local state; fetch habits on mount
**AI Assistance:** Generate component skeletons via AI prompts (e.g., describe the component and stack)

### Step 3: Integrate Backend with Supabase (20-30 minutes) 🔗

**Create a Supabase client instance** in a utility file (e.g., `supabaseClient.ts`)

**CRUD Operations:**
- **Fetch habits**: `supabase.from('habits').select('*')`
- **Add habit**: `supabase.from('habits').insert({ name, schedule, streak: 0, last_completed: null })`
- **Update completion**: On button click, check if today > last_completed, increment streak if consecutive, update streak and last_completed
- **Delete habit**: `supabase.from('habits').delete().eq('id', id)`

**Handle streaks:** Simple logic – compare current date with last_completed; if consecutive, streak++, else reset to 1
**Streak Images:** If using Supabase storage, upload placeholder images (e.g., streak1.png, streak5.png); otherwise, use local assets or URLs
**Error Handling:** Basic (console logs); no toasts/UI errors for MVP
**AI Assistance:** Prompt AI for Supabase integration code snippets

### Step 4: Implement Core Functionality and Testing (20-30 minutes) 🧪

**Wire up components:**
- **On app load**: Fetch and display habits
- **Add habit**: Submit form, insert to Supabase, refresh list
- **Complete habit**: Update in Supabase, recalculate streak, update UI
- **Display streaks**: Conditionally render images based on streak value (e.g., if streak > 5, show fire icon)

**Scheduling:** For display only in MVP (e.g., show "Daily" tag); no automated reminders

**Testing:**
- **Manual**: Add habit, complete it multiple days (mock dates if needed), check streak updates and images
- **Edge cases**: Reset streak if skipped day, delete habit
- **Debug**: Use browser console; fix any Supabase connection issues

**Polish:** Ensure UI is responsive; add basic animations if time allows (e.g., via Tailwind transitions)
**Future Additions:** Note auth integration (Supabase auth) for v2

## ⚠️ Risks and Mitigations

- **Time Overrun**: Prioritize core (habit CRUD + streaks) over polish
- **Supabase Issues**: If anon access fails, fallback to local storage
- **AI Dependency**: Craft clear prompts; manually tweak generated code
- **Date Handling**: Use Date objects carefully for streak calculations (consider libraries like date-fns if installed, but avoid new installs)

## 🔮 Next Steps After MVP

- 🔐 Add auth (Supabase email/password or social)
- 🏆 Enhance gamification (points, levels)
- 📱 Mobile optimization or PWA
- 🚀 Deploy (e.g., Vercel/Netlify)

This plan ensures a focused, achievable MVP. Use the following prompt to generate initial code prototypes via AI.