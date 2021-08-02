const path = require('path')
const incidentFinder = require(path.join(__dirname, '..', 'libs', 'incidentFinder'))
const incidentHelper = require(path.join(__dirname, '..', 'libs', 'incident'))
const incidentMetricsHelper = require(path.join(__dirname, '..', 'libs', 'incidentMetrics'))
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
  console.log(`Number of incidents found: ${tweets.length}`)
  
  const replies = await incidentFinder.searchRepliesOfIncidents(tweets.map(tweet => { return tweet.id }))
  console.log(`Number of replies found: ${replies.filter(reply => { return reply.length !== 0 }).length}`)

  const newIncidents = tweets.filter((tweet, index) => {
    if (replies[index].length === 0) return tweet
  })
  console.log(`Number of incidents found without reply: ${newIncidents.length}`)
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
  let incidentsWithAddress = 0
  let incidentsWithoutAddress = 0

  for (let incident of newIncidents) {
    const incidentAddresses = addressHelper.parseIncidentLocation(incident.text)
  
    for (let incidentAddress of incidentAddresses) {
      if (incidentAddress !== '') {
        const coordinates = await nominatim.getAddressCoordinates(incidentAddress)
        const incidentWithCoordinates = addIncidentCoordinates(incident, coordinates)

        if (incidentWithCoordinates) {
          const hasIncident = await incidentHelper.hasIncidentByLocation(incidentWithCoordinates)

          if (!hasIncident) {
            localizedIncidentAddedCounter++
            await incidentHelper.createIncident(incidentWithCoordinates)
            await addIncidentMetrics(incident, true, true)
          } 
        } else {
          incidentsWithAddress++
          await addIncidentMetrics(incident, true, false)
        }
  
        await new Promise(resolve => setTimeout(resolve, nominatim.minimumTimePerRequest))
      } 
    }

    if(incidentAddresses.length === 0) {
      incidentsWithoutAddress++
      await addIncidentMetrics(incident, false, false)
    }
  }
  
  console.log(`Number of incidents with address: ${incidentsWithAddress}`)
  console.log(`Number of incidents without address: ${incidentsWithoutAddress}`)
  console.log(`Number of localized incidents added: ${localizedIncidentAddedCounter}`)
}

/**
 * Join incident with its coordinates
 * 
 * @function addIncidentCoordinates
 * @param {Object} incident - Tweet
 * @return {Object} Lat and Long object
 */
const addIncidentCoordinates = (incident, coordinates) => {
  if (coordinates) {
    return { ...incident, ...coordinates }
  }
  return null
}

/**
 * Create an incident metrics
 * 
 * @function addIncidentMetric
 * @param {Object} incident - Incident
 * @param {Boolean} hasAddress - Boolean that represent if the incident has address
 * @param {Boolean} isLocalized - Boolean if nominatim localize the address
 */
const addIncidentMetrics = async (incident, hasAddress, isLocalized) => {
  const hasIncidentMetric = await incidentMetricsHelper.hasIncidentMetricsById(incident.id)
  
  if (!hasIncidentMetric) {
    await incidentMetricsHelper.createIncidentMetrics(incident, hasAddress, isLocalized)
  }
}