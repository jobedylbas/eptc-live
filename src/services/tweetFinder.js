const path = require('path')
const twitterApi = require(path.join(__dirname, 'twitterApi'))

/**
 * @constant
 * @type {Object}
 */
const params = {
  max_results: 100
}

/**
 * Get the replies of multiple incidents
 *
 * @async
 * @function getRepliesFromIncidents
 * @param {Array} incidentIds - tweet ids of incidents
 * @returns array of reply objects for each incident
 */
exports.getRepliesOfIncidents = incidentsIds => {
  const promises = []
  incidentsIds.forEach(incidentId => {
    try {
      promises.push(new Promise(function (resolve) {
        getRepliesFromIncident(incidentId, resolve)
      }))
    } catch {
      console.log(`Some error getting replies from incident: ${incidentId}`)
    }
  })
  return Promise.all(promises)
}

/**
 * Get tweets that are replies from an incident
 *
 * @async
 * @function getRepliestFromIncident
 * @param {Number} incidentId - incidentId to get replies
 * @returns {Object} with replied tweets from the incident tweet
 */
const getRepliesFromIncident = async (incidentId, resolve) => {
  // Edit query parameters below
  // specify a search query, and any additional fields that are required
  // by default, only the Tweet ID and text fields are returned
  params.query = `is:reply from:EPTC_POA to:EPTC_POA conversation_id: ${incidentId}`
  params['tweet.fields'] = 'conversation_id'

  const res = await twitterApi.getTweets(params)

  resolve(res.data || [])
}

/**
 * Get tweet incidents of EPTC_POA
 *
 * @async
 * @function getIncidents
 * @param {string} sinceDate - UTC ISO string representing start time of incidents
 * @returns {Object} - Tweets of the incidents
 */
exports.getIncidentsTweets = async sinceDate => {
  const treeQuery = '((árvore (caída OR queda)) OR (galho (caído OR queda)))'
  const incidentQuery = '(acidente OR colisão OR atropelamento OR (queda moto))'
  const liquidQuery = '(derramado OR derramamento)'
  const breakQuery = '(pane)'
  const blockQuery = '(bloqueio)'
  const allQueries = [treeQuery, incidentQuery, liquidQuery, breakQuery, blockQuery]

  const stringQuery = allQueries.join(' OR ')

  params.query = `(${stringQuery}) -is:reply from:EPTC_POA`
  params['tweet.fields'] = 'created_at'
  params.start_time = sinceDate

  const res = await twitterApi.getTweets(params)

  return res.data || []
}
