'use strict';
const nodemailer = require('nodemailer');

function createTransport() {
    // create reusable transporter object using the default SMTP transport
    return nodemailer.createTransport({
            service: 'SendPulse', // no need to set host or port etc.
            auth: {
                user: '*****',
                pass: '*****'
            }
       });
}

function verifyTransporter(transporter) {
    // verify connection configuration
    transporter.verify(function(error, success) {
       if (error) {
            console.log(error);
       } else {
            console.log('Server is ready to take our messages');
       }
    });
}

function getMailOptions() {
    return {
               from: '"Abhishek Bhandari" <abhi10901@gmail.com>', // sender address
               to: '', // list of receivers
               subject: 'Verify your email.', // Subject line
               text: 'Hello world ?', // plain text body
               html: '<b>Hello world ?</b>' // html body
           };
}

function EmailService() {
    this.transporter = null;
    this.mailOptions = getMailOptions();
}

EmailService.prototype.sendVerificationCode = function(user) {
    this.transporter = createTransport();
    verifyTransporter(this.transporter);

    this.mailOptions.text = 'Hello ' + user.name.firstName + ' ' + user.name.lastName;
    this.mailOptions.html = '<b>Hello ' + user.name.firstName + ' ' + user.name.lastName + '</b>';
    this.mailOptions.html = this.mailOptions.html +
                            '<br/><br/>' +
                            '<p> Use this verification code : ' + user.verificationCode + '</p>';

    this.mailOptions.to = user.email;

    // send mail with defined transport object
    this.transporter.sendMail(this.mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    this.transporter.close();
};

module.exports = new EmailService();