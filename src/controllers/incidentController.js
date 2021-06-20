const path = require('path')
const Incident = require(path.join(__dirname, '..', 'models', 'incident'))

/**
 * Find all incidents on database
 *
 * @async
 * @function readIncidents
 * @returns {Object[]} - list of incidents
 */

  exports.readIncidents = async () => {
  const incidents = await Incident.find({})
  const incidentTweets = incidents.map(incident => {
    return {
      text: incident.tweet,
      emojiCode: incident.emojiCode,
      lat: incident.lat,
      lon: incident.lon
    }
  })
  return incidentTweets
}
