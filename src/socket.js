import { io } from 'socket.io-client';

const socket = io('http://localhost:3005', {
  autoConnect: false, // 수동 연결
});

export default socket;