const jwt = require('jsonwebtoken');
const sendEmails = require('./init-gmail');
const User = require('../../models/registerModel');
const logger = require('./winston');
const host = require('../../config/host-config');

async function sendResetPasswordLink(req, res, next, email) {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // User Exists, return back to form
            let errors;
            errors.push({
                msg: 'Unable to send reset password link email, User does not exist.',
            });
            return res.render('register', { errors });
        }
        // User found, Generate a token, send email and update token in user record...
        // const secretKey = process.env.JWT_RESET_KEY; // Generate a new secret key
        const token = jwt.sign(
            { email: user.email, id: user.id },
            process.env.JWT_RESET_KEY,
            {
                expiresIn: '2h',
            }
        );

        let emailBodyText = `
        <p> Hello ${user.name} </p>
        <p>You registered an account on Jitu Web Solution, before being able to use your account you need to verify that this is
            your email address by </p>
        <p>clicking here: <a  href="${host.PROTOCOL}://${host.HOST}:${host.PORT}/forgotPassword/${token} class="btn btn-outline-success">Activate Email</a> </p>
        <p>This link valid upto 2hr</p>

        <p>Kind Regards, Jitu Web Solution</p>
        <hr style="color:#854382;">
        <p> Madhuban Apartment,  
        New Bidipeth, 
        Nagpur-440024,
        Maharashtra</p>
         <p>www.jituwebsolution.co.in</p>
         <p>8483931721</p>
          
        `;

        const emailOptions = {
            to: user.email,
            cc: '',
            subject: 'Jitu Web Solution User - Reset your password',
            text: `<h2>Use the link below to reset your password.</h2><br><a style="background-color: #66a3ff; color: white; padding: 1em 4em;text-decoration:none; border-radius: 10px" href="${host.PROTOCOL}://${host.HOST}:${host.PORT}/user/forgotPassword/${token}"> Click here to reset password.</a>.<br><br>The link is valid only for 2 hours.<br>The link will work only once.<br><br><strong>Thanks and Regards,</strong><br><strong>Jitu Web Solution </strong>`,
        };
        sendEmails(emailOptions);
        user.reset_key = token;
        const savedUser = await user.save();
        logger.info(`Password Reset Email sent to:' ${savedUser.email}`);

        return {
            success: true,
            message: 'Reset Link sent on  email  successfully.',
        };
    } catch (error) {
        logger.error(error);
        return error;
    }
}

module.exports = sendResetPasswordLink;
