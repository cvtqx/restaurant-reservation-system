const knex = require("../db/connection");

function create(newReservation){
    return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then(createdRecord => createdRecord[0])
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function updateStatus(updatedReservation){
    return knex("reservations")
    .select("*")
    .where({reservation_id: updatedReservation.reservation_id})
    .update({status: updatedReservation.status}, "*")
    .then(updatedRecords => updatedRecords[0])
}

function list(){
    return knex("reservations")
    .select("*")
    .orderBy("reservation_date")
}


//list reservations by date
function listByDate(reservation_date){
    return knex("reservations")
    .select("*")
    .where({reservation_date})
    .orderBy("reservation_time", "asc");
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}




module.exports ={
    create,
    read,
    updateStatus,
    list,
    listByDate,
    search    
}