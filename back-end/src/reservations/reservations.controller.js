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

      const date = new Date(`${resDate} ${resTime}`);


      if(date.getHours() < 10 || (date.getHours() === 10 && date.getMinutes < 30)) {
        
        return next({
          status: 400,
          message: "The earliest reservation time is 10:30am",
        });
      }
      if(date.getHours() > 21 || (date.getHours === 21 && date.getMinutes() > 30)){
        return next({
          status: 400,
          message: "The latestest reservation time is 9:30pm",
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

//validate the status of reservation


const validStatusValues =[
  "booked",
  "seated",
  "finished",
  "cancelled"
]

function validStatus(req, res, next){
  const {status} = req.body.data;
  if(!validStatusValues.includes(status)){
    return next({status: 400, message: "unknown status"})
  }
  next()
}

//validate that reservation is not finished (a finished reservation cannot be updated)

function notFinished(req, res, next){

  const {status} = res.locals.reservation;

  if(status !== "booked" && status !== "seated"){
    return next({
      status: 400,
      message: "A finished reservation cannot be updated"
    })
  }
  next()
}

//validate that reservation has booked status

function bookedStatus(req, res, next){
  const {status} = req.body.data;

  if(status && status !== "booked"){
    return next({
      status: 400,
      message: `cannot make reservations for ${status} status`
    })
  }
  next();
}

//CRUDL functions
//create new reservation

async function create(req, res){

  const newReservation = await service.create(req.body.data);

  res.status(201).json({
    data: newReservation,
  })
}

//list reservations for a date and a mobile number
async function list(req, res) {

  const {date, mobile_number} = req.query;

  if(date){
    const data = await service.listByDate(date);
    res.json({data})
  }else if(mobile_number){
    const data = await service.search(mobile_number)
    res.json({data})
  }else{

    const data = await service.list();

    res.json({ data })
  }
  
}

function read(req, res){
  
  res.json({data: res.locals.reservation})
}

async function update(req, res, next){
  const updatedReservation={
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  }
  const data = await service.update(updatedReservation);
  res.json({data})
}


async function updateStatus(req, res, next){

 const status = req.body.data.status;
 const {reservation_id} = res.locals.reservation;

 const updatedReservation = {
  reservation_id: reservation_id,
  status: status
 }

 const data = await service.updateStatus(updatedReservation);
 res.json({data})
}


module.exports = {
  create: [
    hasData,
    hasRequiredProperties,
    validNumberOfPeople,
    peopleIsNumber,
    validDateFormat,
    validTimeFormat,
    reservationOnTuesday,
    reservationNotInPast,
    bookedStatus,
    reservationTimeFrameValid,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasData,
    hasRequiredProperties,
    validNumberOfPeople,
    peopleIsNumber,
    validDateFormat,
    validTimeFormat,
    reservationOnTuesday,
    reservationNotInPast,
    bookedStatus,
    reservationTimeFrameValid,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    notFinished,
    asyncErrorBoundary(updateStatus),
  ],
  list: asyncErrorBoundary(list),
};
