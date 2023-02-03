const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

//TO DO: add validation - validate phone number, date and time fields

function hasData(req, res, next){

  if(req.body.data){
    return next()
  }
  next({status: 400, message: "body must have data property"})
}


function bodyDataHas(propertyName){
  return function(req, res, next){
    const {data ={}} = req.body;

    if(data[propertyName]){
      return next();
    }
    next({status: 400,
    message: `Must include a ${propertyName} value`,
  })
  }
}

function validNumberOfPeople(req, res, next){
  const { data: { people } = {}} = req.body;

  if (people < 1){
    return next({
      status: 400,
      message: `Number of people must be 1 or more`,
    });
  }
  next();
}

async function create(req, res){

  const newReservation = await service.create(req.body.data);

  res.status(201).json({
    data: newReservation,
  })
}

async function list(req, res) {
  const data = await service.list();

  res.json({
    data,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    validNumberOfPeople, asyncErrorBoundary(create),
  ],
};
