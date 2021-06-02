const path = require('path')
const incidentFinder = require(path.join(__dirname, '..', 'libs', 'incidentFinder'))
const incidentHelper = require(path.join(__dirname, '..', 'libs', 'incident'))
const addressHelper = require(path.join(__dirname, '..', 'libs', 'address'))
const nominatim = require(path.join(__dirname, '..', 'services', 'nominatim'))

/**
 * Add new valid incidents to database
 *
 * @async
 * @function findNewIncidents
 * @param {Date} sinceDate - Limit date to find tweets
 */
exports.findNewIncidents = async (sinceDate) => {
  console.log('Finding new incidents...')

  const tweets = await incidentFinder.searchIncidents(sinceDate.toISOString())

  const replies = await incidentFinder.searchRepliesOfIncidents(tweets.map(tweet => { return tweet.id }))
  
  const newIncidents = tweets.filter((tweet, index) => {
    if (replies[index].length === 0) return tweet
  })
  console.log(`Task terminated. Number of incidents found: ${newIncidents.length}`)
  await addNewIncidents(newIncidents)
}

/**
 * Add new valid incidents to database
 *
 * @async
 * @function addNewIncidents
 * @param {Object[]} newIncidents - incidents finded
 */
const addNewIncidents = async (newIncidents) => {
  let localizedIncidentAddedCounter = 0
  let incidentWithAddressCounter = 0

  for (let incident of newIncidents) {
    const incidentAddresses = addressHelper.parseIncidentLocation(incident.text)
    
    for (incidentAddress in incidentAddresses) {
      incidentWithAddressCounter++
      
      if (incidentAddress !== '') {
        const coordinates = await nominatim.getAddressCoordinates(incidentAddress)
        incident = addIncidentCoordinates(incident, coordinates)

        if (incident) {
          if (incidentHelper.hasIncidentByLocation(incident.id)) {
            await incidentHelper.createIncident(incident)
          localizedIncidentAddedCounter++
          }
        }
  
        await new Promise(resolve => setTimeout(resolve, nominatim.minimumTimePerRequest))
      }
    }
    
  }

  console.log(`Task terminated. Number of incidents added: ${localizedIncidentAddedCounter}`)
}

/**
 * Join incident with its coordinates
 * 
 * @function addIncidentCoordinates
 * @param {Object} incident - Tweet
 * @returns {Object} - Lat and Long object
 */
const addIncidentCoordinates = (incident, coordinates) => {
  if (coordinates) {
    return { ...incident, ...coordinates }
  }
  return null
}