import knex from "knex";

/* CONFIGURACION DE LA BASE DE DATOS ----------------------------------------- */
export const databaseMySql = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    port: 3307,
    user: "root",
    password: "rootSQL123!",
    database: "db_desafio7",
  }
});


export const dbSqlite3 = knex({
  client: "sqlite3",
  connection: {
    filename: "./database/ecommerce.sqlite3",
  },
  /* undefined keys are replaced with NULL instead of DEFAULT */
  useNullAsDefault: true,
});