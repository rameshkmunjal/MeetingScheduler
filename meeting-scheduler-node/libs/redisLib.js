//18.188.57.132 - redis connection
const check=require('./checkLib');
const redis=require("redis");
const host="18.224.2.71";
const port="6379";
var client = redis.createClient(port, host);

client.on('connect', ()=>{
    console.log("Redis connectionn successfully opened");
})
       

client.on('error', (err) => {
    console.log("Got an error" + JSON.stringify(err));
});

let getAllUsersInAHash = (hashName, callback) => {
    console.log("Get all users in hash");
    client.HGETALL(hashName, (err, result) => {
        

        if (err) {

            console.log("Get all users in hash " + JSON.stringify(err));
            callback(err, null)

        } else if (check.isEmpty(result)) {

            console.log("online user list is empty");
            console.log(result)

            callback(null, {})

        } else {

            console.log(result);
            callback(null, result)

        }
    });


}// end get all users in a hash


// function to set new online user.
let setANewOnlineUserInHash = (hashName, key, value, callback) => {
   
    client.HMSET(hashName, [
        key, value
    ], (err, result) => {
        if (err) {
            console.log("setAnewonline user in hash " + JSON.stringify(err));
            callback(err, null)
        } else {

            console.log("user has been set in the hash map");
            console.log(result)
            callback(null, result)
        }
    });
}// end set a new online user in hash

let getMeetingInHash = (hashName, meetingId,  callback) => {
    console.log("line number 60 "+ meetingId);
    client.HGET(hashName, meetingId, (err, result) => {
        if (err) {
            console.log("getMeeting in Hash " + JSON.stringify(err));
            callback(err, null);
        } else if (check.isEmpty(result)) {
            console.log("meeting object is empty");
            console.log(result);
            callback(null, {});
        } else {
            console.log(result);
            callback(null, result);
        }
    });
}

let deleteUserFromHash = (hashName,key)=>{
    client.HDEL(hashName,key);
    return true;

}// end delete user from hash

// function to set new online user.
let setNewMeetingInHash = (hashName, key, value, callback) => {   
    client.HMSET(hashName, [
        key, value
    ], (err, result) => {
        if (err) {

            console.log("setNewMeetingInHash "+JSON.stringify(err));
            callback(err, null)
        } else {
            console.log("new meeting has been set in the hash map");
            console.log(result)
            callback(null, result)
        }
    });
}// end set a new online user in hash

let deleteMeetingFromHash = (hashName,key)=>{

    client.HDEL(hashName,key);
    return true;

}// end delete user from hash

module.exports = {
    getAllUsersInAHash:getAllUsersInAHash,
    setANewOnlineUserInHash:setANewOnlineUserInHash,
    deleteUserFromHash:deleteUserFromHash,
    setNewMeetingInHash:setNewMeetingInHash,
    getMeetingInHash:getMeetingInHash,
    deleteMeetingFromHash:deleteMeetingFromHash
}