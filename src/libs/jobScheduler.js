const { time } = require('console')
const cron = require('node-cron')
const path = require('path')
const config = require(path.join(__dirname, '..', 'config'))
const incidentFinder = require(path.join(__dirname, '..', 'jobs', 'findIncidents'))
const resolvedIncidentRemover = require(path.join(__dirname, '..', 'jobs', 'removeResolvedIncidents'))
const oldIncidentRemover = require(path.join(__dirname, '..', 'jobs', 'removeOldIncidents'))

const prodTimeLimit = 240
const devTimeLimit = 8640

/**
 * Get valid date for tasks to execute
 *
 * @function generateLimitDate
 * @returns - date to be used on tasks
 */
const generateLimitDate = (lessMinutes) => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - lessMinutes)

  return d
}

/**
 * Verify date is at comercial hour
 * 
 * @function isComercialHour
 * @returns true if is comercial hour or false if it is not
 */
const isComercialHour = () => {
  const d = new Date()
  const day = d.getDay()

  if (day > 0 && day < 6) {
    const hour = d.getHours()
    return (hour => 7 && hour <= 22)
  }
  return false
}

/**
 * Schedule to find new incidents
 *
 * @function scheduleToFindNewIncidents
 */
exports.scheduleToFindNewIncidents = () => {
  cron.schedule('* * * * *', async () => {
    if (isComercialHour || !config.web.isProd) {
      const dateLimit = generateLimitDate(config.web.isProd ? prodTimeLimit : devTimeLimit)
      incidentFinder.findNewIncidents(dateLimit)
    }
  })
}

/**
 * Schedule to remove incidents that are resolved
 *
 * @function scheduleToRemoveIncidentsWithReply
 */
exports.scheduleToRemoveIncidentsWithReply = () => {
  cron.schedule('* * * * *', async () => {
    if (isComercialHour) {
      resolvedIncidentRemover.removeResolvedIncidents()
    }
  })
}

/**
 * Schedule to remove old incidents that
 * probably are resolved
 *
 * @function scheduleToRemoveOldIncidents
 */
exports.scheduleToRemoveOldIncidents = () => {
  cron.schedule('0 */15 * * * *', () => {
    oldIncidentRemover.removeOldIncidents(generateLimitDate(240))
  })
}
