const fetch = require('isomorphic-fetch')
const FormData =require('form-data')

module.exports = event => {
  console.log(event)

  if (!process.env['MAILGUN_API_KEY']) {
    console.log('Please provide a valid mailgun secret key!')
    return { error: 'Module not configured correctly.' }
  }

  if (!process.env['MAILGUN_DOMAIN']) {
    console.log('Please provide a valid mailgun domain!')
    return { error: 'Module not configured correctly.' }
  }

  const token = new Buffer(`api:${process.env['MAILGUN_API_KEY']}`).toString('base64')
  const endpoint = `https://api.mailgun.net/v3/${process.env['MAILGUN_DOMAIN']}/messages`

  const node = event.data.MailgunEmail.node
  const id = node.id
  const from = node.from
  const to = node.to
  const subject = node.subject
  const text = node.text

  console.log('Sending out email:')
  console.log(`[${id} - ${subject}] from ${from} to ${to}`)

  const form = new FormData()
  form.append('from', from)
  form.append('to', to)
  form.append('subject', subject)
  form.append('text', text)

  return fetch(endpoint, {
    headers: {
      'Authorization': `Basic ${token}`
    },
    method: 'POST',
    body: form
  })
  .then(response => response.json())
  .then(json => {
    console.log(`Email both valid, and queued to be delivered.`)
    console.log(json)

    return json
  })
  .catch(error => {
    console.log(`Email ${id} could not be sent because an error occured:`)
    console.log(error)

    return error
  })
}
