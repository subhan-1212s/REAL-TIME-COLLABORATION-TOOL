import React, { useState, useEffect } from 'react';
import _ from 'lodash';

const Editor = ({ socket, room, username }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    socket.on('text-update', (data) => {
      setText(data.text);
    });

    return () => socket.off('text-update');
  }, [socket]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    debouncedEmit(newText);
  };

  const debouncedEmit = React.useMemo(
    () => _.debounce((newText) => {
      socket.emit('text-update', {
        text: newText,
        room,
        username
      });
    }, 100),
    [socket, room, username]
  );

  return (
    <textarea
      className="editor-textarea"
      value={text}
      onChange={handleChange}
      placeholder="Start typing to collaborate..."
    />
  );
};

export default Editor;
