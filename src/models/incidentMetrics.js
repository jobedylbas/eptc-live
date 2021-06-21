const mongoose = require('mongoose')

const Schema = mongoose.Schema

const IncidentMetricsSchema = new Schema({
    date: { type: Date, required: true, default: Date() },
    type: { type: Number, required: true, default: 1 },
    hasAddress: { type: Boolean, require: true, default: false },
    isLocalized: { type: Boolean, require: true, default: false},
    id: { type: String, require: true }
  },
  { collection: 'incidentMetrics' }
)

module.exports = mongoose.model('IncidentMetrics', IncidentMetricsSchema)