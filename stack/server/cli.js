
const { board } = require('common')

const puzzles = require('common').services.puzzles

const main = (argv) => {

    if(argv.board) {
        console.log(`--board`)
        const challengeId = argv.challengeId
    
        if(!challengeId) {
            console.error("Challenge ID is a required field")
            process.exit()
        }

        const iterations = !isNaN(argv.iterations) ? argv.iterations : 1

        for(let i=0; i<iterations; i++) {
            const grid = {}
            const boardData = board.setupBoard({grid, config: {}})
            const goalData = board.setupGoal({grid})
            const robotData = board.setupRobots({grid})

            console.dir(boardData)
            console.dir(goalData)
            console.dir(robotData)
            
            puzzles.savePuzzle({ 
                challengeId, 
                goalColor: goalData.goalColor,
                goalIndex: goalData.goalIndex,
                redBot: robotData.rIndex,
                greenBot: robotData.gIndex,
                blueBot: robotData.bIndex,
                yellowBot: robotData.yIndex,
                config: boardData.config
            })
        }        
    }
}


const argv = require('minimist')(process.argv.slice(2))
main(argv)