const response = require('./../libs/responseLib');

let errorHandler=(err, req, res, next)=>{
    console.log(err);
    let apiResponse=response.generate(true, 'Some Error Occurred', 500, null);
    res.send(apiResponse);
}

let notFoundHandler=(req, res, next)=>{
    console.log("URL Not found ");
    let apiResponse=response.generate(true, "requested URL not found", 404, null);
    res.status(404).send(apiResponse);
}

module.exports={
    errorHandler:errorHandler,
    notFoundHandler:notFoundHandler
}