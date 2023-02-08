const knex = require("../db/connection");


function create(newTable){
    return knex("tables")
      .insert(newTable)
      .returning("*")
      .then((createdRecord) => createdRecord[0]);
}

function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}


function update(updatedTable){
  return knex("tables")
  .select("*")
  .where({table_id: updatedTable.table_id})
  .update(updatedTable, "*")
  .then(updatedRecords => updatedRecords[0])
}

module.exports = {
  create,
  list,
  update,
};