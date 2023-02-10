//import error components
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

//import service file
const service = require("./reservations.service");

//Validation functions

//validate that body has data property

function hasData(req, res, next){

  if(req.body.data){
    return next()
  }
  next({status: 400, message: "Body must have data property"})
}

//validate that body has all required properties
const requiredProperties =[
  "first_name",
  "last_name",
"mobile_number",
"reservation_date",
"reservation_time",
"people"
]

const hasRequiredProperties = hasProperties(requiredProperties);


//validate that number of people is not less than 1 and is integer

function validNumberOfPeople(req, res, next){

  const people = Number(req.body.data.people);

  if (people < 1){
    return next({
      status: 400,
      message: "Number of people must be 1 or more",
    });
  }
  next();
}

//validate that people property is a number

function peopleIsNumber(req, res, next){

  const people = req.body.data.people;


  if(!Number.isInteger(people)){
    return next({
      status: 400,
      message: "people must be a number"
    });
  }
  next();
}

//validate that time is valid format

function validTimeFormat(req, res, next){

  const time = req.body.data.reservation_time;
  const validTime = /[0-9]{2}:[0-9]{2}/;

  if(!validTime.test(time)){
    return next({
      status: 400,
      message: "Invalid reservation_time format",
    });
    }
    next();
  }


//validate that date is valid format

function validDateFormat(req, res, next){

  const date = req.body.data.reservation_date;
  const validDate =/\d{4}-\d{2}-\d{2}/;

    if(!validDate.test(date)){
      return next({
        status: 400,
        message: "Invalid reservation_date format",
      });
    }
    next();
}

//validate that reservation is not for a Tuesday

function reservationOnTuesday(req, res,next){
  
  const resDate = new Date(req.body.data.reservation_date);

  const resDay = resDate.getDay();

  if(resDay === 1){
    return next({
      status: 400,
      message: "The restaurant is closed on Tuesdays",
    });
  }
  next();
}


//validate that reservation is not for a date and time in the past

function reservationNotInPast(req, res, next){

  const resDate = req.body.data.reservation_date;
  const resTime = req.body.data.reservation_time;

  if(new Date(`${resDate}, ${resTime}`) < new Date()){
    return next({
      status: 400,
      message: "Reservation must be for a future date/time",
    });
  }
next();
}


//validate that reservation is within eligible timeframe

function reservationTimeFrameValid(req, res, next){

      const resTime = req.body.data.reservation_time;
      const resDate = req.body.data.reservation_date;

      const date = new Date(`${resDate}, ${resTime}`);

      const resTimeString = parseInt(`${date.getHours()}${date.getMinutes()}`)

      if(resTimeString < 1030 || resTimeString > 2130){
        return next({
          status: 400,
          message: "Reservation must be made between 10:30am and 9:30pm",
        });
      }
  next();
}

//validate that reservation exists

async function reservationExists(req, res, next){

  const reservation = await service.read(req.params.reservation_id);

  if(reservation){
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${req.params.reservation_id}  cannot be found` });
}

//CRUDL functions
//create new reservation

async function create(req, res){

  const newReservation = await service.create(req.body.data);

  res.status(201).json({
    data: newReservation,
  })
}

//list reservations
async function list(req, res) {

  const reservationDate = req.query.date;

  if(reservationDate){
    const data = await service.listByDate(reservationDate);
    res.json({data})
  }else{

    const data = await service.list();

    res.json({ data })
  }
  
}

function read(req, res){
  
  res.json({data: res.locals.reservation})
}

//async function update()

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasRequiredProperties,
    validNumberOfPeople,
    peopleIsNumber,
    validDateFormat,
    validTimeFormat,
    reservationOnTuesday,
    reservationNotInPast,
    reservationTimeFrameValid,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
};
