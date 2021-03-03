const config = {}

config.twitter = {}
config.mongodb = {}
config.web = {}

config.twitter.bearer_token = process.env.TWITTER_BEARER_TOKEN || 'bearer_token'
config.mongodb.username = process.env.MONGODB_USERNAME || 'username'
config.mongodb.password = process.env.MONGODB_PASSWORD || 'password'
config.mongodb.cluster = process.env.MONGODB_CLUSTER || 'cluster'
config.mongodb.database = process.env.MONGODB_DATABASE || 'database'
config.mongodb.collection = process.env.MONGODB_COLLECTION || 'collection'
config.mongodb.uri = process.env.MONGODB_URI || 'uri'
config.web.port = process.env.PORT || 3000

module.exports = config
