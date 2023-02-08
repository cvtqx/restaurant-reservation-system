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

    const data = await service.list();
    
    res.json({
        data,
    })
}

async function update(req, res, next){
  const updatedTable ={
    ...req.body.data,
    table_id: req.body.data.table_id,
    
  };
  const data = await service.update(updatedTable);
  res.json({data});

}

module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
  update: asyncErrorBoundary(update),
};