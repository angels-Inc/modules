const fetch = require('isomorphic-fetch')
const FormData =require('form-data')

module.exports = event => {
  console.log(event)

  if (!process.env['ONE_SIGNAL_API_KEY']) {
    console.log('Please provide a valid OneSignal API key!')
    return { error: 'Module not configured correctly.' }
  }

  if (!process.env['ONE_SIGNAL_APP_ID']) {
    console.log('Please provide a valid OneSignal app id!')
    return { error: 'Module not configured correctly.' }
  }

  const content = event.data.content
  const segments = event.data.segments || ['All Users']

  const token = new process.env['ONE_SIGNAL_API_KEY']
  const endpoint = 'https://onesignal.com/api/v1/notifications'

  const data = JSON.stringify({
    'app_id': app_id,
    'contents': {
      'en': content,
    },
    'included_segments': segments
  })

  return fetch(endpoint, {
    headers: {
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: data
  })
  .then(response => response.json())
  .then(json => {
    console.log(`Email both valid, and queued to be delivered.`)
    console.log(json)

    return { data: { id: json.id, recipients: json.recipients } }
  })
  .catch(error => {
    console.log(`Email ${id} could not be sent because an error occured:`)
    console.log(error)

    return { error: 'An unexpected error occured.' }
  })
}
