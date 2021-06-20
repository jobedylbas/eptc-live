const path = require('path');
const IncidentMetrics = require(path.join(__dirname, '..', 'models', 'incidentMetrics'))
const emojiHelper = require(path.join(__dirname, 'emoji'))


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
    type: emojiHelper.getEmojiCode(incident.text),
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