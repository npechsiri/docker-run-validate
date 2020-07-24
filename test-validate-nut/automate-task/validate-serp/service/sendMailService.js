const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");


module.exports = {
    send: sendMail
}

/**
*
* @param {Mail.Options} mailOption  e.g. {from, to, subject, text}
*/
async function sendMail(mailOption) {

    /**
     * transporter need to be review and improve on protocol, current the secure option is set as false;
     */
    let transporter = nodemailer.createTransport({
        host: "cluster-mail.monetoring.com",
        port: 25,
        secure: false,
        auth: {
            user: "root",
            pass: ""
        }
    });

    let promisedMailInfo = await transporter.sendMail(mailOption); // can chain then() or give callback to 2nd parameter
    return promisedMailInfo;
}