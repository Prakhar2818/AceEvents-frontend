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

## Architecture Decisions

### Structure Decisions
- **Component-Based Architecture**: 
  - Organized by feature folders for better scalability
  - Separate components for reusability (buttons, forms, cards)
  - Shared context providers for global state management
  - Custom hooks for extracting common logic

### Data Models
Our data models are structured as follows:

```javascript
// Event Model
const eventModel = {
    id: String,
    title: String,
    description: String,
    createdBy: String,
    dateOptions: [{
        date: Date,
        votes: [String] // array of user IDs
    }],
    participants: [String], // array of user IDs
    status: String // 'active' or 'completed'
}

// User Model
const userModel = {
    id: String,
    username: String,
    email: String,
    createdEvents: [String], // array of event IDs
    participatingEvents: [String] // array of event IDs
}

// Poll Model
const pollModel = {
    id: String,
    eventId: String,
    question: String,
    options: [{
        text: String,
        votes: [String] // array of user IDs
    }]
}
```

### Authentication Implementation
- **JWT-based Authentication**:
  - Tokens stored in localStorage
  - Automatic token inclusion in API requests via Axios interceptors
  - Protected routes using React Router
  - Context-based auth state management

```javascript
// Example of protected route implementation
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    return !loading && user ? children : <Navigate to="/login" />;
};

// Example of auth context usage
const authHeaders = {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
};
```

## Challenges & Solutions

### 1. State Management
**Challenge**: Managing user authentication state across components
**Solution**: 
- Implemented AuthContext for centralized auth state
- Used React Context API to avoid prop drilling
- Created custom hooks for reusable auth logic
```javascript
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
```

### 2. Form Validation
**Challenge**: Complex form validation for events and polls
**Solution**:
- Created reusable form components
- Implemented client-side validation using custom hooks
- Added error handling for API responses

### 3. Date Handling
**Challenge**: Managing different date formats
**Solution**:
- Used date-fns library for consistent date formatting
- Implemented date picker component
- Stored dates in ISO format for consistency

### 4. Loading States
**Challenge**: Managing loading states during API calls
**Solution**:
- Added loading indicators for API calls
- Implemented error boundaries
- Created fallback UI components

### 5. Mobile Responsiveness
**Challenge**: Making complex forms work well on mobile
**Solution**:
- Used Tailwind CSS breakpoints for responsive design
- Created mobile-first layouts
- Simplified UI for smaller screens
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## Deployment
[Netlify] (https://aceevents.netlify.app/)

**AceEvents** – Make group decisions easy and fun!