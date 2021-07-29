const DEFAULT_CENTER = [-30.04, -51.22]
const DEFAULT_ZOOM = 13
const MOBILE_CENTER = [-30.04, -51.19]
const DEFAULT_INTERVAL = 30000
const DEFAULT_ZOOM_POSITION = 'bottomright'
const DEFAULT_ICON_SIZE = 42
const MOBILE_ICON_SIZE = 72
const GET_ALERTS_INTERVAL = 900000
const MAP_TIMEOUT = 400
const MAP_INVALIDATE_TIMEOUT = 800
var markers = []

/**
 * Set map on best center I found
 *
 * @function setMap
 * @param {Object} map - map to set on center
 */
const setMap = map => {
  let tileSize = 256;
  let zoomOffset = 0;

  centerMap(map);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c'],
    tileSize: tileSize,
    zoomOffset: zoomOffset,
  }).addTo(map);
}

/**
 * Center the map
 * 
 * @param {Object} map
 */
const centerMap = map => {
  if (window.screen.width <= 1024) {
    map.setView(MOBILE_CENTER, DEFAULT_ZOOM)
    tileSize = 512
    zoomOffset = -1
  } else {
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
  }
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
    iconSize: window.screen.width <= 1024 ? [MOBILE_ICON_SIZE, MOBILE_ICON_SIZE] : [DEFAULT_ICON_SIZE, DEFAULT_ICON_SIZE]
  })
}

/**
 * Get url from emoji image
 *
 * @function
 * @param {string} emojiCode - string that represents an emoji code
 * @return {string} string url where the emoji image is
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
 * Show no incident alert
 *
 * @function shouldShowNoIncidentAlert
 * @param {Bool} bool
 */
const shouldShowNoIncidentAlert = bool => {
  const alert = document.getElementById('no-incident-alert')
  if (bool) {
    alert.style.visibility = 'visible'
    alert.style.display = 'block'
  } else {
    alert.style.visibility = 'hidden'
    alert.style.display = 'none'
  }
}

/**
 * Show storm alert
 *
 * @function shouldShowStormAlert
 * @param {Bool} bool
 */
 const shouldShowStormAlert = bool => {
  const alert = document.getElementById('storm-alert')
  if (bool) {
    alert.style.visibility = 'visible'
    alert.style.display = 'block'
  } else {
    alert.style.visibility = 'hidden'
    alert.style.display = 'none'
  }
}

/**
 * Get incidents from database
 *
 * @async
 * @function getIncidents
 * @return incidents with its coordinates
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
    shouldShowNoIncidentAlert(false)
  } else {
    shouldShowNoIncidentAlert(true)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname === '/') {
    const map = L.map('map', {
      tap: false,
      zoomControl: false
    });

    shouldShowStormAlert(false);

    await setupMap(map);

    await setupStormAlert();

    shouldRemoveTwitter();

    setupResizeEvent(map);
  }
})

/**
 * Setup map
 * 
 * @async
 * @function setupMap
 */
const setupMap = async (map) => {
  map.on("load", () => { setTimeout(() => {
    map.invalidateSize();
    }, MAP_INVALIDATE_TIMEOUT); 
  });

  setTimeout(() => {
    setMap(map);

    L.control.zoom({
      position: DEFAULT_ZOOM_POSITION
    }).addTo(map);
  }, MAP_TIMEOUT);

  findNewIncidents(map);

  setInterval(async () => {
    await findNewIncidents(map)
  }, DEFAULT_INTERVAL);
}

/**
 * Setup resize event
 * 
 * @function setupResizeEvent
 */
const setupResizeEvent = map => {
  window.addEventListener('resize', () => {
    shouldRemoveTwitter();
    centerMap(map);
    findNewIncidents(map);
  });
}

/**
 * Setup storm alert
 * 
 * @async
 * @function setupStormAlert
 */
const setupStormAlert = async () => {
  const alerts = await getAlerts()
  shouldShowStormAlert(hasStormAlert(alerts))

  setInterval(async () => {
    const alerts = await getAlerts()
    shouldShowStormAlert(hasStormAlert(alerts))
  }, GET_ALERTS_INTERVAL)
}

/**
 * Get metereological alerts from Alert-AS
 *
 * @async
 * @function getAlerts
 * @return {Object[]} with tweets based on params
 */
const getAlerts = async () => {
  const rssEndpoint = 'https://alerts.inmet.gov.br/cap_12/rss/alert-as.rss';
  
  const res = await fetch(rssEndpoint)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");
        return [...xmlDoc.getElementsByTagName('item')];
      })
      .catch(console.error);
  
  return res || []
}

/**
 * Check if has to show storm alert
 *
 * @function hasStormAlert
 * @return {Bool} true if has to show storm alert
 */
const hasStormAlert = xml => {
  const fisiologicalArea = 'depressão central';
  const stormWord = 'geada';

  return xml.some(item => {
    const itemTitle = item.childNodes[1].innerHTML.toLowerCase();
    const itemDescription = item.childNodes[5].innerHTML.toLowerCase();
    const itemDate = new Date(item.childNodes[7].innerHTML);

    return (itemTitle.includes(stormWord) && itemDescription.includes(fisiologicalArea) && isToday(itemDate)); 
  })
}

/**
 * Check if date is today
 *
 * @function isToday
 * @return {Bool} true if date is today, else false
 */
const isToday = someDate => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}