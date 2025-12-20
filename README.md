# Ticket-Mon 🎫

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![React](https://img.shields.io/badge/Frontend-React-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933.svg)](https://nodejs.org/)

**Ticket-Mon** is a powerful, full-stack ticket management system designed for modern support teams. It streamlines ticket creation, automates workflows, and provides real-time updates to ensure fast and efficient issue resolution.

---

## 🚀 Key Features

### 🛠️ Core Management
- **Dynamic Categories**: Centralized category management system for technical, billing, sales, and custom support areas.
- **Department Routing**: Organize users into departments with specific ticket handling logic.
- **Role-Based Access**: Granular permissions for Admins, Agents, and Users.

### 🤖 Workflow Automation
- **Keyword Triggers**: Automatically assign or update tickets based on keywords in the title or description.
- **On-Event Rules**: Execute actions (Assign, Set Priority, Set Status) triggered by creation or property changes.
- **Intelligent Assignment**: Supports algorithms like **Round Robin**, **Least Recently Assigned**, and **Load Balancing**.

### 💬 Real-Time Collaboration
- **Live Chat Threads**: Threaded comments for internal and external communication.
- **Socket Notifications**: Instant in-app popups and "bell" notifications for assignments and updates.
- **Email Integration**: Automated email alerts for ticket lifecycle events.

### 📎 Multimedia Support
- **File Attachments**: Seamlessly attach documents and images to support requests.
- **Rich Dashboard**: Visual data representation using Chart.js for ticket trends and team performance.

---

## 🛠️ Tech Stack

- **Frontend**: [React](file:///client/src/), [Redux Toolkit](file:///client/src/redux/), [Tailwind CSS](file:///client/tailwind.config.js), [DaisyUI](https://daisyui.com/)
- **Backend**: [Node.js](file:///server/app.js), [Express](https://expressjs.com/), [Socket.IO](https://socket.io/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](file:///server/models/)
- **Auth**: JWT (JSON Web Tokens) & Bcrypt

---

## 📂 Project Structure

```bash
ticket-mon/
├── client/              # React application (Vite/CRA)
│   ├── src/components/  # UI Components & Layouts
│   ├── src/pages/       # Dashboard, Tickets, Automation, Settings
│   └── src/redux/       # State management slices
├── server/              # Node.js / Express backend
│   ├── controllers/     # API logic handlers
│   ├── models/          # Mongoose schemas (Ticket, User, Rule)
│   ├── services/        # Business logic (Automation, Notification)
│   └── routes/          # API endpoint definitions
└── README.md            # You are here!
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: v18.0.0+
- **MongoDB**: v6.0+ (Running locally or via Atlas)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ticket-mon.git
   cd ticket-mon
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create .env.development.local with:
   # PORT=5500
   # DB_URI=mongodb://localhost:27017/ticketing
   # JWT_SECRET=your_secret_here
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   npm start
   ```

---

## 📖 Usage Examples

### Creating an Automation Rule
1. Navigate to **Automation** page.
2. Click **Create New Rule**.
3. Set Trigger to `On Ticket Create`.
4. Add Condition: `Subject contains keyword "hardware"`.
5. Add Action: `Assign to "Support Agent X"`.

---

## 🆘 Support & Documentation

- **Issues**: Report bugs or request features via the [GitHub Issues](https://github.com/your-username/ticket-mon/issues) page.
- **Contributions**: Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

---

## 👥 Maintainers

- **Lead Developer**: Ticket-Mon Team
- **Contributors**: [View Full List](https://github.com/your-username/ticket-mon/graphs/contributors)

---

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
