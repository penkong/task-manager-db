
const sgMail = require('@sendgrid/mail');

const sendGridAPIKey = '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';

sgMail.setApiKey(sendGridAPIKey);
//all sending about email define here
// sgMail.send({
//   to : 'nazemi.works@gmail.com',
//   from : 'nazemi.works@gmail.com',
//   subject : 'This. is. my. first. creation.',
//   text : 'i hope this one send to my mail'
// })

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to : email,
    from : 'nazemi.works@gmail.com',
    subject : 'Thanks for join us',
    text : `Dear ${name}. Please click link below to verify.`,
    html : '<h1>hello</h1><p>show text email</p>'
  })
}
const sendByeEmail = (email, name) => {
  sgMail.send({
    to : email,
    from : 'nazemi.works@gmail.com',
    subject : 'hope you back soon',
    text : `we like to see you again. best regards.`,
    html : '<h1>BYBYB</h1><p>show text email</p>'
  })
}

module.exports = {
  sendWelcomeEmail,
  sendByeEmail
}