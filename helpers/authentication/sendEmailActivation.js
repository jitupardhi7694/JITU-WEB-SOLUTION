const jwt = require('jsonwebtoken');
const sendEmails = require('./init-gmail');
const registerModel = require('../../models/registerModel');
const logger = require('./winston');
const host = require('../../config/host-config');

const sendActivationLink = async (req, res, next, email) => {
    try {
        const user = await registerModel.findOne({ where: { email } });
        if (!user) {
            const errors = [
                {
                    msg: 'Unable to send Your Application on email. User Register Model does not exist.',
                },
            ];
            return res.render('register', { errors });
        }

        // Generate a new secret key
        const token = jwt.sign(
            { email: user.email, id: user.id },
            process.env.JWT_ACTIVE_KEY,
            { expiresIn: '2h' }
        );

        let emailBodyText = `
        <p> Hello ${user.name} </p>
        <p>You registered an account on Jitu Web Solution, before being able to use your account you need to verify that this is
            your email address by </p>
        <p>clicking here: <a href="${host.PROTOCOL}://${host.HOST}:${host.PORT}/user/activate/${token} class="btn btn-outline-success">Activate Email</a> </p>
        <p>This link valid upto 2hr</p>

        <p>Kind Regards, Jitu Web Solution</p>
        <hr style="color:#854387;">
        <p> Madhuban Apartment,  
        New Bidipeth, 
        Nagpur-440024,
        Maharashtra</p>
         <a href="https://jitu-web-solution-codespace.onrender.com/">www.jituwebsolution.co.inxz</a>
         <p>8483931721</p> `;

        const emailOptions = {
            to: user.email,
            cc: '',
            bcc: '',
            subject: `Jitu Web Solution  User Verification Email`,
            text: emailBodyText,
        };

        sendEmails(emailOptions);

        user.activation_key = token;
        const savedregisterModel = await user.save();
        logger.info(`Application  Email sent to: ${savedregisterModel.email}`);
        return {
            success: true,
            message: 'Application  email send successfully.',
        };
    } catch (error) {
        logger.error(error);
        console.log('error in activation ' + error.message);
        throw error;
    }
};

module.exports = sendActivationLink;
