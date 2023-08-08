const jwt = require('jsonwebtoken');
const sendEmails = require('./init-gmail');
const User = require('../models/userModel');
const logger = require('./winston');
// const { v4: uuidv4 } = require('uuid');
const host = require('../config/host-config');
const { JWT_ACTIVE_KEY } = process.env;

const sendActivationLink = async (req, res, next, email) => {
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            const errors = [
                {
                    msg: 'Unable to send activation email. User does not exist.',
                },
            ];
            return res.render('userDashboard/register', { errors });
        }

        const secretKey = JWT_ACTIVE_KEY; // Generate a new secret key
        const token = jwt.sign({ email: user.email, id: user.id }, secretKey, {
            expiresIn: '2h',
        });

        const emailOptions = {
            to: user.email,
            cc: '',
            bcc: '',
            subject: 'Dinshaws User Registered - Please Activate your account',
            text: `<h2>You are now registered with Dinshaws Family.</h2><br>Please activate your account.
            <br><br><a style="background: rgb(246, 165, 236); color: black; padding: 1em 4em;text-decoration:none;
             border-radius: 10px" href="${host.PROTOCOL}://${host.HOST}:${host.PORT}/user/activate/${token}">
              Activate by clicking here.</a>.<br><br>The link is valid only for 2 hours.<br>This link can be used only once.
              <br><br><strong>Thanks and Regards,</strong><br><strong>Dinshaws Team</strong>`,
        };

        sendEmails(emailOptions);

        user.activation_key = token;
        const savedUser = await user.save();
        logger.info(`Activation Email sent to: ${savedUser.email}`);
        return {
            success: true,
            message: 'Activation email sent successfully.',
        };
    } catch (error) {
        logger.error(error);
        console.log('error in activation ' + error.message);
        throw error;
    }
};

module.exports = sendActivationLink;
