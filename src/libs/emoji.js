/**
 * Create a query to find the emoji for each case
 * 
 * @function createEmojiQuery 
 * @returns {Object[]} - list of query for each emoji
 */
const createEmojiQuery = () => {
  const incidentQuery = ['acidente', 'colisão', 'atropelamento', 'capotado', 'moto']
  const liquidQuery = ['derramado', 'derramamento']
  const breakQuery = ['pane']
  const treeQuery = ['árvore', 'galho']
  const blockQuery = ['bloqueio', 'obra']
  const electricQuery = ['fios', 'fiação']
  const bridgeQuery = ['içamento']
  const horseQuery = ['caval']

  // Order is important
  const queries = [incidentQuery, liquidQuery, breakQuery, treeQuery, 
                  blockQuery, electricQuery, bridgeQuery, horseQuery]

  return queries
}

/**
 * Get emoji code that represents the incident
 *
 * @function getEmojiCode
 * @param {String} text - Incident text to find the representable emoji
 * @returns - string with emoji code
 */
 exports.getEmojiCode = text => {
    const queries = createEmojiQuery()
    const emojis = ['26a0', '1F4a7', '1f527', '1f333', '1f6A7', '26a1', '26f4', '1f40e']
    let emojiCode = emojis[0]
    let found = true
  
    queries.every((query, index) => {
      query.some((word) => {
        if (text.toLowerCase().includes(word)) {
          emojiCode = emojis[index]
          found = false
          return true
        }
        return false
      })
      return found
    })
  
    return emojiCode
}