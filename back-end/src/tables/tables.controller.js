//import error components
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


//import service file
const service = require("./tables.service");




async function create(req, res) {
   const newTable = await service.create(req.body.data);
   res.status(201).json({
    data: newTable,
   });
}

async function list(req, res){
    res.json({
        data: tables,
    })
}

module.exports = {
  create: asyncErrorBoundary(create),
  list,
};