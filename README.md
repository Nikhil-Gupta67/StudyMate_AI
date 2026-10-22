# StudyMate AI — Updated Tailwind Edition

React + Vite + Tailwind CSS v4 frontend and Node.js + Express backend. Includes a sign-in/register page, per-user assignments, a Study Space menu with logout, clickable voice controls, spoken responses, and an experimental “Hello Alexa” browser wake phrase.

## Requirements
- Node.js 20 LTS or newer recommended
- Google Chrome or Microsoft Edge for browser speech recognition

## Run on Windows

Open the project root (`studymate-ai-updated`) in VS Code.

### Terminal 1 — frontend
```powershell
npm install
npm run dev
```
Open `http://localhost:5173`.

### Terminal 2 — backend
```powershell
cd backend
npm install
npm run dev
```
The backend should print `StudyMate API running at http://localhost:3001`.

Then refresh the frontend. Register with your name, email, and a password of at least 6 characters. Sign in next time using the same account.

## Voice commands
- Click **Talk to StudyMate**, allow microphone access, and say: “add mathematics homework”
- Other examples: “show my tasks”, “how many assignments do I have?”, “hello StudyMate”
- Click **Enable “Hello Alexa”** (or open the Study Space menu) to experiment with the wake phrase. Say “Hello Alexa”, wait for the spoken prompt, then say a task, such as “add science homework”.
- The tab must remain open and awake. Browser recognition can be inconsistent and may require microphone permission and an internet connection. It is not an always-on assistant and is not an Amazon Alexa/Alexa+ integration.

## Notes
- Accounts and tasks are stored locally in `backend/data/` as JSON. This is a learning prototype, not production authentication or secure hosting.
- The fallback JWT secret is for local development only. Configure `JWT_SECRET` before deploying anywhere.
- If voice recognition doesn't work, use a current version of Chrome/Edge and check the site microphone permissions.
- To check backend status, visit `http://localhost:3001/api/health`.
