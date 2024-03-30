import asyncHandler from 'express-async-handler';

import nodemailer from 'nodemailer';

export const sendMail = asyncHandler(async (data, req, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        // port: 465,
        // secure: true,
        port: 587,
        secure: false, // true for 465, false for other parts
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            // user: "REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM",
            // pass: "REPLACE-WITH-YOUR-GENERATED-PASSWORD",
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_P,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper
    // async function main() {
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Hey People 👻" <abc@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
    // }

    // main().catch(console.error);
});