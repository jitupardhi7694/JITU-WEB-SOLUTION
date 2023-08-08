const jwt = require('jsonwebtoken');
const sendEmails = require('./init-gmail');
const profileModel = require('../models/createProfileModel');
const logger = require('./winston');

const { JWT_ACTIVE_KEY } = process.env;

const sendActivationLink = async (req, res, next, email) => {
    try {
        const user = await profileModel.findOne({ where: { email } });
        if (!user) {
            const errors = [
                {
                    msg: 'Unable to send Your Application on email. profile Model does not exist.',
                },
            ];
            return res.render('create_your_profile', { errors });
        }

        const secretKey = JWT_ACTIVE_KEY; // Generate a new secret key
        const token = jwt.sign({ email: user.email, id: user.id }, secretKey, {
            expiresIn: '2h',
        });

        let emailBodyText = `<p>Hi,</p>

        <p> Thank you for expressing your interest in working for Dinshaws. We appreciate your enthusiasm and look forward to the possibility of having you join our team.</p>
        
        <p> We are always on the lookout for talented individuals who are passionate about their work and share our values. Your interest in our company has not gone unnoticed, and we will definitely keep your profile in mind if a suitable opportunity arises in the future.</p>
        
        <p>  In the meantime, please feel free to visit our website or follow us on social media to stay updated on any job openings or company news. If you have any further questions regarding the work culture at Dinshaws, please feel free to write to us. </p>
        
        <p>  Thank you again for your interest in Dinshaws, and we hope to have the opportunity to connect with you in the future.</p>
        
        <p>   Regards, </p>
        <p>Dinshaw's Customer Delight Team </p>
        <hr style="color:#854382;">
         <p> Dinshaw's Building, Gittikhadan, Nagpur 440013</p>
         <p>www.dinshaws.co.in</p>
         <p>1800-120-9999</p>
         <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4yILfOv_VM_GUZhQLDIyGpOBSn2zXs2utk4dHLu1vLrg16dFVw0t-j7jLk8YT4ElmVhleYsIOU" width="563" height="101" style="margin-right:0px" class="CToWUd a6T" data-bit="iit" tabindex="0">
         <h3 class= "text-primary">Belief in Excellence I Belief in Joy & Happiness I Belief in Safety & Sustainability</h3>`;

        const emailOptions = {
            to: user.email,
            cc: '',
            bcc: '',
            // replyTo: 'customerdelight@dinshaws.co.in',
            subject: 'Your application for job at Dinshaws',
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
