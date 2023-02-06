const knex = require("../db/connection");


function create(newTable){
    return knex("tables")
      .insert(newTable)
      .returning("*")
      .then((createdRecord) => createdRecord[0]);
}

module.exports = {
  create,
  //list,
};