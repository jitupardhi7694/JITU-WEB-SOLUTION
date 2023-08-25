const jwt = require('jsonwebtoken');
const sendEmails = require('./init-gmail');
const profileModel = require('../../models/registerModel');
const logger = require('./winston');
const host = require('../../config/host-config');

const { JWT_ACTIVE_KEY } = process.env;

const sendActivationLink = async (req, res, next, email) => {
    try {
        const userName = profileModel.findAll();
        const user = await profileModel.findOne({ where: { email } });
        if (!user) {
            const errors = [
                {
                    msg: 'Unable to send Your Application on email. User Register Model does not exist.',
                },
            ];
            return res.render('register', { errors });
        }

        const secretKey = JWT_ACTIVE_KEY; // Generate a new secret key
        const token = jwt.sign({ email: user.email, id: user.id }, secretKey, {
            expiresIn: '2h',
        });

        let emailBodyText = `
        <p> Hello ${userName.name} </p>
        <p>You registered an account on Jitu Web Solution, before being able to use your account you need to verify that this is
            your email address by </p>
        <p>clicking here: <a href="${host.PROTOCOL}://${host.HOST}:${host.PORT}/user/activate/${token} class="btn btn-outline-success">Activate Email</a> </p>
        <p>This link valid upto 2hr</p>

        <p>Kind Regards, Jitu Web Solution</p>
        <hr style="color:#854382;">
        <p> Madhuban Apartment,  
        New Bidipeth, 
        Nagpur-440024,
        Maharashtra</p>
         <p>www.jituwebsolution.co.in</p>
         <p>8483931721</p>
         <img src="../public/img/jitu-logo.png" width="563" height="101" style="margin-right:0px" class="CToWUd a6T" data-bit="iit" tabindex="0">
          
        `;

        const emailOptions = {
            to: user.email,
            cc: '',
            bcc: '',
            subject: `Jitu With Code User Verification Email`,
            text: emailBodyText,
        };

        sendEmails(emailOptions);

        user.activation_key = token;
        const savedprofileModel = await user.save();
        logger.info(`Application  Email sent to: ${savedprofileModel.email}`);
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
