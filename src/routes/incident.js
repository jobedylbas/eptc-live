const path = require('path')
const express = require('express')
const incidentController = require(path.join(__dirname, '..' , 'controllers', 'incidentController'))
const router = express.Router()

router.get('/incidents', async (req, res) => {
  try {
    const incidents = await incidentController.readIncidents()
    res.status(200).json(incidents)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
