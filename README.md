# SyncSpace - Real-Time Collaboration Tool

SyncSpace is a premium, real-time collaboration platform that combines a shared whiteboard and a synchronized document editor into one seamless workspace. Built with Socket.io and React, it enables teams to draw, write, and ideate together in real-time.

![SyncSpace Preview](https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=1200&h=600)

*The interface features a beautiful dark-mode workspace with real-time syncing.*

## 🚀 Features

- **Collaborative Whiteboard**: Multi-user drawing with pencil and eraser tools.
- **Shared Document Editor**: Real-time text synchronization for collaborative writing.
- **Live Presence & Cursors**: See active users and their mouse movements with name tags.
- **Room-Based Workspaces**: Private rooms for specific teams or projects.
- **Premium UI/UX**: Modern dark mode with glassmorphism, smooth animations, and high-quality iconography.
- **Responsive Design**: Works across different screen sizes.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Framer Motion, Lucide React, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io.
- **Styling**: Vanilla CSS with a custom Glassmorphism design system.

## 🏁 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/subhan-1212s/REAL-TIME-COLLABORATION-TOOL.git
   cd REAL-TIME-COLLABORATION-TOOL
   ```

2. **Setup the Server**:
   ```bash
   cd server
   npm install
   ```

3. **Setup the Client**:
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the Backend Server**:
   ```bash
   cd server
   node index.js
   ```
   *The server will run on http://localhost:3001*

2. **Start the Frontend Development Server**:
   ```bash
   cd client
   npm run dev
   ```
   *The app will be accessible at http://localhost:5173 (or the next available port)*

## 📖 How to Use

1. Enter your **Username** and a **Room ID** (e.g., `design-sprint`).
2. Share the **Room ID** with your teammates.
3. Use the sidebar tools to draw on the whiteboard.
4. Use the floating editor in the bottom right to write shared notes.
5. Watch your teammates' cursors move as they collaborate!

---
Built with ❤️ by Subhan
