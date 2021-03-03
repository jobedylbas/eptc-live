const path = require('path')
const tweetFinder = require(path.join(__dirname, 'tweetFinder'))
const incidentController = require(path.join(__dirname, '..', 'controllers', 'incidentController'))

/**
 * Add new valid incidents to database
 *
 * @async
 * @function createNewIncidents
 * @param {Date} sinceDate - Limit date to find tweets
 */
exports.createNewIncidents = async (sinceDate) => {
  console.log('Finding new incidents...')

  const tweets = await tweetFinder.getIncidentsTweets(sinceDate.toISOString())

  const replies = await tweetFinder.getRepliesOfIncidents(tweets.map(tweet => { return tweet.id }))
  
  const newIncidents = tweets.filter((tweet, index) => {
    if (replies[index].length === 0) return tweet
  })

  await incidentController.createIncidents(newIncidents)
  console.log(`Task terminated. Number of incidents added: ${newIncidents.length}`)
}

/**
 * Remove incidents from database that now has reply
 *
 * @async
 * @function removeIncidentsWithReply
 */
exports.removeIncidentsWithReply = async () => {
  console.log('Removing Incidents with reply.')

  let removedIncidentsCounter = 0

  const tweets = await incidentController.readCompleteIncidents()
  
  const replies = await tweetFinder.getRepliesOfIncidents(tweets.map(tweet => { return tweet.id }))
  
  tweets.forEach((tweet, index) => {
    if (replies[index].length !== 0) {
      incidentController.deleteIncident(tweet.id)
      removedIncidentsCounter += 1
    }
  })

  console.log(`Remove incidents terminated. Number of removed incidents: ${removedIncidentsCounter}`)
}

/**
 * Remove incidents older the date
 *
 * @async
 * @function removeOlderIncidents
 * @param {Date} sinceDate
 */

exports.removeOlderIncidents = async sinceDate => {
  console.log("Removing old incidents.")
  incidentController.deleteOlderIncidents(sinceDate.toISOString())
  console.log("Removing old incidents completed.")
}
