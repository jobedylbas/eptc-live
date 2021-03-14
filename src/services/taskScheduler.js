const cron = require('node-cron')
const path = require('path')
const taskManager = require(path.join(__dirname, 'taskManager'))

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
  const hour = d.getHours()
  const day = d.getDay()

  if (day > 0 && day < 6) {
    return (hour => 7 && hour <= 21)
  }
  return false
}

/**
 * Schedule to find new incidents
 *
 * @function scheduleToFindNewIncidents
 */
exports.scheduleToFindNewIncidents = () => {
  cron.schedule('0 */2 * * * *  ', async () => {
    if (isComercialHour) {
      taskManager.createNewIncidents(generateLimitDate(15))
    }
  })
}

/**
 * Schedule to remove incidents that are resolved
 *
 * @function scheduleToRemoveIncidentsWithReply
 */
exports.scheduleToRemoveIncidentsWithReply = () => {
  cron.schedule('0 */2 * * * *', async () => {
    if (isComercialHour) {
      taskManager.removeIncidentsWithReply()
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
    const d = new Date()
    const day = d.getDay()
    if (day < 6 && day > 1 && d.getHours() > 10) {
      taskManager.removeOlderIncidents(generateLimitDate(240))
    }
  })
}
