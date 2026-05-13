import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Pencil, Square, Circle, Type, Eraser, Share2, Users, MessageSquare, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Whiteboard from './Whiteboard';
import Editor from './Editor';

const socket = io('http://localhost:3001');

const CollaborativeSpace = ({ username, room }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState('#ffffff');
  const [isEditorOpen, setIsEditorOpen] = useState(true);
  const [cursors, setCursors] = useState({});
  const whiteboardRef = useRef(null);

  useEffect(() => {
    socket.emit('join', { username, room });

    socket.on('user-joined', (users) => setActiveUsers(users));
    socket.on('user-left', (users) => setActiveUsers(users));
    
    socket.on('cursor-move', (data) => {
      setCursors(prev => ({ ...prev, [data.userId]: data }));
    });

    return () => {
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('cursor-move');
    };
  }, [username, room]);

  const handleMouseMove = (e) => {
    socket.emit('cursor-move', {
      x: e.clientX,
      y: e.clientY,
      username,
      room
    });
  };

  return (
    <div className="app-container" onMouseMove={handleMouseMove}>
      {/* Top Navigation */}
      <nav className="glass toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="logo" style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent)' }}>
            SyncSpace
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
          <div className="room-info">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Room: </span>
            <span style={{ fontWeight: '500' }}>{room}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {activeUsers.map((user, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="user-badge"
              style={{ borderLeft: `3px solid ${user.color}` }}
            >
              {user.username}
            </motion.div>
          ))}
          <button className="btn btn-icon" onClick={() => navigator.clipboard.writeText(room)}>
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* Whiteboard Controls */}
        <div className="glass" style={{ 
          position: 'absolute', 
          left: '2rem', 
          top: '2rem', 
          padding: '0.5rem', 
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          zIndex: 40
        }}>
          {[
            { id: 'pencil', icon: Pencil },
            { id: 'rect', icon: Square },
            { id: 'circle', icon: Circle },
            { id: 'eraser', icon: Eraser },
          ].map((item) => (
            <button 
              key={item.id}
              className={`btn btn-icon ${tool === item.id ? 'active' : ''}`}
              onClick={() => setTool(item.id)}
              style={{ background: tool === item.id ? 'var(--accent)' : 'transparent', color: tool === item.id ? 'white' : 'inherit' }}
            >
              <item.icon size={20} />
            </button>
          ))}
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer' }}
          />
          <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }}></div>
          <button 
            className="btn btn-icon" 
            onClick={() => whiteboardRef.current?.clearCanvas()}
            style={{ color: '#ff4444' }}
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* The Whiteboard */}
        <div className="canvas-container">
          <Whiteboard ref={whiteboardRef} socket={socket} room={room} tool={tool} color={color} />
        </div>

        {/* Floating Editor */}
        <div className={`glass editor-container ${!isEditorOpen ? 'minimized' : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={16} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Shared Document</span>
            </div>
            <button className="btn btn-icon" style={{ padding: '2px' }} onClick={() => setIsEditorOpen(!isEditorOpen)}>
              {isEditorOpen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
          {isEditorOpen && <Editor socket={socket} room={room} username={username} />}
        </div>

        {/* Remote Cursors */}
        {Object.values(cursors).map((cursor) => (
          cursor.username !== username && (
            <div 
              key={cursor.userId}
              className="cursor"
              style={{ left: cursor.x, top: cursor.y }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)">
                <path d="M5.64 2l12.36 12.36-4.24 1.41 4.24 4.24-2.83 2.83-4.24-4.24-1.41 4.24L5.64 2z" />
              </svg>
              <div className="cursor-label glass" style={{ background: 'var(--accent)' }}>
                {cursor.username}
              </div>
            </div>
          )
        ))}
      </main>
    </div>
  );
};

export default CollaborativeSpace;
