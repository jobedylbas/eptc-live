/**
 * Get the address description from a text
 *
 * @function parseIncidentLocation
 * @param {string} incidentText - Usually a tweet text from EPTC_POA
 * @returns {string} address on format: Number St. Name
 */
 exports.parseIncidentLocation = incidentText => {
    const tmpText = incidentText.toString().toLowerCase().slice(8).replace(/https?:\/\/(.*)/, '')
    const queries = ['vão', 'móvel', 'ponte', 'guaíba']
    
    if (tmpText.includes('içamento') && queries.some((word) => tmpText.includes(word))) {
      return 'ponte do guaíba'
    }
    
    const number = tmpText.match(/(,| )\d+?( |\n|)*(?=,|\.)/g)
    const street = tmpText.match(/\b((av)|(r\.)|(rua)|(estr)|(trav)|(beco))+((.+?)(?=(,|\.|\n|(\d+(?=,|\.|\n)))))/g)
    
    // Check if has street and number
    if (street && number) {
      if (street.length === 1 && number.length === 1) {
        return `${number[0].trim()} ${street[0].trim()}`
      } 
    }
    // Check if it is a tunnel
    if (tmpText.includes("túnel")) {
      return 'túnel da conceição'
    } 
    // Check if it is a localizable address with no number
    const noNumberAddress = tmpText.match(/\b((via)+(((.|\n)+?)(?=(,|\.))))/g)
    if (noNumberAddress) {
      if (noNumberAddress.length === 1) {
        return noNumberAddress[0].trim()
      }
    }
    
    return ''
  }