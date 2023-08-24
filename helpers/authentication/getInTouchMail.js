const jwt = require('jsonwebtoken');
const sendEmails = require('./init-gmail');
const businessEnquiry = require('../../models/getInTouchModel');
const logger = require('./winston');
const e = require('connect-flash');
const { JWT_ACTIVE_KEY } = process.env;
const config = require('../../config/host-config');

const sendActivationLink = async (req, res, email, id) => {
    try {
        const user = await businessEnquiry.findOne({ where: { id } });
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

        let emailSubject = 'Your email is received.';
        let emailBodyText = `<p> Hi, </p> 

            <p>  Thank you for expressing your interest in working for Jitu Web Solution. We appreciate your enthusiasm and look forward to the possibility of having business association with you.  Our team will contact you soon. </p> 
                  
            <p>  In the meantime, please feel free to visit our website or follow us on social media. If you have any further questions regarding the work culture at Jitu Web Solution, please feel free to write to us.  </p>

            <p> Thank you again for your interest in  Jitu Web Solution. </p>
         
        
            <hr style="margin: 0; padding:0; border: 1.7px solid #854382; width: auto">
            <p style="margin: 0; padding: 0;">Regards, </p>
            <p style="margin: 0; padding: 0;">www.jituwebsolution.com </p>
            <p style="margin: 0; padding: 0 0 6px 0;">Madhuban Apartment, New Bidipeth, Nagpur-440024
            Maharashtra </p>
            <p style="margin: 0; padding: 0;">8483931721</p>
            <img src="data:image/png;base64,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" width="563" height="101" style="margin-right:0px" class="CToWUd a6T" data-bit="iit" tabindex="0">
        `;

        const emailOptions = {
            to: user.email,
            cc: '',
            bcc: '',
            replyTo: config.REPLY_EMAIL,
            subject: emailSubject,
            text: emailBodyText,
        };

        sendEmails(emailOptions);

        const InternalEmailOptions = {
            to: config.GET_TOUCH_EMAIL,
            subject: `An email is received from  - ${user.name}`,
            text: `
                  Name: ${user.name}<br>
                  Email: ${user.email}<br>
                  Mobile: ${user.phone_number}<br>
                  Message: ${user.message}<br><br> 
   
                  <hr style="margin: 0; padding:0; border: 1.7px solid #854382; width: auto">
                 <p style="margin: 0; padding: 0;">Regards, </p>
                 <p style="margin: 0; padding: 0;">www.jituwebsolution.com </p>
                 <p style="margin: 0; padding: 0 0 6px 0;">Madhuban Apartment, New Bidipeth, Nagpur-440024
                 Maharashtra </p>
                 <p style="margin: 0; padding: 0;">8483931721</p>
                 <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPcAAAAqCAIAAADgTlr1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA
                 AJcEhZcwAADsMAAA7DAcdvqGQAAApESURBVHhe7Zw/TGLLF8clu2BcNZKfhmg0b2FNjL+wWYNx143Gt4GsbB7Lvshzo5GwjRYUhkYLCkODDYmxkYaEUEH
                 xCkpKWkvKW9JSUlKSN3fmnLlz/+FF0N/+9s0nUzzGufP3O2fOnHv3TUgkEolEIpFIJBKJRCKRSCQSiUQiGYWZdOfo7/7RXWMGMiSSX43rd5X+j79J6q4
                 HIUsi+bUINv9QJd7/UW0tQJZE8msxk+lSQ95P5ssuyJMMhyvU2Ct1N6Ix+P2zEPNlu7FCY9YNv/+1JN/cMXelv5eKQN6YoGvfC6cvcfPElnLdg4qaAxl
                 PhPfm3V3v4LY5/OrSHpba/iE9t6U8ncN8GX4/junzpYyyX4XlIOl7qbORup58tEaDzS+0nvdxyBgLrlAzXOkdlFqLXsj5GQjMppT9UuetpaXx1vdgTjtv/
                 JA34Su+ve3u5+sj2gA8JZQlyChvs7Z0agi8Sty/v6i9GqO9iStJ2tB2IgA5Dvlw/40++CV9DjnOGF3lRDqf2eSYUrLSfhMaciAM9EW3E5AxJLH5dCuUvvH
                 ATwCX9Se6xQVmM1225D9KzVnI1HAlQBDkrzzAQh6hw+gnySMjiM+k8oj3VNkrKOu6/VZ+T9t67EpY4a3tsv4P6YPNXfRoh3vBD5DjkFFV7r7ZBBPei2QbK
                 9GryeD1Yqr5sdTnq/MKig7DiCqHo8CkZn/5baG9lx3VCI4LQeJkyQu1l5CvsZCDv/6R0byIl8dt7akRhG5SuSVg4Mep8onIbwXWf2XJ3Hl30hsve5fN1vE
                 qyGJNwoZ3yIgqf5lq09723u0aehV4sdv4vdL/rHl9wzCyyunjP3XkTSfxkztLsfIYIplfyKIEZtOdE3z20UI3q9wTvQ/fKq/Z+es+nz+urRzfs5P6c5b8N
                 0k33HXxhBuhXNPng58avuJ6rgWV2MDPKLPTAga7cj8HGQi6K+KGV3En59NKuNT7ThzlSjeca8ybdoig8tBMvPnxrpeoksK9/XxzKRiCQvbARFkdtna4/Nf
                 +bCdW6X2v9hN2DZlV7j5fvlBCKfOeIW5t632mCM6J72qRrEVaOVAf731M06WJX8Ff3Zev853wBRbmuCOzdOwH1f5RlTju1pcK11rtLSxfYPJDfeO2y8rHb
                 lsrDuZKxInEtVmwiiGOQegmlZ+vlWht1OZ5Uh1WuSFFTpNiYaPm+Pkz+BB3wxFhdFrcxS30DQxuCborOtPlWqvvgCEQU28ndS5WiyqvL+V7fNp54U+nD1ji
                 V2k2UR2/eUtbEJg9bSd0TUCKZfXKM6scbiym09XfiNCS7J46n2VTYUybUVoYKumuiTbeV9yg62VI5kvFIsxVbS6jCQxTd93xDcSZxDUV2vmvowrdpPLLdTYR7GQn80L2faXHmjghu5/c3O9aaLyhsFnlIKkH/IoAFNM7LaIzdpQrCqO2cld85W3YEt2Pmbpqz6ivTHN62wntdoFtqW70SUlZT9UWosWV01YEj0qxsAV4jBBNrO6eDd4SU6cdNoRkpbNxWluMFpkHzzpwmLvRHjerPKHQYiaV60uy4Bgxsawh1TBXelpEEioRzIF2r+jH8k3/cXEhWlvNdnArCoENPlfEfrPC8eJCvLaa6zIZWPrVVoRbh1B7//B2QKzUSQyRmI2OVlv2BrKd8YDKATu/fESVT7iiLTKPtGZuHs5W6ZCPYEnav/FYGOrsc/oMciYCCzlq0qrKks7ExojBpvmtBZxbrvLDQl0XLJq++i8bstlB0hH4z4VmmMiu2C+01o+vZ3ymE9wHMTGT0cFeic79Y1UOQKbJLzeqPODFW7thM7tCEMpM3tb5IcPnauc4KezngA+uiMoi5AzGocotY4hG/o9Vzp0T7aQCKfeCYQjCcE2ju9JZ5VOBPs/usckE4NTx/YMr135tcjlcu7B/4Li3JTSXUmK0pJiOSororeKUWjTEx3uUw2V6HpXjRH27uDafQlNp5pdqGoO5qtwbo+3oCBmbs8GRx2IZQ9TzxB4L8GQq18wD2GwwOXeNKf4nqATdFfVPSKj5VX0WzmtDYtPyFfsGXbqtW522cMV3FIN3R6Z2y6sXyt4dNEFTbyvOdlpgmcWOrBvCAfKZeR6Vw0QZAhiIZhEgA+aqUDNuCbvm7HlY6JYxRIGnuH0+s8o1p0W1x2jqwDZzu07uoBbuCl/LQenbxRUrC13SjYtjO5AHmD5byOBBCg6P5QRqGCf8eVRu+GkE1pcP33auhlc5YbDQ7WKIjCeKJD63yjWnpVCbYvfOassHY0EfPVdEt1LvueEBupViIU5Til6+wGmxtU8qj1U5BeeQBTTwKmWjcrLi6l+5M/A8KgdTYqNOd22H1szvfuNVOUEndN3tFUdl+R3iuN4KwXGhNfEYlbOwowhM011jEjIGgUdW9wutjVtfAg6z+xXdFV2FGFyz8MtNQJe0LSTgb7AXAkN/bsCAcwbWnk+pRUO4bzV/xlbl+iAgAUvqLg8OVY4TpTsJETxONWM6dpUTBKEL13y0ENYxRLyKOZZ4UF1I43Hhq+2gHcXdNZTKMbBqiE644RTS7liDQaeFJr211mLnasI4PQdFU2nNT0MWEngRuhbfnsLKEec7YwiN89CHEM8xEllUy3Q342LMgaEuH3v8NXscnStTQxOehMLcG21bmlWO328Ztq4nxTa8fn4cqpy/aTYGo8gM44oLi/gUKieYv9Z6KIY47NdaGNVJVhT/7vmkPzkXv/8dPaLNKFfDIJUfZIue5b8mlyN88bhX/TVfm/Wqlbi8lyt5tmnFagejhXL1AXIVjACQZBFoIh0QxgVhbJfvaoUFd4kJoDkErnLSsU+Z4hTdFUJvB7sr8P6LpMTt/cruuYcM1h3xBK/9GEU+ypfRUvBt04/lYFqoBw/viXSGyaxyvnWrnfUoG1FoKtr8xOyRePkm4OOfTs88y8lJHtY0qlyIGFbaWC0xBLUtGJfVu4Vxq9yEoxjiUES8unCvlvQmx1Ll/JsTlsTDVFtRQzrMl42vl+1Bp8XqGyz8rssmaqELpBqSODRYuVLH8rvCgW8tVFzLxU0wChYpWeFvyijuyzU0UoZEdqPOmlqoXFOkKZnfO2LoCRJGsk0qJ5CTxPJ1LEmGj3CeSeUOYoiPIDRzrHwRHIATsq3DhiOYuU88LoaoRwcEzv40fPLvTs5n2n9inTT19jLGb0EfgDpUCeuNob6OOTF3ScAVVG2SuIePTEObo27hYfbGtXyzXtAFAUlvHX0gTr+WET8uJylZ7Vo/TguLs00aCmdrMwbPijoMRPqGD8EtRlRSltcszkZXqM6/i/zCPx+gr4RPTP9KmFS7gevIq101amBiKqUGNoj04TfHW96qqFuav2sbiYdiiKMQeEGONr9wuo0HrFbwZ56b6ZjaAX9SdScsID2MaX2DwkKOY1zev1hDDgaL0/KohviIXhpvHaPxwEQ9E+g22IXxJZJfAPn/pZBIJBKJRCKRSCQSiUQikUgkEolEIpFIJBKJ5H/GxMQ/Z2FywTkfZdAAAAAASUVORK5CYII=" width="563" height="101" style="margin-right:0px" class="CToWUd a6T" data-bit="iit" tabindex="0">
                  `,
        };
        sendEmails(InternalEmailOptions);

        user.activation_key = token;
        const savedGetTouch = await user.save();
        logger.info(`Application  Email sent to: ${savedGetTouch.email}`);
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
