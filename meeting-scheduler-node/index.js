const express = require('express');
const app=express();
const mongoose=require('mongoose');
const http = require('http');
const fs=require('fs');
const bodyParser=require('body-parser');
const appConfig=require('./config/appConfig');
const socketLib=require('./libs/socketLib');
const routeLoggerMiddleware=require('./middleware/routeLogger');
const globalErrorMiddleware=require('./middleware/appErrorHandler');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});
//----------putting middlewares-----------------------------
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.errorHandler);
//------------importing directories of routes and models-----------------
const routePath='./routes';
const modelPath='./models';
//-----------------including all model files using loop-------------------
fs.readdirSync(modelPath).forEach(function(file){
    if(~file.indexOf('.js')){
        require(modelPath+'/'+file);
    }
})
//----------------including all route files using loop--------------------
fs.readdirSync(routePath).forEach(function(file){
    if(~file.indexOf('.js')){
        let route=require(routePath+'/'+file);
        route.setRouter(app);
    }
})
//-------------putting globalErrorMiddleware and notFoundHandler-------------
app.use(globalErrorMiddleware.notFoundHandler);
//----------assiging server to a variable-and-calling socketLib function-----
const server = http.createServer(app);
const socketServer = socketLib.setServer(server);
//----------listening server------------------------------
server.listen(3000);
server.on('listening', onListening);
server.on('error', onError);

function onListening(){
    console.log('server is listening');
    let db=mongoose.connect(appConfig.db.uri, {useNewUrlParser:true});
}

function onError(){
    console.log('error happened in server set up');
}
//-----------------------------------------------------------------------------
//-----mongoose connection error and open--event handlers----------------------
mongoose.connection.on('error', function(err){
    console.log(err);
})

mongoose.connection.on('open', function(err){
    if(err){
        console.log(err);
    } else {
        console.log('open connection success');
    }
})
//---------------------------------------------------------------------------