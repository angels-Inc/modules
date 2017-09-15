'use latest'

module.exports = function(event) {
  console.log(event)

  if (!process.env['SENDGRID_API_KEY']) {
    console.log('Please provide a valid Sendgrid secret key!')
    return { error: 'Email module not configured correctly.' }
  }

  if (!event.data.Email || !event.data.Email.node) {
    console.log('An unexpected error occured.')
    return { error: 'An unexpected error occured.' }
  }

  const id = event.data.Email.node.id
  const fromEmail = event.data.Email.node.fromEmail
  const toEmail = event.data.Email.node.toEmail
  const subject = event.data.Email.node.subject
  const content = event.data.Email.node.content

  console.log('Sending out email:')
  console.log(`[${id} - ${subject}] from ${fromEmail} to ${toEmail}`)

  const mailHelper = require('sendgrid').mail
  const mail = new mailHelper.Mail(
    new mailHelper.Email(fromEmail),
    subject,
    new mailHelper.Email(toEmail),
    new mailHelper.Content('text/plain', content)
  )

  const sg = require('sendgrid')(process.env['SENDGRID_API_KEY'])
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  })

  return new Promise((resolve, reject) => {
    sg.API(request, (error, response) => {
      if (error) {
        console.log(`Email ${id} could not be send because an error occured:`)
        console.log(error)

        return resolve({})
      } else {
        console.log(`Email was successfuly sent!`)

        return resolve({})
      }
    })
  })
}
