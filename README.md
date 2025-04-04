🛠️ Installation & Setup
Follow these steps to set up and run the project on your local machine.

1️⃣ Prerequisites
Ensure you have Node.js (18+) and npm (or yarn) installed.
To check if they are installed, run:

node -v
npm -v
If not installed, download them from Node.js Official Website.

2️⃣ Clone the Repository
git clone https://github.com/your-username/react-calendar-app.git
cd react-calendar-app

3️⃣ Install Dependencies
npm install
or, if using Yarn:
yarn install

4️⃣ Start the Development Server
npm run dev
The application will start on http://localhost:5173/ (if using Vite) or http://localhost:3000/ (if using Create React App).

📌 Usage
✅ Navigate between months using the left (<) and right (>) arrows.
✅ Click "Today" to return to the current month.
✅ Click on a date's + button to add an event.
✅ Click on an event to edit or manage it.
✅ Click +More to see all events for that day in a modal.

📝 Notes
📌 The project stores events in localStorage, so they persist between page reloads.
📌 The maximum number of events shown per day in the calendar is 2, with the rest accessible via +More.
📌 The project uses date-fns for date manipulation.
