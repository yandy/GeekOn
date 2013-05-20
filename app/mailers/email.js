var nodemailer = require('nodemailer');

exports.send_email = function (user, next) {

    // Create a SMTP transport object
    transport = nodemailer.createTransport("SMTP", {
        host: "smtp.exmail.qq.com",
        secureConnection: true,
        port: 465,
        auth: {
            user: "di.wang@geekstack.org",
            pass: "password123"
        }
    });

    // Message object
    var message = {

        // sender info
        from: 'Hemslo Wang <di.wang@geekstack.org>',

        // Comma separated list of recipients
        to: user.username + ' <' + user.email + '>',

        // Subject of the message
        subject: '欢迎加入极客行动', //
        generateTextFromHTML: true,

        html: '<p>' + user.username + ',</p>' +
        '<p>您好！您已经在极客行动官网注册成功。<br />' +
        '现在您可以对项目留言，还可以报名参加感兴趣的项目了。<br />' +
        '我们期待您的参与！</p><p>极客行动组委会<br />' +
        '联系邮箱：di.wang@geekstack.org <br />' +
        '<a href="http://geekon.geekstack.org">极客行动官方网站</a><br /></p>'

    };

    transport.sendMail(message, function (error) {
        if (error) {
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');

        // if you don't want to use this transport object anymore, uncomment following line
        transport.close(); // close the connection pool
    });
};

exports.send_password_reset_token = function (user, next) {

    // Create a SMTP transport object
    transport = nodemailer.createTransport("SMTP", {
        host: "smtp.exmail.qq.com",
        secureConnection: true,
        port: 465,
        auth: {
            user: "di.wang@geekstack.org",
            pass: "password123"
        }
    });

    // Message object
    var message = {

        // sender info
        from: 'Hemslo Wang <di.wang@geekstack.org>',

        // Comma separated list of recipients
        to: user.username + ' <' + user.email + '>',

        // Subject of the message
        subject: '重置口令', //

        // An array of alternatives
        html: '<p>' + user.username + ',</p>' +
        '<p> 您好！这是修改密码的链接：' +
        'http://localhost:3000/send_forgot_email/callback?token=' + user.password_reset_token.toString() +
        '如果链接无法直接点击，请复制链接到您的浏览器地址栏打开。</p>' +
        '<p>极客行动组委会<br /> 联系邮箱：di.wang@geekstack.org <br />' +
        '<a href="http://geekon.geekstack.org">极客行动官方网站</a><br /></p>'
    };

    transport.sendMail(message, function(error){
        if(error){
            console.log('Error occured');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');

        // if you don't want to use this transport object anymore, uncomment following line
        transport.close(); // close the connection pool
    });
};
