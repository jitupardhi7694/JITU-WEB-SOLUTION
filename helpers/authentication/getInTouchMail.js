const jwt = require('jsonwebtoken');
const sendEmails = require('./init-gmail');
const businessEnquiry = require('../../models/getInTouchModel');
const logger = require('./winston');
const e = require('connect-flash');
const { JWT_ACTIVE_KEY } = process.env;

const sendActivationLink = async (req, res, email, purpose) => {
    try {
        const user = await businessEnquiry.findOne({ where: { email } });
        if (!user) {
            const errors = [
                {
                    msg: 'Unable to send Your Application on email. Get In Touch does not exist.',
                },
            ];
            return res.render('index', { errors });
        }

        const secretKey = JWT_ACTIVE_KEY; // Generate a new secret key
        const token = jwt.sign({ email: user.email, id: user.id }, secretKey, {
            expiresIn: '2h',
        });
        console.log('Purpose:', purpose, typeof purpose);
        let emailSubject = 'Your email is received.';
        let emailBodyText = `<p> Hi, </p> <br>

            <p>  Thank you for expressing your interest in working for Jitu Web Solution. We appreciate your enthusiasm and look forward to the possibility of having business association with you.  Our team will contact you soon. </p> 
                  
            <p>  In the meantime, please feel free to visit our website or follow us on social media. If you have any further questions regarding the work culture at Jitu Web Solution, please feel free to write to us.  </p>

         <p> Thank you again for your interest in  Jitu Web Solution. </p>
         
         <p>Kind Regards, Jitu Web Solution</p>
        <hr style="color:#854382;">
        <p> Madhuban Apartment,  
        New Bidipeth, 
        Nagpur-440024,
        Maharashtra</p>
         <p>www.jituwebsolution.co.in</p>
         <p>8483931721</p>
         <img src="/img/jitu-logo.png" width="563" height="101" style="margin-right:0px" class="CToWUd a6T" data-bit="iit" tabindex="0">
        `;

        const emailOptions = {
            to: user.email,
            cc: '',
            bcc: '',
            // replyTo: 'customerdelight@dinshaws.co.in',
            subject: emailSubject,
            text: emailBodyText,
        };

        sendEmails(emailOptions);

        user.activation_key = token;
        const savedbusinessEnquiry = await user.save();
        logger.info(
            `Application  Email sent to: ${savedbusinessEnquiry.email}`
        );
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