const fetch = require('node-fetch')

exports.minimumTimePerRequest = 970 

/**
 * Create a search query string with the address
 *
 * @function createSearchAddressQuery
 * @param {object} address - Dic with params to bem transformed
 * @return {string} search query in string format
 */
 const createSearchAddressQuery = address => {
  const searchParams = {
    city: 'Porto Alegre',
    limit: 1,
    format: 'json',
    street: address
  }

  return new URLSearchParams(searchParams).toString()
}

/**
 * Get coordenites of given address
 *
 * @async
 * @function getIncidentCoordinates
 * @param {string} address
 * @return {object} lat and lon coordinates
 * @throws on unsucessful request
 */
 exports.getAddressCoordinates = async address => {
  const endpointUrl = 'https://nominatim.openstreetmap.org/search?'
  const searchParams = createSearchAddressQuery(address)
  const res = await fetch(endpointUrl + searchParams)
    .then(result => result.json())
  
  try {
    return {
      lat: res[0].lat,
      lon: res[0].lon
    }
  } catch {
    return null
  }
}
