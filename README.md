# Ticket-Mon: A Ticket Management System

Ticket-Mon is a full-stack ticket management application designed to streamline the process of creating, managing, and resolving tickets. It features a Node.js backend and a React frontend, with real-time communication powered by Socket.IO. The application supports role-based access control, real-time notifications, and ticket assignment algorithms for efficient workload distribution.

## Features

### Core Features

#### User Authentication and Authorization:
- Sign up, sign in, and sign out functionality.
- Role-based access control (Admin, Agent, User).
- JWT-based authentication for secure API access.

#### Ticket Management:
- Create, update, and delete tickets.
- Assign tickets to agents based on department algorithms (Round Robin, Least Recently Assigned, Load Balancing).
- Track ticket status (Open, In Progress, Resolved) and priority (Low, Medium, High).

#### Real-Time Communication:
- Real-time chat threads for ticket comments and replies.
- Instant notifications for ticket updates and new messages.

#### Department Management:
- Create and manage departments.
- Assign users to departments.
- Define ticket assignment algorithms for each department.

#### File Attachments:
- Upload and manage attachments for tickets.
- Automatic cleanup of attachments when a ticket is deleted.

#### Comments and Replies:
- Add comments to tickets.
- Reply to comments in a threaded fashion.
- Track creation dates for comments and replies.

## Technologies Used

### Backend
- **Node.js**: Runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: Database for storing tickets, users, departments, and comments.
- **Socket.IO**: Real-time communication for chat and notifications.
- **JWT**: JSON Web Tokens for authentication.
- **Bcrypt**: Password hashing for secure storage.
- **Multer**: File upload handling.

### Frontend
- **React**: Frontend library for building the user interface.
- **React Router**: Client-side routing.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **DaisyUI**: Tailwind CSS component library for pre-built UI components.
- **Redux**: State management for global application state.
- **React Redux**: Official React bindings for Redux.
- **Redux Toolkit**: Simplifies Redux setup and state management.
- **Socket.IO Client**: Real-time communication with the backend.
- **React Notifications**: Display notifications to users.
- **React Toastify**: Toast notifications for user feedback.
- **Chart.js**: Data visualization for charts and graphs.
- **Lucide React**: Icon library for React.
- **Date-fns**: Date utility library for handling dates.

## Folder Structure

```plaintext
ticket-mon/
├── client/                  # React frontend
│   ├── public/              # Static assets
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable UI components
│   │   ├── containers/      # Container components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux store, slices, and actions
│   │   ├── utils/           # Utility functions
│   │   ├── App.js           # Main application component
│   │   ├── index.js         # Entry point
│   │   └── Root.js          # Root component with Redux and Router
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── package.json         # Frontend dependencies
├── server/                  # Node.js backend
│   ├── config/              # Environment variables and configurations
│   ├── controllers/         # Business logic for routes
│   ├── database/            # MongoDB connection and models
│   ├── middlewares/         # Custom middleware (e.g., authentication, rate limiting)
│   ├── routes/              # API routes
│   ├── uploads/             # File uploads storage
│   ├── app.js               # Main application file
│   └── server.js            # HTTP and Socket.IO server setup
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

#### Clone the Repository:
```bash
git clone https://github.com/your-username/ticket-mon.git
cd ticket-mon
```

#### Install Dependencies:

##### Backend:
```bash
cd server
npm install
```

##### Frontend:
```bash
cd ../client
npm install
```

#### Set Up Environment Variables:
Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ticket-mon
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### Start the Application:

#### Backend:
```bash
cd server
npm run dev
```

#### Frontend:
```bash
cd ../client
npm start
```

### Access the Application:
Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
