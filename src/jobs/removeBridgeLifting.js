const path = require('path')
const incidentHelper = require(path.join(__dirname, '..', 'libs', 'incident'))

/**
 * Remove incidents older the date
 *
 * @async
 * @function removeBridgeLiftingIncidents
 * @param {Date} sinceDate
 */
 exports.removeBridgeLiftingIncidents = async sinceDate => {
    console.log("Removing bridge lifting.")
    await incidentHelper.deleteBridgeLiftingIncidents(sinceDate.toISOString())
    console.log("Removing bridge lifting completed.")
}