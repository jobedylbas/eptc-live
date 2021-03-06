const DEFAULT_CENTER = [-30.04, -51.22]
const DEFAULT_ZOOM = 13
const MOBILE_CENTER = [-30.04, -51.19]
const DEFAULT_INTERVAL = 30000
const DEFAULT_ZOOM_POSITION = 'bottomright'
const DEFAULT_ICON_SIZE = 42
var markers = []

/**
 * Set map on best center I found
 *
 * @function setMap
 * @param {Object} map - map to set on center
 */
const setMap = map => {
  let tileSize = 256
  let zoomOffset = 0

  if (window.screen.width <= 1024) {
    map.setView(MOBILE_CENTER, DEFAULT_ZOOM)
    tileSize = 512
    zoomOffset = -1
  } else {
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
  }

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c'],
    tileSize: tileSize,
    zoomOffset: zoomOffset,
  }).addTo(map);
}

/**
 * Create an icon from image url
 *
 * @function createMarkerIcon
 * @param {string} iconUrl - where the image for the icon is
 * @return icon to put on map
 */
const createMarkerIcon = iconUrl => {
  return L.icon({
    iconUrl: iconUrl,
    iconSize: [DEFAULT_ICON_SIZE, DEFAULT_ICON_SIZE]
  })
}

/**
 * Get url from emoji image
 *
 * @function
 * @param {string} emojiCode - string that represents an emoji
 * @returns string url where the emoji image is
 */
const getIconUrl = emojiCode => {
  const code = twemoji.convert.fromCodePoint(emojiCode)
  const emojiHtml = twemoji.parse(code, {
    folder: 'svg',
  	ext: '.svg'
  })
  const div = document.createElement('div')
  div.innerHTML = emojiHtml

  return div.getElementsByClassName('emoji')[0].src
}

/**
 * Remove Twitter Timeline if necessary
 *
 * @function shouldRemoveTwitter
 */
const shouldRemoveTwitter = () => {
  if (window.screen.width < 768) {
    document.getElementById('twitter-widget').style.visibility = 'hidden'
    document.getElementById('twitter-widget').style.display = 'none'
  } else {
    document.getElementById('twitter-widget').style.visibility = 'visible'
    document.getElementById('twitter-widget').style.display = 'inline-block'
  }
}

/**
 * Remove Alert of no Incident
 *
 * @function shouldRemoveNoIncidentAlert
 * @param {Bool} bool
 */
const shouldAddNoIncidentAlert = (bool) => {
  const alert = document.getElementById('no-incident-alert')
  if (bool) {
    alert.style.visibility = 'visible'
  } else {
    alert.style.visibility = 'hidden'
  }
}

/**
 * Get incidents from database
 *
 * @async
 * @function getIncidents
 * @returns incidents with its coordinates
 */
const getIncidents = async () => {
  const tweets = await fetch('/incident/incidents')
    .then(result => result.json())

  return tweets
}

/**
 * Add Incident objects markers on map
 *
 * @function addIncidentsOnMap
 * @param {Object} map
 * @param {Object[]} incidents
 */
const addIncidentsOnMap = (map, incidents) => {
  incidents.forEach(incident => {
    var newMarker = new L.marker([incident.lat, incident.lon], {
      icon: createMarkerIcon(getIconUrl(incident.emojiCode))
    })

    newMarker.bindPopup(incident.text)
    map.addLayer(newMarker)
    markers.push(newMarker)
  })
}

/**
 * Remove all markers of the map
 * 
 * @function removeMarkers
 * @param {Object} map 
 */
const removeMarkers = map => {
  markers.forEach(marker => map.removeLayer(marker))
  markers = []
}

/**
 * Find new incidents to put on map
 *
 * @function findNewIncidents
 * @param {Object} map - map to add incidents
 */
const findNewIncidents = async (map) => {
  const incidents = await getIncidents().then(res => res)
  
  removeMarkers(map)

  if (incidents.length !== 0) {
    addIncidentsOnMap(map, incidents)
    shouldAddNoIncidentAlert(false)
  } else {
    shouldAddNoIncidentAlert(true)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/') {
    const map = L.map('map', {
      tap: false,
      zoomControl: false
    })

    map.on("load", () => { setTimeout(() => {
      map.invalidateSize();
      }, 800); 
    });

    window.addEventListener('resize', () => {
      shouldRemoveTwitter()
      setMap(map)
    })

    setTimeout(() => {
      setMap(map);

      L.control.zoom({
        position: DEFAULT_ZOOM_POSITION
      }).addTo(map);
    }, 400)

    shouldRemoveTwitter()

    findNewIncidents(map)

    setInterval(async () => {
      await findNewIncidents(map)
    }, DEFAULT_INTERVAL)
  }
})
