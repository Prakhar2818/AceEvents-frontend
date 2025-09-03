# AceEvents Frontend

AceEvents is a collaborative event management and polling platform. This frontend is built with React and Vite, providing a modern, responsive user experience for creating events, inviting participants, and running interactive polls.

---

## Project Structure

```
AceEvents/
├── public/                      # Static assets (favicon, images, etc.)
│   └── ...
├── src/                         # Source code
│   ├── assets/                  # Images, icons, and other static files
│   ├── components/              # Reusable React components (e.g., Navbar, EventCard)
│   ├── context/                 # React Contexts (e.g., authContext.jsx for authentication)
│   │   └── authContext.jsx      # Authentication context and provider
│   ├── pages/                   # Page-level React components (e.g., Home, Login, Signup, EventDetails)
│   ├── App.jsx                  # Main app component, sets up routes and layout
│   ├── main.jsx                 # Entry point, renders <App /> to the DOM
│   └── index.css                # Global styles (often Tailwind CSS)
├── .env                         # Environment variables (API URLs, etc.)
├── package.json                 # Project metadata and dependencies
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.js               # Vite build tool configuration
└── README.md                    # Project documentation
```

---

## Features

- **User Authentication:** Signup, login, and secure session management.
- **Event Management:** Create, edit, and delete events with multiple date/time options.
- **Invitations:** Invite users to participate in events via email.
- **Interactive Polls:** Add polls to events, allow single or multiple selections, and view live results.
- **Real-Time Updates:** See poll results and participant status instantly.
- **Dashboard Notification** User can see the  invitaion in invitation tab on dashboard
- **Responsive UI:** Modern design using Tailwind CSS.

---

## Tech Stack

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [date-fns](https://date-fns.org/)
- [React Router](https://reactrouter.com/)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Prakhar2818/AceEvents-frontend.git
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Edit `.env` to set your backend API URL:
     ```
     VITE_API_URL=https://aceevents-backend.onrender.com/api
     ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173).

### Build for Production

```sh
npm run build
```

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Deployment
[Netlify] (https://aceevents.netlify.app/)

**AceEvents** – Make group decisions easy and fun!