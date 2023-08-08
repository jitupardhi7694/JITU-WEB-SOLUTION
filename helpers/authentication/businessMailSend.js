const jwt = require('jsonwebtoken');
const sendEmails = require('./init-gmail');
const businessEnquiry = require('../models/businessEnquiryModel');
const logger = require('./winston');
const e = require('connect-flash');
const { JWT_ACTIVE_KEY } = process.env;

const sendActivationLink = async (req, res, email, purpose) => {
    try {
        const user = await businessEnquiry.findOne({ where: { email } });
        if (!user) {
            const errors = [
                {
                    msg: 'Unable to send Your Application on email. business Enquiry does not exist.',
                },
            ];
            return res.render('businessEnquiry', { errors });
        }

        const secretKey = JWT_ACTIVE_KEY; // Generate a new secret key
        const token = jwt.sign({ email: user.email, id: user.id }, secretKey, {
            expiresIn: '2h',
        });
        console.log('Purpose:', purpose, typeof purpose);
        let emailSubject = 'Your email is received.';
        let emailBodyText = '<p> Thank you for your email.</p>';
        if (purpose === '1') {
            emailSubject = 'Your Feedback/Suggestion is received.';
            emailBodyText = `<p> Dear Sir, </p> </br>
                      
                    <p>We thank you for your feeback/suggestion. </p>
                    <p>  Our executives will review it soon and we will revert soon.</p> 
                    <p>  Please bear with us till then.</p> 
                      
                    <p>   Regards, </p>
                    <p>Dinshaw's Customer Delight Team </p>
                    <hr style="color:#854382;">
                    <p> Dinshaw's Building, Gittikhadan, Nagpur 440013</p>
                    <p>www.dinshaws.co.in</p>
                     <p>1800-120-9999</p>
                    <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4yILfOv_VM_GUZhQLDIyGpOBSn2zXs2utk4dHLu1vLrg16dFVw0t-j7jLk8YT4ElmVhleYsIOU" width="563" height="101" style="margin-right:0px" class="CToWUd a6T" data-bit="iit" tabindex="0">
                    <h3 class= "text-primary">Belief in Excellence I Belief in Joy & Happiness I Belief in Safety & Sustainability</h3>`;
        } else if (purpose === '2') {
            emailSubject = ' Your Trade Enquiry is received.';
            emailBodyText = `<p> Hi, </p> <br>

            <p>  Thank you for expressing your interest in working for Dinshaws. We appreciate your enthusiasm and look forward to the possibility of having business association with you.  Our team will contact you soon. </p> 
                  
            <p>  In the meantime, please feel free to visit our website or follow us on social media. If you have any further questions regarding the work culture at Dinshaws, please feel free to write to us.  </p>

         <p> Thank you again for your interest in Dinshaws. </p>
         
         <p>   Regards, </p>
        <p>Dinshaw's Customer Delight Team </p>
        <hr style="color:#854382;">
         <p> Dinshaw's Building, Gittikhadan, Nagpur 440013</p>
         <p>www.dinshaws.co.in</p>
         <p>1800-120-9999</p>
         <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4yILfOv_VM_GUZhQLDIyGpOBSn2zXs2utk4dHLu1vLrg16dFVw0t-j7jLk8YT4ElmVhleYsIOU" width="563" height="101" style="margin-right:0px" class="CToWUd a6T" data-bit="iit" tabindex="0">
         <h3 class= "text-primary">Belief in Excellence I Belief in Joy & Happiness I Belief in Safety & Sustainability</h3>`;
        }
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
