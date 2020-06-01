
exports.up = async function(knex) {
    await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')    
    return knex.schema.createTable('challenge', t => {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        t.bigInteger('start_time')
        t.bigInteger('end_time')
        t.timestamp('created_at').defaultTo(knex.fn.now())
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('challenge')
}


