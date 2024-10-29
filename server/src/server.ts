import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import crypto from 'crypto';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = 4000;
const INITIAL_POINTS = 100;

interface Player {
  id: string;
  points: number;
}

interface Bet {
  choice: 'heads' | 'tails';
  wager: number;
  seed: string;
}

const players: Record<string, Player> = {};

app.get('/', (req: Request, res: Response) => {
  res.send("Welcome to the Fair Coin Flip Game!");
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  // Initialize new player with points
  players[socket.id] = { id: socket.id, points: INITIAL_POINTS };
  socket.emit('updatePoints', players[socket.id].points);

  // Handle bet
  socket.on('placeBet', (bet: Bet) => {
    const player = players[socket.id];

    // Check if the player has enough points
    if (bet.wager > player.points) {
      socket.emit('errorMessage', 'Insufficient points');
      return;
    }

    // Generate a provably fair result
    const serverSeed = crypto.randomBytes(16).toString('hex');
    const combinedSeed = bet.seed + serverSeed;
    const hash = crypto.createHash('sha256').update(combinedSeed).digest('hex');
    const outcome = parseInt(hash.slice(0, 2), 16) % 2 === 0 ? 'heads' : 'tails';

    // Determine if the player wins
    const isWin = outcome === bet.choice;
    player.points += isWin ? bet.wager : -bet.wager;
    const result = {
      outcome,
      serverSeed,
      playerWin: isWin,
      updatedPoints: player.points,
    };

    // Update the player's points and emit result
    socket.emit('betResult', result);
    socket.emit('updatePoints', player.points);

    console.log(`Player ${socket.id} bet on ${bet.choice}, result: ${outcome}, ${isWin ? 'win' : 'lose'}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete players[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
