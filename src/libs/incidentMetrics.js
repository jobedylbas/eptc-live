const path = require('path');
const IncidentMetrics = require(path.join(__dirname, '..', 'models', 'incidentMetrics'))

/**
 * Insert incident metrics
 *
 * @async
 * @function createIncidentMetrics
 * @param {Object} incident
 * @param {Boolean} hasAddress
 * @param {Boolean} isLocalized 
 */
exports.createIncidentMetrics = async (incident, hasAddress, isLocalized) => {
  const incidentMetrics = new IncidentMetrics({
    id: incident.id,
    date: incident.created_at,
    type: getIncidentType(incident.text),
    hasAddress: hasAddress,
    isLocalized: isLocalized
  })

  await incidentMetrics.save(err => {
    if (err) console.log(err);
  });
}

/**
 * Find all incidents metrics on database
 *
 * @async
 * @function readIncidentMetrics
 */
 exports.readIncidentMetrics = async () => {
  const incidentMetrics = await Incident.find({})
  
  return incidentMetrics
}

/**
 * Return if object already exists
 *
 * @async
 * @function hasIncidentMetrics
 * @param {String}
 * @returns {Boolean}
 */
 exports.hasIncidentMetricsById = async id => {
  const incidentMetrics = await IncidentMetrics.findOne({ id: id })

  return incidentMetrics !== null
}

/**
 * Create a query to find the emoji for each case
 * 
 * @function createEmojiQuery 
 * @returns {Object[]} - list of query for each emoji
 */
 const createIncidentTypeQuery = () => {
  const runOverQuery = ['atropelamento']
  const incidentQuery = ['acidente', 'colisão', 'capotado']
  const motorcycle = ['queda de moto']
  const liquidQuery = ['derramado', 'derramamento']
  const breakQuery = ['pane']
  const treeQuery = ['árvore', 'galho']
  const blockQuery = ['bloqueio']
  const electricQuery = ['fios', 'fiação']
  const bridgeQuery = ['içamento']
  const horseQuery = ['caval']

  // Order is important
  const queries = [runOverQuery, motorcycle, incidentQuery, liquidQuery, breakQuery, treeQuery, 
                  blockQuery, electricQuery, bridgeQuery, horseQuery]

  return queries
}
/**
 * Get emoji code that represents the incident
 *
 * @function getEmojiCode
 * @param {String} text - Incident text to find the representable emoji
 * @returns - string with emoji code
 */
 const getIncidentType = text => {
    const queries = createIncidentTypeQuery()
    let type = 1
    let found = true
  
    queries.every((query, index) => {
      query.some((word) => {
        if (text.toLowerCase().includes(word)) {
          type = index
          found = false
          return true
        }
        return false
      })
      return found
    })

    return type
}