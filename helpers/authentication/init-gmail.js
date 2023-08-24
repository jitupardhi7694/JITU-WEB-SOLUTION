const nodemailer = require('nodemailer');
const logger = require('./winston');

// create reusable transporter object using the default SMTP transport

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'jituwebsolution7709@gmail.com', // generated ethereal user
        pass: 'fpvbgvymqcyxtdrk', // generated ethereal password
    },
});

// send mail with defined transport object
async function sendEmails(mailOptions) {
    // check if mailOptions has all the required property, if not replace with default options
    const defaultOptions = {
        from: 'Jitu Web Solution <jituwebsolution7709@gmail.com>',
        to: 'jituwebsolution7709@gmail.com',
        cc: '',
        bcc: '',
        subject: 'Email from Jitu Web Solution',
        text: 'Default text of email from Jitu Web Solution ',
    };
    const normalizedEmailOptions = { ...defaultOptions, ...mailOptions };
    normalizedEmailOptions.html = normalizedEmailOptions.text; // copy text to add html option also
    // console.log(normalizedEmailOptions);

    transporter.sendMail(normalizedEmailOptions, (error, info) => {
        if (error) {
            return logger.error(error);
        }
        return logger.info('Message sent: %s', info.messageId);
    });
}

module.exports = sendEmails;
