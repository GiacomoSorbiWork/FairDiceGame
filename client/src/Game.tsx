import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:4000');

interface BetResult {
  outcome: 'heads' | 'tails';
  serverSeed: string;
  playerWin: boolean;
  updatedPoints: number;
}

function Game() {
  const [points, setPoints] = useState(0);
  const [betChoice, setBetChoice] = useState<'heads' | 'tails'>('heads');
  const [wager, setWager] = useState(10);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    socket.on('updatePoints', (newPoints: number) => {
      setPoints(newPoints);
    });

    socket.on('betResult', (result: BetResult) => {
      setMessage(
        `Outcome: ${result.outcome}. ${
          result.playerWin ? 'You won!' : 'You lost.'
        } Your points: ${result.updatedPoints}. Server Seed: ${result.serverSeed}`
      );
    });

    socket.on('errorMessage', (error: string) => {
      setMessage(error);
    });

    return () => {
      socket.off('updatePoints');
      socket.off('betResult');
      socket.off('errorMessage');
    };
  }, []);

  const placeBet = () => {
    const seed = Date.now().toString(); // A simple client seed (timestamp for simplicity)
    socket.emit('placeBet', { choice: betChoice, wager, seed });
  };

  return (
    <div>
      <h2>Points: {points}</h2>
      <div>
        <label>
          Choose Heads or Tails:
          <select
            value={betChoice}
            onChange={(e) => setBetChoice(e.target.value as 'heads' | 'tails')}
          >
            <option value="heads">Heads</option>
            <option value="tails">Tails</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Wager Points:
          <input
            type="number"
            value={wager}
            onChange={(e) => setWager(parseInt(e.target.value))}
            min="1"
            max={points}
          />
        </label>
      </div>
      <button onClick={placeBet}>Place Bet</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Game;
