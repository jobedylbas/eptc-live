const mongoose = require('mongoose')

const Schema = mongoose.Schema

const IncidentSchema = new Schema({
    tweet: { type: String, required: true },
    date: { type: Date, required: true, default: Date() },
    id: { type: String, required: true },
    emojiCode: { type: String, required: true },
    lat: { type: String, required: true },
    lon: { type: String, required: true }
  }, 
  { collection: 'incidents' }
)

module.exports = mongoose.model('Incident', IncidentSchema)
