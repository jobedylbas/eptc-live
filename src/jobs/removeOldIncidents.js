const path = require('path')
const incidentHelper = require(path.join(__dirname, '..', 'libs', 'incident'))

/**
 * Remove incidents older the date
 *
 * @async
 * @function removeOlderIncidents
 * @param {Date} sinceDate
 */
 exports.removeOldIncidents = async sinceDate => {
    console.log("Removing old incidents.")
    await incidentHelper.deleteOlderIncidents(sinceDate.toISOString())
    console.log("Removing old incidents completed.")
  }