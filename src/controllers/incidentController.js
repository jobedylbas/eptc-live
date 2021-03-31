const path = require('path')
const Incident = require(path.join(__dirname, '..', 'models', 'incident'))

/**
 * Find all incidents on database
 * returning only text and emoji
 *
 * @async
 * @function readIncidents
 */

  exports.readIncidents = async () => {
  const incidents = await Incident.find({})
  const incidentTweets = incidents.map(incident => {
    return {
      text: incident.tweet,
      emojiCode: incident.emojiCode
    }
  })
  return incidentTweets
}
