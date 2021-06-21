const path = require('path')
const IncidentMetrics = require(path.join(__dirname, '..', 'models', 'incidentMetrics'))

/**
 * Find all incident metrics
 *
 * @async
 * @function readIncidentsMetrics
 * @return {Object[]} - list of incidentMetrics
 */

  exports.readIncidentsMetrics = async () => {
  const incidentMetrics = await IncidentMetrics.find({})
  
  const metrics = incidentMetrics.map(incidentMetric => {
    return {
      id: incidentMetric.id,
      type: incidentMetric.type,
      hasAddress: incidentMetric.hasAddress,
      isLocalized: incidentMetric.isLocalized
    }
  })

  return metrics
}
