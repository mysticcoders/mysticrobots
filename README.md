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

## Contributing

### Backing services
PostgreSQL is provided by Docker Compose. Run `docker-compose up -d` start from scratch and `docker-compose down` to destroy. If you are starting and stopping for day to day development use `docker-compose start` and `docker-compose stop`.

### Lerna Monorepo
You'll need Yarn and Lerna installed to manage packages and shared modules.

Get started by running `lerna bootstrap`. You'll want to rerun this any time you pull changes where new dependencies have been added.

To run the project, you can use `lerna run --stream start`. I like the `--stream` option as it follows the logs nicely together.
