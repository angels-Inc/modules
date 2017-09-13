const fromEvent = require('graphcool-lib').fromEvent

// replace with your GitHub credentials
const client_id = '__CLIENT_ID__'
const client_secret = '__CLIENT_SECRET__'

module.exports = function (event) {
  const code = event.data.githubCode
  const graphcool = fromEvent(event)
  const api = graphcool.api('simple/v1')

  function getGithubToken () {
    console.log('Getting access token...')
    return fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code
      })
    })
      .then(data => data.json())
      .then(json => json.access_token)
  }

  function getGithubAccountData (githubToken) {
    if (!githubToken) {
      console.log('The code passed is incorrect or expired.')
      return Promise.reject()
    }

    console.log('Getting account data...')

    return fetch(`https://api.github.com/user?access_token=${githubToken}`)
      .then(response => response.json())
      .then(parsedResponse => {
        if (parsedResponse.error) {
          console.log(parsedResponse.error.message)
          return Promise.reject(parsedResponse.error.message)
        } else {
          return parsedResponse
        }
      })
  }

  function getGraphcoolUser (githubUser) {
    console.log('Getting Graphcool user...')

    return api
      .request(
        `
    query {
      GithubUser(githubUserId: "${githubUser.id}") {
        id
      }
    }`
      )
      .then(userQueryResult => {
        if (userQueryResult.error) {
          return Promise.reject(userQueryResult.error)
        } else {
          return userQueryResult.GithubUser
        }
      })
  }

  function createGraphcoolUser (githubUser) {
    console.log('Creating Graphcool user...')

    return api
      .request(
        `
      mutation {
        createGithubUser(
          githubUserId:"${githubUser.id}"
        ) {
          id
        }
      }`
      )
      .then(userMutationResult => {
        return userMutationResult.createGithubUser.id
      })
  }

  function generateGraphcoolToken (graphcoolUserId) {
    return graphcool.generateAuthToken(graphcoolUserId, 'GithubUser')
  }

  return getGithubToken().then(githubToken => {
    return getGithubAccountData(githubToken)
      .then(githubUser => {
        return getGraphcoolUser(githubUser).then(graphcoolUser => {
          if (graphcoolUser === null) {
            return createGraphcoolUser(githubUser)
          } else {
            return graphcoolUser.id
          }
        })
      })
      .then(generateGraphcoolToken)
      .then(token => {
        return { data: { token: token } }
      })
      .catch((error) => {
        return { error: 'The code passed is incorrect or expired.' }
      })
  })
}
