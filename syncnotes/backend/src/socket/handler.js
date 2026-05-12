const registerSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('note:created', (note) => {
      socket.broadcast.emit('note:created', note);
    });

    socket.on('note:updated', (note) => {
      socket.broadcast.emit('note:updated', note);
    });

    socket.on('note:deleted', ({ id }) => {
      socket.broadcast.emit('note:deleted', { id });
    });

    socket.on('sync:request', () => {
      socket.emit('sync:response', { status: 'ready' });
    });
  });
};

module.exports = { registerSocketHandlers };
