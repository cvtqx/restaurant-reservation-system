const knex = require("../db/connection");

function create(newReservation){
    return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then(createdRecord => createdRecord[0])
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


function read(reservation_id){
    return knex("reservations").select("*").where({reservation_id}).first();
}

module.exports ={
    create,
    list,
    listByDate,
    read
}