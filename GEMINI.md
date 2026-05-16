# EduDash

## Project Overview
EduDash is a modern, interactive educational dashboard built with React and Vite. It is designed to assist teachers in managing classes and provide AI-powered pedagogical tools.

**Main Features:**
- **Class & Student Management:** Interface to manage classes, add students, and share documents (PDF, Word, Images, etc.).
- **Classroom Tools:** A suite of widgets including a Timer, Sonometer (Noise Meter), Random Picker for students, and a Group Maker.
- **AI Studio:** Integrates with the Gemini API to automatically generate pedagogical content such as Multiple Choice Quizzes, Flashcards, and simplified summaries of course materials.
- **Theming System:** An advanced customization modal (ZenThemeModal) allowing users to switch between light/dark modes and configure dynamic Material You-style color gradients.

**Technologies & Tech Stack:**
- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (with custom Material You and CSS variables logic in `App.jsx`)
- **Icons:** Lucide React
- **Linting:** ESLint
- **AI Integration:** Google Generative AI (Gemini API)

## Building and Running
The project uses `npm` as its package manager. Below are the primary scripts defined in `package.json`:

- **Development Server:** Start the app locally with Hot Module Replacement (HMR).
  ```bash
  npm run dev
  ```
- **Production Build:** Build the app for production.
  ```bash
  npm run build
  ```
- **Preview Build:** Preview the production build locally.
  ```bash
  npm run preview
  ```
- **Linting:** Run ESLint to check for code issues.
  ```bash
  npm run lint
  ```
- **Deployment:** Deploy the application to GitHub Pages.
  ```bash
  npm run deploy
  ```

## Development Conventions
- **Single-File Architecture (Current State):** The current implementation heavily relies on a monolithic `src/App.jsx` file which contains multiple components (Widgets, Feed, AI Studio, Modal). As the project grows, it is highly recommended to split these components into the dedicated `src/components/` directory for better maintainability.
- **Styling:** The project mixes Tailwind CSS utility classes with custom CSS defined in `src/App.jsx` (e.g., `materialThemeStyles`) to handle dynamic theming and gradients.
- **State Management:** Standard React Hooks (`useState`, `useEffect`, `useRef`) are used extensively for local and shared state management.
- **Local Storage:** The Gemini API key and model preferences are persisted in the browser's `localStorage` (`eduDash_apiKey`, `eduDash_model`).