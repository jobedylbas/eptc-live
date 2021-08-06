/**
 * Get the address description from a text
 *
 * @function parseIncidentLocation
 * @param {string} incidentText - Usually a tweet text from EPTC_POA
 * @return {Object} address on format: Number St. Name
 */
 exports.parseIncidentLocation = incidentText => {
    const tmpText = incidentText.toString().toLowerCase().slice(8).replace(/https?:\/\/(.*)/, '')
    const bridgeQueries = ['vão móvel', 'ponte', 'guaíba']
    
    const numbers = tmpText.match(/(,| )\d+( |\n)*(?=,|\.|\n|)/g)
    const streets = tmpText.match(/\b((av)|(rua)|(estr)|(estr)|(trav)|(beco)|(r\.))+((.+?)(?=(,|\n|(\d+(?=,ß|\n)| no sentido| próximo))))/g)

    // Check if has street and number
    if (streets && numbers) {
      let addresses = []

      streets.forEach((street) => {
        if (!street.includes(' x ')) {
          const streetLastIndex = tmpText.match(street).index + street.length - 1
          const number = numbers.find((number) => {
            return streetLastIndex < tmpText.match(number).index
          })
          
          if (number) {
            let address = `${number.trim()} ${street.trim()}`
            addresses.push(address)
          }
        }
      })
      
      return addresses
    }
    
    if(!streets) {
      // Check if it is Ponte do Guaíba
      if (bridgeQueries.some((word) => tmpText.includes(word))) {
        return ['ponte do guaíba']
      }

      // Check if it is a tunnel
      if (tmpText.includes("túnel"))  {
        return ['túnel da conceição']
      }

      // Check if it is a localizable address with no number
      const noNumberAddress = tmpText.match(/\b((viadut)+(((.|\n)+?)(?=(,|\.))))/g)
      if (noNumberAddress) {
        if (noNumberAddress.length === 1) {
          return [noNumberAddress[0].trim()]
        }
      }
    }
    
    
    return []
  }