exports.up = async function(knex) {
    await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')    
    return knex.schema.createTable('score', t => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        t.uuid('challenge_id')
        t.string('name', 100)
        t.string('ip_address', 50)
        t.integer('move_count')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('score')
}
