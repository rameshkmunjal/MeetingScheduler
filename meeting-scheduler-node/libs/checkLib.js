'use strict'
//function - to validate input value 
let isEmpty=(value)=>{
    if(value===null || value===undefined || value===''){
        return true;
    } else {
        return false;
    }
}

module.exports={
    isEmpty:isEmpty
}