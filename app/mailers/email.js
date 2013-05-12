var nodemailer = require('nodemailer');



exports.send_email = function (user, next) {
    
    // Create a SMTP transport object
    transport = nodemailer.createTransport("SMTP", {
            service: 'Gmail', // use well known service
            auth: {
                user: "lenghan1991@gmail.com",
                pass: "lenghan19911023"
            }
        });



    console.log('SMTP Configured');

    console.log(user);
    // Message object
    var message = {

        // sender info
        from: 'Sender Name <lenghan1991@gmail.com>',

        // Comma separated list of recipients
        to: 'Receiver Name <' + user.email+ '>',

        // Subject of the message
        subject: 'Welcome', //

        text: "Welcome"+ user.username,

        // An array of alternatives
        alternatives:[
        {
            contentType: "text/x-web-markdown",
            contents: '**markdown** alternative'
        },
        {
            contentType: "text/html; charset=utf-8",
            contentEncoding: "7bit",
            contents: '<h1>html alternative</h1>'
        }
        ]
    };

    console.log('Sending Mail');
    console.log(message);
    transport.sendMail(message, function(error){
        if(error){
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');

        // if you don't want to use this transport object anymore, uncomment following line
        //transport.close(); // close the connection pool
    });
}

exports.send_password_reset_token = function (user, next) {
    
    // Create a SMTP transport object
    transport = nodemailer.createTransport("SMTP", {
            service: 'Gmail', // use well known service
            auth: {
                user: "lenghan1991@gmail.com",
                pass: "lenghan19911023"
            }
        });



    console.log('SMTP Configured');

    console.log(user);
    // Message object
    var message = {

        // sender info
        from: 'Sender Name <lenghan1991@gmail.com>',

        // Comma separated list of recipients
        to: 'Receiver Name <' + user.email+ '>',

        // Subject of the message
        subject: 'password_reset', //

        text: "Welcome"+ user.username,

        // An array of alternatives
        alternatives:[
        {
            contentType: "text/x-web-markdown",
            contents: '**markdown** alternative'
        },
        {
            contentType: "text/html; charset=utf-8",
            contentEncoding: "7bit",
            contents: '<h1>html alternative</h1>\n<p> please click the link to own the right of password_reset\nhttp://localhost:3000/send_forgot_email/callback?token='+user.password_reset_token.toString()+'\n</p>'
        }
        ]
    };

    console.log('Sending password reset Mail');
    console.log(message);
    transport.sendMail(message, function(error){
        if(error){
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');

        // if you don't want to use this transport object anymore, uncomment following line
        //transport.close(); // close the connection pool
    });
};