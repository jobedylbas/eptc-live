const path = require('path')
const twitterApi = require(path.join(__dirname, '..', 'services', 'twitterApi'))

/**
 * Get the replies of multiple incidents
 *
 * @async
 * @function getRepliesFromIncidents
 * @param {Array} incidentIds - tweet ids of incidents
 * @returns array of reply objects for each incident
 */
exports.searchRepliesOfIncidents = incidentsIds => {
  const promises = []
  incidentsIds.forEach(incidentId => {
    try {
      promises.push(new Promise(function (resolve) {
        searchRepliesFromIncident(incidentId, resolve)
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
const searchRepliesFromIncident = async (incidentId, resolve) => {
  // Edit query parameters below
  // specify a search query, and any additional fields that are required
  // by default, only the Tweet ID and text fields are returned
  const params = {}
  const resolvedIncidentWords = ['encerrada', 'encerrado', 'finalizada', 'finalizado', 'normalizada',
                                  'normalizado', 'liberada', 'liberado', 'removido']
  const resolvedIncidentQuery = resolvedIncidentWords.join(' OR ')
  params.query = `(${resolvedIncidentQuery}) is:reply from:EPTC_POA to:EPTC_POA conversation_id: ${incidentId}`
  params['tweet.fields'] = 'conversation_id'
  const res = await twitterApi.getTweets(params)

  resolve(res.data || [])
}

/**
 * Get tweet incidents of EPTC_POA
 *
 * @async
 * @function searchIncidents
 * @param {string} sinceDate - UTC ISO string representing start time of incidents
 * @returns {Object} - Tweets of the incidents
 */
exports.searchIncidents = async sinceDate => {
  const params = {}
  params.query = createQuery()
  params.max_results = 100
  params['tweet.fields'] = 'created_at'
  params.start_time = sinceDate

  const res = await twitterApi.getTweets(params)

  return res.data || []
}

/**
 * Create query for incident types
 * 
 * @function
 * @returns string with query to get tweets
 */
const createQuery = () => {
  const treeQuery = '((árvore (caída OR queda)) OR (galho (caído OR queda)))'
  const incidentQuery = '(acidente OR colisão OR atropelamento OR capotado OR capotamento OR (queda moto) OR (queda moticiclista))'
  const liquidQuery = '(derramado OR derramamento)'
  const breakQuery = '(pane)'
  const blockQuery = '(bloqueio OR obras OR obra)'
  const electricQuery = '((fios (caídos OR queda OR suspensos OR sobre)) OR (fiação (caída OR suspensa OR sobre)))'
  const bridgeQuery = '(içamento (acontece OR iniciado OR ocorre OR andamento OR (em operação)))'
  const horseQuery = '((cavalo solto) OR (cavalos (soltos OR (na via))))'
  const allQueries = [treeQuery, incidentQuery, liquidQuery, breakQuery, 
                    blockQuery, electricQuery, bridgeQuery, horseQuery]

  const stringQuery = allQueries.join(' OR ')

  return `(${stringQuery}) from:EPTC_POA`
}