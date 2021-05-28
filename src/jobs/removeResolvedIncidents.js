const path = require('path')
const incidentFinder = require(path.join(__dirname, '..', 'libs', 'incidentFinder'))
const incidentHelper = require(path.join(__dirname, '..', 'libs', 'incident'))

/**
 * Remove incidents from database that now has reply
 *
 * @async
 * @function removeIncidentsWithReply
 */
 exports.removeResolvedIncidents = async () => {
    console.log('Removing Incidents with reply.')
  
    let removedIncidentsCounter = 0
  
    const tweets = await incidentHelper.readIncidents()
    
    const replies = await incidentFinder.searchRepliesOfIncidents(tweets.map(tweet => { return tweet.id }))
  
    tweets.forEach((tweet, index) => {
      if (replies[index].length !== 0) {
        incidentHelper.deleteIncident(tweet.id)
        removedIncidentsCounter += 1
      }
    })
  
    console.log(`Remove incidents terminated. Number of removed incidents: ${removedIncidentsCounter}`)
  }