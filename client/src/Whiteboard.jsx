import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const Whiteboard = forwardRef(({ socket, room, tool, color }, ref) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  useImperativeHandle(ref, () => ({
    clearCanvas: () => {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      socket.emit('clear-canvas', room);
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.offsetWidth * 2;
    canvas.height = canvas.parentElement.offsetHeight * 2;
    canvas.style.width = `${canvas.parentElement.offsetWidth}px`;
    canvas.style.height = `${canvas.parentElement.offsetHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = 5;
    contextRef.current = context;

    const handleResize = () => {
        canvas.width = canvas.parentElement.offsetWidth * 2;
        canvas.height = canvas.parentElement.offsetHeight * 2;
        canvas.style.width = `${canvas.parentElement.offsetWidth}px`;
        canvas.style.height = `${canvas.parentElement.offsetHeight}px`;
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = 5;
    };

    window.addEventListener('resize', handleResize);

    socket.on('draw', (data) => {
      const { x, y, lastX, lastY, tool: remoteTool, color: remoteColor } = data;
      const ctx = contextRef.current;
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = remoteTool === 'eraser' ? '#0f172a' : remoteColor;
      ctx.lineWidth = remoteTool === 'eraser' ? 20 : 5;
      ctx.stroke();
      ctx.closePath();
    });

    socket.on('clear-canvas', () => {
      const canvas = canvasRef.current;
      const ctx = contextRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
        window.removeEventListener('resize', handleResize);
        socket.off('draw');
        socket.off('clear-canvas');
    };
  }, [socket]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
    }
  }, [color]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    setLastPos({ x: offsetX, y: offsetY });
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = contextRef.current;

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = tool === 'eraser' ? '#0f172a' : color;
    ctx.lineWidth = tool === 'eraser' ? 20 : 5;
    ctx.stroke();
    ctx.closePath();

    socket.emit('draw', {
      x: offsetX,
      y: offsetY,
      lastX: lastPos.x,
      lastY: lastPos.y,
      tool,
      color,
      room
    });

    setLastPos({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
    />
  );
});

export default Whiteboard;
