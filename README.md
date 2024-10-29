# Fair Coin Flip Game

A simple fair coin-flip game built with React, Node.js, TypeScript, and Socket.IO. Players start with a set number of points, place bets on coin flips (Heads or Tails), and wager points. The server generates a provably fair outcome for each coin flip by combining a client-provided seed with a server-generated secret.

## Features

- **Provably Fair Outcome**: Combines a client-provided seed and a server-generated seed to create a SHA-256 hash that determines the outcome.
- **Real-time Betting**: Uses Socket.IO to handle bets and results in real-time.
- **Player Points Management**: Players start with a fixed number of points and win or lose points based on game outcomes.

## Project Structure

```plaintext
/fair-coin-flip-game
|-- /client (React App)
|   |-- public
|   |-- src
|       |-- App.tsx
|       |-- Game.tsx
|       |-- index.tsx
|-- /server
|   |-- src
|       |-- server.ts
|   |-- tsconfig.json
|   |-- package.json
