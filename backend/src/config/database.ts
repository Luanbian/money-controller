import knex from "knex";
require ('custom-env').env('staging')

const database = knex({
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
    },
    useNullAsDefault: true
})

export default database;