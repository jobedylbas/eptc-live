const path = require('path')
const express = require('express')
const incidentMetricsController = require(path.join(__dirname, '..' , 'controllers', 'incidentMetricsController'))
const router = express.Router()

router.get('/incident-metrics', async (req, res) => {
    try {
      const incidentsMetrics = await incidentMetricsController.readIncidentsMetrics()
      res.status(200).json(incidentsMetrics)
    } catch (err) {
      res.status(500).json(err)
    }
  })
  
  module.exports = router