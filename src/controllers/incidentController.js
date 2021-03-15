const path = require('path')
const Incident = require(path.join(__dirname, '..', 'models', 'incident'))

/**
 * Insert many incidents in database
 *
 * @async
 * @function createIncidents
 * @param {Object[]} tweets - incident tweets
 *
 */
exports.createIncidents = async tweets => {
  const incidents = tweets.map(tweet => {
    return {
      tweet: tweet.text.replace(/https?:\/\/(.*)/, ''),
      id: tweet.id,
      date: Date.parse(tweet.created_at),
      emojiCode: getEmojiCode(tweet.text)
    }}
  )
  await Incident.bulkWrite(incidents.map(incident => ({
    updateOne: {
        filter: {id: incident.id},
        update: { '$set': incident },
        upsert: true
    }
  })))
}

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

/**
 * Find all incidents on database
 *
 * @async
 * @function readCompleteIncidents
 */
exports.readCompleteIncidents = async () => {
  const incidents = await Incident.find({})
  const incidentTweets = incidents.map(incident => incident)
  
  return incidentTweets
}

/**
 * Remove incident by Id
 *
 * @async
 * @function deleteIncident
 * @param {String} - id of incident to delete
 */
exports.deleteIncident = async incidentId => {
  await Incident.findOneAndDelete({ id: incidentId })
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

/**
 * Get emoji code that represents the incident
 *
 * @function getEmojiCode
 * @param {String} text - Incident text to find the representable tweet
 * @returns - string with emoji code
 */
const getEmojiCode = text => {
  const incidentQuery = ['acidente', 'colisão', 'atropelamento',  'moto']
  const liquidQuery = ['derramado', 'derramamento']
  const breakQuery = ['pane']
  const treeQuery = ['árvore', 'galho']
  const blockQuery = ['bloqueio']
  const electricQuery = ['fios', 'fiação']
  const bridgeQuery = ['içamento']
  const queries = [incidentQuery, liquidQuery, breakQuery, treeQuery, blockQuery, electricQuery, bridgeQuery]
  const emojis = ['26a0', '1F4a7', '1f527', '1f333', '1f6A7', '26a1', '2b06']
  let emojiCode = emojis[0]
  let found = true

  queries.every((query, index) => {
    query.some((word) => {
      if (text.toLowerCase().includes(word)) {
        emojiCode = emojis[index]
        found = false
        return true
      }
      return false
    })
    return found
  })

  return emojiCode
}
