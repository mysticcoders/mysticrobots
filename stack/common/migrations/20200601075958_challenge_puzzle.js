exports.up = async function(knex) {
    await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')    
    return knex.schema.createTable('challenge_puzzle', t => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        t.uuid('challenge_id')
        t.integer('goal_color')
        t.integer('goal_index')
        t.integer('red_bot')
        t.integer('green_bot')
        t.integer('blue_bot')
        t.integer('yellow_bot')
        t.string('config', 4)
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('challenge_puzzle')
}
