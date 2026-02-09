/**
 * BFS puzzle solver for Ricochet Robots
 * Finds optimal solution by exploring all possible move sequences up to a depth cap
 */

const N_FLAG = 1
const S_FLAG = 2
const E_FLAG = 4
const W_FLAG = 8

const DIRECTIONS = ['UP', 'DOWN', 'LEFT', 'RIGHT']
const ROBOT_ORDER = ['RED', 'GREEN', 'BLUE', 'YELLOW']

/**
 * Build a wall bitmask array from the grid
 * Each cell gets flags: N=1, S=2, E=4, W=8
 * Board edges are treated as walls
 */
export function buildWallMap(grid) {
    const wallMap = new Uint8Array(256)

    for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
            const idx = y * 16 + x
            let flags = 0

            if (y === 0) flags |= N_FLAG
            if (y === 15) flags |= S_FLAG
            if (x === 15) flags |= E_FLAG
            if (x === 0) flags |= W_FLAG

            const cell = grid[`${x},${y}`]
            if (cell && cell.walls) {
                const w = cell.walls
                if (w === 'NORTH' || w === 'NORTH_EAST' || w === 'NORTH_WEST' || w === 'ALL') flags |= N_FLAG
                if (w === 'SOUTH' || w === 'SOUTH_EAST' || w === 'SOUTH_WEST' || w === 'ALL') flags |= S_FLAG
                if (w === 'EAST' || w === 'NORTH_EAST' || w === 'SOUTH_EAST' || w === 'ALL') flags |= E_FLAG
                if (w === 'WEST' || w === 'NORTH_WEST' || w === 'SOUTH_WEST' || w === 'ALL') flags |= W_FLAG
            }

            wallMap[idx] = flags
        }
    }

    return wallMap
}

/**
 * Slide a robot in a direction until it hits a wall or another robot
 * Returns the new position index, or the same position if no movement
 */
export function slideRobot(wallMap, positions, robotIdx, direction) {
    let pos = positions[robotIdx]
    let x = pos % 16
    let y = (pos - x) / 16

    while (true) {
        let nx = x
        let ny = y
        let currentIdx = y * 16 + x

        if (direction === 'UP') {
            if (wallMap[currentIdx] & N_FLAG) break
            ny = y - 1
            let nextIdx = ny * 16 + nx
            if (wallMap[nextIdx] & S_FLAG) break
        } else if (direction === 'DOWN') {
            if (wallMap[currentIdx] & S_FLAG) break
            ny = y + 1
            let nextIdx = ny * 16 + nx
            if (wallMap[nextIdx] & N_FLAG) break
        } else if (direction === 'LEFT') {
            if (wallMap[currentIdx] & W_FLAG) break
            nx = x - 1
            let nextIdx = ny * 16 + nx
            if (wallMap[nextIdx] & E_FLAG) break
        } else if (direction === 'RIGHT') {
            if (wallMap[currentIdx] & E_FLAG) break
            nx = x + 1
            let nextIdx = ny * 16 + nx
            if (wallMap[nextIdx] & W_FLAG) break
        }

        let blocked = false
        for (let i = 0; i < positions.length; i++) {
            if (i !== robotIdx && positions[i] === ny * 16 + nx) {
                blocked = true
                break
            }
        }
        if (blocked) break

        x = nx
        y = ny
    }

    return y * 16 + x
}

/**
 * Encode robot positions into a compact string key for the visited set
 */
function encodeState(positions) {
    return String.fromCharCode(...positions)
}

/**
 * Solve the puzzle using BFS
 * Returns { solution, optimalMoves } or { solution: null, optimalMoves: -1 }
 */
export function solve(grid, robots, goalX, goalY, targetRobot) {
    const MAX_DEPTH = 20
    const wallMap = buildWallMap(grid)

    const activeRobots = ROBOT_ORDER.filter(name => robots[name])
    const goalRobotIdx = activeRobots.indexOf(targetRobot)
    if (goalRobotIdx === -1) return { solution: null, optimalMoves: -1 }

    const goalPos = goalY * 16 + goalX

    const initialPositions = activeRobots.map(name => {
        const r = robots[name]
        return r.y * 16 + r.x
    })

    if (initialPositions[goalRobotIdx] === goalPos) {
        return { solution: [], optimalMoves: 0 }
    }

    const visited = new Set()
    visited.add(encodeState(initialPositions))

    const queue = []
    queue.push({ positions: initialPositions, parent: null, move: null, depth: 0 })

    let head = 0

    while (head < queue.length) {
        const node = queue[head++]

        if (node.depth >= MAX_DEPTH) continue

        for (let ri = 0; ri < activeRobots.length; ri++) {
            for (let di = 0; di < 4; di++) {
                const dir = DIRECTIONS[di]
                const newPos = slideRobot(wallMap, node.positions, ri, dir)

                if (newPos === node.positions[ri]) continue

                const newPositions = [...node.positions]
                newPositions[ri] = newPos

                const key = encodeState(newPositions)
                if (visited.has(key)) continue
                visited.add(key)

                const newNode = {
                    positions: newPositions,
                    parent: node,
                    move: { robot: activeRobots[ri], direction: dir },
                    depth: node.depth + 1
                }

                if (ri === goalRobotIdx && newPos === goalPos) {
                    const solution = []
                    let curr = newNode
                    while (curr.move) {
                        solution.unshift(curr.move)
                        curr = curr.parent
                    }
                    return { solution, optimalMoves: solution.length }
                }

                queue.push(newNode)
            }
        }
    }

    return { solution: null, optimalMoves: -1 }
}

export default solve
