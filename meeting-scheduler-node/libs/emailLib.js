//including nodemailer - npm package
const nodemailer = require('nodemailer');
//function - to send meeting info to all users - by email
let sendMeetingInfo=(data, user)=>{
    let tempDt=new Date(data.mtgStartDate);
    let day=tempDt.getDate();
    let month=tempDt.getMonth()+1;
    let year=tempDt.getFullYear();
    let mtgDate=""+day+"/"+month+"/"+year+"";
    const output = `    <p>You are coordially invited to attend following meeting at stipulated date and time:</p> 
                                            
                        <p>${data.meetingName} - Dated : ${mtgDate} Time : ${data.startTime}</p>                        
                            <p>Venue : ${data.meetingVenue} </p>                            
                            <p>Contact : ${data.convenor} - ${data.convenorMobile} </p> 
                            <p>Please make it convenient to attend the same</p>                                               
                    `;

                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true, // true for 465, false for other ports
                        auth: {
                            user: 'rkm120562@gmail.com', // generated ethereal user
                            pass: 'rkm@100283'  // generated ethereal password
                        },
                        tls:{
                            rejectUnauthorized:false
                        }
                    });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: 'rkm120562@gmail.com', // sender address
                    to: `${user.email}`, // list of receivers
                    subject: `${data.meetingName} - Dated : ${mtgDate} From : ${data.startTime} To : ${data.endTime}`, // Subject line
                    text: `Dear ${user.firstName} ${user.lastName} ! Please attend the above named meeting`  , // plain text body
                    html: output // html body
                };

                //send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                       
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    res.render('contact', {msg:'Email has been sent'});
                });                
}
//------------------------sendOTP - function to send OTP by email ----------------------------------
let sendOTP=(otp, emailAddress)=>{
    const output = `                        
        <h2>Password Recovery Mail</h2>
        <p>Please use this OTP to reset your password</p>                        
        <p>${otp}</p>
        `;

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                    user: 'rkm120562@gmail.com', // generated ethereal user
                    pass: 'rkm@100283'  // generated ethereal password
                },
            tls:{
					rejectUnauthorized:false
                }
        });

    // setup email data with unicode symbols
        let mailOptions = {
            from: 'rkm120562@gmail.com', // sender address
            to: emailAddress, // list of receivers
            subject: 'Password Recovery Mail', // Subject line
            text: 'Hello Sir/Madam ! ', // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }                       
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('contact', {msg:'Email has been sent'});
        });
}

module.exports={
    sendMeetingInfo:sendMeetingInfo,
    sendOTP:sendOTP
}