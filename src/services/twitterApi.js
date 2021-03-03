// Search for Tweets within the past seven days
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/quick-start/recent-search

const needle = require('needle')
const path = require('path')
const config = require(path.join(__dirname, '..', 'config'))

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = config.twitter.bearer_token

/**
 * @constant
 * @type {string}
 */
const endpointUrl = 'https://api.twitter.com/2/tweets/search/recent'

/**
 * Get recent tweets using params
 *
 * @async
 * @function getTweets
 * @param {Object} queryObject - query to search tweets
 * @returns {Object} - with tweets based on params
 * @throws on unsuccessul request
 */
exports.getTweets = async queryObject => {
  const res = await needle('get', endpointUrl, queryObject, {
    headers: {
      'User-Agent': 'v2RecentSearchJS',
      authorization: `Bearer ${token}`
    }
  })

  if (res.body) {
    return res.body
  } else {
    throw new Error('Unsuccessful request')
  }
}
