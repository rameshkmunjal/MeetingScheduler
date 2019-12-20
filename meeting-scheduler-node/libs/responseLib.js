let generate=(error, message, status, data)=>{
    let response={
        error:error,
        message:message,
        data:data,
        status:status
    }  
    return response;  
}

module.exports={
    generate:generate
}