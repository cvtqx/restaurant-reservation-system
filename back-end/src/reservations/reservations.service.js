const knex = require("../db/connection");

function create(newReservation){
    return knex("reservations")
    .insert(newReservation)
    .returning("*")
}

module.exports ={
    create,
}