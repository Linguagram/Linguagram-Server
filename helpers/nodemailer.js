"use strict";

const nodemailer = require("nodemailer");
const { CLIENT_URL } = process.env;

let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 486,
  auth: {
    user: 'fredi.ramadan2000@gmail.com',
    pass: 'prxwhwwglrbcphkq'
  }
});

const sendMail = async (recipientEmail, username, link) => {
  // send mail with defined transport object
  return transporter.sendMail({
    from: `"Linguagram 🛰" <do-not-reply@linguagram.com>`, // sender address
    to: `${recipientEmail}`, // list of receivers
    subject: "Complete your registration", // Subject line
    html: `<b>Dear ${username}, 
            <br>
            <br>
            Welcome to Linguagram! Please click the link below to verify your email address in order to complete the registration.</b>
            <br>
            <br>
            <a href=${link} style='color: blue; text-decoration-line:underline;'><b>Verify your email address</b></a>
            ` // html body
  });
};

const sendNewFriendReqMail = async (recipientEmail, username) => {
  // send mail with defined transport object
  return transporter.sendMail({
    from: `"Linguagram 🛰" <do-not-reply@linguagram.com>`, // sender address
    to: `${recipientEmail}`, // list of receivers
    subject: "New Friend Request", // Subject line
    html: `<b>${username}, You've got a friend request!
            <br>
            <br>
            Your new friend are waiting for you to accept their friend request! Click the link below to go to Linguagram.</b>
            <br>
            <br>
            <a href=${CLIENT_URL} style='color: blue; text-decoration-line:underline;'><b>Linguagram</b></a>
            ` // html body
  });
};

module.exports = {
  sendMail,
  sendNewFriendReqMail,
}
