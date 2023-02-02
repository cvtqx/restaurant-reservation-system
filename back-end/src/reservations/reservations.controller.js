const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

//TO DO: add validation



async function create(req, res){

  const newReservation = await service.create(req.body.data);

  res.status(201).json({
    data: newReservation,
  })
}

async function list(req, res) {
  res.json({
    data: reservations,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
