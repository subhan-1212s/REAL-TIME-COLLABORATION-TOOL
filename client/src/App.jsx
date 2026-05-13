import React, { useState } from 'react';
import CollaborativeSpace from './CollaborativeSpace';
import { motion } from 'framer-motion';

function App() {
  const [isJoined, setIsJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (username && room) {
      setIsJoined(true);
    }
  };

  if (isJoined) {
    return <CollaborativeSpace username={username} room={room} />;
  }

  return (
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass fade-in" 
        style={{ padding: '3rem', borderRadius: '24px', width: '100%', maxWidth: '450px', textAlign: 'center' }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SyncSpace
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Real-time collaborative whiteboard & document editor
        </p>

        <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Username</label>
            <input 
              type="text" 
              placeholder="e.g. Alex" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                borderRadius: '12px', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border)', 
                color: 'white',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Room ID</label>
            <input 
              type="text" 
              placeholder="e.g. design-team" 
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.8rem', 
                borderRadius: '12px', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border)', 
                color: 'white',
                outline: 'none'
              }}
              required
            />
          </div>

          <button type="submit" className="btn" style={{ padding: '1rem', justifyContent: 'center', fontSize: '1rem', marginTop: '1rem' }}>
            Join Workspace
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Tip: Share the Room ID with others to collaborate instantly!
        </div>
      </motion.div>
    </div>
  );
}

export default App;
