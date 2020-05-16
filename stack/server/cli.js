
const { board, utils } = require('common')

const puzzles = require('./services/puzzles')

const main = (argv) => {

    if(argv.board) {
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

            puzzles.save_puzzle({ 
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