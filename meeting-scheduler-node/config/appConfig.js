//creating an appConfig object and assigning properties to it
let appConfig = {} 
appConfig.port=3000;
appConfig.apiVersion="/api/v1";
appConfig.allowedCorsOrigin='*';
appConfig.db={
    uri : 'mongodb://127.0.0.1:27017/meetingDB'
}
appConfig.env='env';

//export above object - ready to use in other files
module.exports={
    port:appConfig.port,
    environment:appConfig.env,
    apiVersion:appConfig.apiVersion,
    allowedCorsOrigin:appConfig.allowedCorsOrigin,
    db:appConfig.db
}
