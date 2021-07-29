const path = require('path')
const emojiHelper = require(path.join(__dirname, 'emoji'))
const Incident = require(path.join(__dirname, '..', 'models', 'incident'))

/**
 * Insert many incidents in database
 *
 * @async
 * @function createIncidents
 * @param {Object[]} tweets - incident tweets
 *
 */
exports.createIncident = async tweet => {
  const incident = new Incident({
      tweet: tweet.text.replace(/https?:\/\/(.*)/, ''),
      id: tweet.id,
      date: Date.parse(tweet.created_at),
      emojiCode: emojiHelper.getEmojiCode(tweet.text),
      lat: tweet.lat,
      lon: tweet.lon
  });
  
  await incident.save(err => {
    if (err) console.log(err);
  });
}

/**
 * Find all incidents on database
 *
 * @async
 * @function readIncidents
 */
exports.readIncidents = async () => {
  const incidents = await Incident.find({})
  const incidentTweets = incidents.map(incident => incident)
  
  return incidentTweets
}

/**
 * Return if object already exists
 *
 * @async
 * @function hasIncident
 * @param {String}
 * @return {Boolean}
 */
    exports.hasIncidentById = async id => {
    const incident = await Incident.findOne({ id: id })

    return incident !== null
  }

/**
 * Remove incident by Id
 *
 * @async
 * @function deleteIncident
 * @param {String} id of incident to delete
 */
exports.deleteIncidentById = async incidentId => {
  await Incident.deleteMany({ id: incidentId })
}

/**
 * 
 *
 * @async
 * @function findIncidentByLocation
 * @param {Object} incident
 */
 exports.hasIncidentByLocation = async incident => {
  const result = await Incident.findOne({ lat: incident.lat, lon: incident.lon })

  return result !== null
}


/**
 * Remove incidents that exists for more than 4 hours
 *
 * @async
 * @function removeOlderIncidents
 * @param {Date} date - since which date the incidents will be deleted
 */
exports.deleteOlderIncidents = async date => {
  await Incident.deleteMany({ date: { $lt: date } })
}