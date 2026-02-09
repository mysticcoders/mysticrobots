# Mystic Robots
Because we could.

App available here: https://mysticrobots.com

Items to figure out
- Identify how we'll store the high scores
- Devise a solver
- Single player, Single Player vs computer, 2-player, 2-player over network, websocket, integrations?
- Identify all the different types of plays aside from single player (which would be the first one)

## Solver
The largest problem to solve which may enable us to offer varying levels of complexity in the game is the solver. How do you devise a way to get a specific robot into the goal in the smallest number of moves. Alone is one level, and using the other robots is another level of complexity.

## Running the Application

### Using Docker (Recommended)
This project can be run using Docker with Node.js 16:
```bash
docker build -t mysticrobots .
docker run -p 3000:3000 mysticrobots
```

### Using Node.js 16
If you have Node.js 16 installed:
```bash
npm install
npm start
```

### For Node.js 18 Users (with OpenSSL support)
```bash
export NODE_OPTIONS=--openssl-legacy-provider
npm install
npm start
```

## Dependencies
This project uses React 16 and react-scripts 3.4.1 which has compatibility issues with newer Node.js versions. Using the Docker approach or Node.js 16 is recommended.
