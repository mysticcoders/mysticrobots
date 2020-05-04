# Ricochet Robots
Because we could.

Demo App available here: https://mysticrobots.netlify.app/dashboard

- Find a library for reading keys
- Find a library for drawing the gameboard
- Identify how we'll store the high scores
- Devise a solver
- Introspect how robotreboot paints the gameboard
- Single player, Single Player vs computer, 2-player, 2-player over network, websocket, integrations?
- Identify all the different types of plays aside from single player (which would be the first one)
- Do we implement the practice board first?
- 16x16 array with a number? 0 for no walls, 1 - 8 for the others? work it out.

## Solver
The largest problem to solve which may enable us to offer varying levels of complexity in the game is the solver. How do you devise a way to get a specific robot into the goal in the smallest number of moves. Alone is one level, and using the other robots is another level of complexity.
