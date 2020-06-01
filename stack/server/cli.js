
const { knexSnakeCaseMappers, Model } = require('objection')
const Knex = require('knex')

const knex = Knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    ...knexSnakeCaseMappers()
})

Model.knex(knex)

const { board } = require('common')

const puzzles = require('common').services.puzzles

const main = async (argv) => {

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

            await puzzles.savePuzzle({ 
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

    knex.destroy()
}


const argv = require('minimist')(process.argv.slice(2))
main(argv)