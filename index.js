window.addEventListener("load", () => {
  //
  //  VARIABLES
  //
  const filterColors = 5; // available unique theme colors
  let markerCount = 0; // for counting markers on map
  let places = {}; // { "placeName" : { "latitude": 0.00, "longitude": 0.00 } }
  let orgMarkers = {}; // { "orgTitle": { "marker": Marker, "isHidden": "false" } }
  let filters = {}; // { "Mutual Aid" : { organizations: [ "Upstream Podcast" ], colorClass: "filter-color-0" }, ... }
  let filtersLeadership = {}; // { "Black-led" : { organizations: [ "Common Future" ], colorClass: "filter-color-0" }, ... }
  let filtersAreas = {}; // { "Direct Legal Services" : { organizations: [ "New Economy Project" ], colorClass: "filter-color-0" }, ... }
  let colorIndex = 0;
  const showing = document.querySelector("#applied-filters");

  //
  // FUNCTION VARIABLES
  //
  const filterTabTypes = [
    {
      "name": "work",
      "field": "SE Models"
    },
    {
      "name": "leadership",
      "field": "Leadership"
    }, {
      "name": "areas",
      "field": "Areas of Focus"
    }];
  const filterTabGroups = filterTabTypes.map((term) => {
    const button = document.querySelector(`#filter-tab-${ term.name }`);
    button.addEventListener("click", handleTabChange);
    return ({
      "button": button,
      "group": document.querySelector(`#filters-${ term.name }`)
    });
  });
  const svgTemplate = (innerText = "") => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 318.44 541.87"><g><path stroke="#089d8f" stroke-width="5" d="M77.27,502.32s-6.12-12.74-7.64-44.84c-1.54-32.12,1.02-34.16,3.82-39.24,2.8-5.1,2.17-21.37,2.17-31s3.77-42.87,7.93-64.43c4.16-21.53,19.25-78.01,30.45-103.33,11.2-25.32,19.41-41.25,19.41-41.25,0,0-28.41-4.73-60.69-26.66-32.25-21.89-47.37-35.24-56.56-47.66-9.16-12.43-8.87-13.92-9.47-18.94-.58-5.05,3.56-3.85,4.16-7.72.58-3.85-1.2-8.87-8.29-16.87-7.12-7.98,5.34-13.92,19.83,5.62,14.52,19.54,23.39,34.66,30.21,35.24,6.8.6,14.2.29,23.67,7.12,9.47,6.8,0-19.25-11.25-31.1-11.25-11.82-22.5-21.01-23.7-31.36-1.18-10.36-1.75-20.72,1.78-19.54,3.56,1.18,1.78,5.62,3.85,12.43,2.09,6.8,12.45,23.39,21.32,26.66,8.89,3.24,16.3,15.98,17.19,13.03s-8.29-22.81-10.67-30.21c-2.35-7.4-4.13-24.28-1.78-34.32,2.38-10.07,3.87-13.63,8.61-12.45s2.07,7.12,2.07,17.47-1.49,17.16,2.67,23.1c4.13,5.91,12.43,25.74,16.56,34.03,4.16,8.29,13.34,31.08,15.12,30.5,1.78-.6-.89-31.08-2.67-36.7-1.78-5.65-6.51-8.89-9.47-23.99-2.98-15.09,3.24-10.23,2.96-16.74-.29-6.51-2.38-11.25-3.27-14.2s-.89-5.02-5.02-7.98c-4.16-2.98-2.38-10.39,6.23-3.87,8.58,6.51,7.09,13.03,11.25,14.81,4.13,1.78,3.24,7.12,2.35,11.56-.89,4.42.31,7.98,2.67,5.31,2.38-2.64,4.16-7.69,7.12-9.16,2.96-1.49,6.8,0,3.24,8.58-3.56,8.58-6.51,10.96-6.8,25.16-.29,14.2,1.78,27.23,2.67,30.79s3.43,16.58,5.57,23.39c2.12,6.8,2.41,16.27,7.74,15.7,5.34-.6-1.49-13.92-3.24-35.24-1.78-21.32.58-27.55,3.53-43.82,2.96-16.3,5.05-23.39,5.34-26.66.29-3.24,4.45-15.38,10.07-18.34,5.62-2.98,1.46,6.2,0,11.54-1.49,5.34-7.4,36.7-6.8,40.86.58,4.13,5.31,10.36,4.73,15.09-.6,4.73-5.94,9.18-5.34,15.09.6,5.94.29,11.56,3.56,9.18,3.24-2.35,10.65-11.25,11.54-19.54s-1.18-19.54,3.85-26.63c5.05-7.12,6.83-14.23,6.83-21.32s-.6-15.41,3.53-14.81c4.16.58,1.2,12.14,1.78,15.38.6,3.27-2.35,10.67-2.35,13.34s-2.96,14.78,4.13,5.31c7.12-9.47,13.31-18.94,22.21-25.45,8.87-6.51,3.56,3.27,0,7.4-3.56,4.13-11.04,11.25-14.39,20.72-3.37,9.47-12.27,20.72-14.91,30.5-2.67,9.76-14.52,33.14-9.78,35.52,4.73,2.35,9.47-9.78,14.2-19.54,4.73-9.76,18.36-33.46,24.88-37.9,6.51-4.42,18.05-9.47,23.67-14.2,5.62-4.73,12.14-13.31,14.23-11.25,2.07,2.07-4.16,11.25-9.18,16.3-5.05,5.02-26.37,20.12-23.39,22.5,2.96,2.35,19.23-11.85,28.12-15.98,8.87-4.16,17.16-5.34,17.76-4.16.58,1.18,1.78,4.45-7.4,6.8-9.18,2.38-39.68,27.83-46.2,36.73-6.51,8.87-18.13,23.96-12.01,24.85,6.1.89,21.5-11.54,38.66-15.67,17.16-4.16,24.56-10.67,31.39-16.3,6.8-5.62,17.45-16.27,23.07-14.49,5.62,1.75,8,8.27,0,12.14-7.98,3.85-29.01,18.05-31.68,23.67-2.64,5.62-29.9,18.36-42.61,18.94-12.74.6-15.09,8-8.61,8.29,6.51.29,20.74,2.67,33.17-1.78,12.43-4.42,27.55-16.87,37.01-20.43,9.47-3.53,24.85-3.24,27.23-5.02,2.35-1.78,8.58-5.02,7.98-2.38-.58,2.67-2.07,8-9.76,11.56-7.69,3.56-18.05,6.51-26.34,11.85-8.29,5.31-24.28,12.43-21.61,14.78,2.64,2.38,17.76-1.18,24.56-2.07s18.94-1.78,8.87,1.49c-10.04,3.24-24.56,7.09-23.67,9.47.89,2.35,28.43-.29,34.06-.29s13.31.29,18.34,4.42c5.05,4.16,8.89,11.85,4.16,10.36-4.73-1.46-16.87-10.36-21.61-7.69-4.76,2.67,1.46,7.4-3.87,7.69-5.31.31-16.56-5.02-30.19-5.62-13.63-.58-28.41-.58-40.55,7.12-12.14,7.69-26.05,14.2-37.01,14.52-10.96.29-34.06-3.87-34.06-3.87,0,0-19.23,32.88-26.34,54.2-7.12,21.29-23.1,72.51-24.88,82.87-1.75,10.39-5.91,40.86-7.69,66.34-1.78,25.45-.58,31.65-.58,31.65,0,0,14.49,9.18,23.67,41.17,9.18,31.97,10.65,48.24,9.47,55.64s-2.07,17.47-10.65,24.28c-8.61,6.83-12.45,1.2-19.25-8.58,0,0-11.82-17.42-14.99-27.47Z"/></g>
    <p class="clusterCount">${ innerText }</p>
  </svg>`;

  //
  // MAP VARIABLES
  //
  const markerIcon = (filterColorClass = 'filter-color-0') => L.divIcon({
    html: svgTemplate(),
    iconSize: [30, 30],
    iconAnchor: [10, 45],
    popupAnchor: [1, -55],
    className: 'marker-icon ' + filterColorClass
  });

  // create map
  const map = L.map('map').setView([42, -95], 4);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // create cluster & search
  const markerClusterGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 35,
    iconCreateFunction: (cluster) => L.divIcon({
      html: svgTemplate(cluster.getChildCount()),
      className: 'clusterIcon ' + (cluster.getChildCount() < 10 ? "small" : "large"), // TODO
      iconSize: L.point(40, 40)
    })
  });
  const controlSearch = new L.Control.Search({
    position: 'topright',
    layer: markerClusterGroup,
    initial: false,
    zoom: 16,
    marker: { icon: false, animate: true }
  });
  map.addControl(controlSearch);

  //
  // MAP MARKER MANIPULATION FUNCTIONS
  //
  function createMarker(entry, placeName, locationData, markerColorClass) {
    if ( !orgMarkers[entry["Name"]] ) { // entries are unique by name--if there is more than one entry with the same name, it is ignored
      markerCount++;
      const marker = L.marker([locationData.latitude, locationData.longitude], {
        title: entry["Name"],
        riseOnHover: true,
        icon: markerIcon(markerColorClass)
      });
      const markerTitle = () => {
        let title = `<div class="marker-title">`;
        if ( entry["Logo"] && entry["Logo"].length > 0 ) title += `<img class="marker-title-logo" src="${ entry["Logo"][0]["thumbnails"]["small"].url }"/> `;
        return title + `<b>${ entry["Name"] }</b></div>`;
      }
      const markerLink = () => {
        let link = "";
        if ( entry["Website"] ) {
          link += "<a target='_blank' rel='noopener noreferrer' href=";
          const re = new RegExp("^(http|https)://", "i");
          if ( !re.test(entry["Website"]) ) link += "https://";
          link += entry["Website"];
          link += `>${ entry["Website"] }</a>`;
        }
        return link;
      }
      const markerDescription = () => entry["Mission"] ? `<p>${ entry["Mission"] }</p>` : "";
      marker.bindPopup(`
                    ${ markerTitle() }
                    ${ markerDescription() }
                    <p>${ entry["Region"] ? 'Region: ' + entry["Region"] : "" }</p>
                    <p class="orgLocation">${ placeName }</p>
                    <p class="orgLink">${ markerLink() }</p>
                `);
      orgMarkers[entry["Name"]] = { marker, isHidden: false };
    }
  }

  function getOffsetLocation(location) { // offset location by a few points just to scatter markers by a little bit
    const latitude = location.latitude + (Math.random() * 0.007 * ((Math.random() > 0.5) ? 1 : -1));
    const longitude = location.longitude + (Math.random() * 0.007 * ((Math.random() > 0.5) ? 1 : -1));
    return { latitude, longitude };
  }

  //
  // DATA MANIPULATION FUNCTIONS
  //
  function sortOrganizationsByFilters(entry, sortedOrgs, filterByType) {
    let markerColor = "filter-color-0";
    let filterType = filterTabTypes.find(key => key.name === filterByType)?.field;
    if ( entry[filterType] ) {
      entry[filterType].forEach((filter) => {
        filter = filter.toLowerCase();
        if ( sortedOrgs[filter] ) { // if filter already exists in list
          sortedOrgs[filter]["organizations"].push(entry["Name"]);
          markerColor = sortedOrgs[filter]["colorClass"];
        } else { // otherwise create a new entry
          markerColor = "filter-color-" + ((colorIndex % filterColors) + 1);
          sortedOrgs[filter] = {
            organizations: [entry["Name"]],
            colorClass: markerColor
          };
          colorIndex++;
        }
      });
    }
    return markerColor; // TODO will only need to get marker color once--it only uses the "work" filter colors atm, otherwise it's just ignored
  }

  // clear all filters, and show all org markers
  function clearAllFilters() {
    showing.innerHTML = `showing ${ markerCount } members`;
    document.querySelectorAll("input[type='checkbox']:checked").forEach((elem) => elem.checked = false);
    Object.keys(orgMarkers).forEach((org) => {
      editMarkerOnMap(orgMarkers[org], false);
    });
  }

  function editMarkerOnMap(markerObj = {
    marker: null,
    isHidden: false
  }, isRemoved = false) {
    markerObj.isHidden = isRemoved;
    if ( isRemoved ) markerClusterGroup.removeLayer(markerObj.marker);
    else markerClusterGroup.addLayer(markerObj.marker);
  }

  // if filter is applied, hide all markers except for the filtered
  function applyFilters() {
    const filtersChecked = Array.from(document.querySelectorAll("input[type='checkbox']:checked")).filter((elem) => elem.checked).map((e) => e.name);
    let filteredCount = 0;
    if ( filtersChecked.length > 0 ) {
      Object.keys(orgMarkers).forEach((org) => {
        // return all markers to hidden by default
        if ( !orgMarkers[org].isHidden ) {
          editMarkerOnMap(orgMarkers[org], true);
        }
        filtersChecked.forEach((filter) => {
          // check if org is in filter group
          if ( filters[filter] && filters[filter]["organizations"].includes(org) ||
               filtersLeadership[filter] && filtersLeadership[filter]["organizations"].includes(org) ||
               filtersAreas[filter] && filtersAreas[filter]["organizations"].includes(org) ) {
            if ( orgMarkers[org].isHidden ) {
              editMarkerOnMap(orgMarkers[org]);
              filteredCount++;
            }
          }
        });
      });
      showing.innerHTML = `showing ${ filteredCount }: ${ filtersChecked.join(" & ") }`;
    } else clearAllFilters();
  }

  //
  // DATA FETCH FUNCTIONS
  //
  // get stored geolocation data to save api calls to fetch lat/long coords
  async function fetchPlaces() {
    const response = await fetch("places.json")
    return await response.json();
  }

  // get members data from airtable
  async function fetchMemberData() {
    // const response = await fetch("http://localhost:8888/api");
    // const response = await fetch("scratch.json");
    const response = await fetch("https://nec-airtable.netlify.app/.netlify/functions/api");
    return await response.json();
  }

  function populateMap() {
    fetchPlaces().then((locationData) => {
      places = locationData;
      fetchMemberData().then((data) => {
        // info to pass to popup for map marker
        let popupPlaceName = "";
        let popupLocationData = places["international"];

        // go through each entry, and find its lat/long coordinates
        // narrowing from country down to city, being as specific with the location as it can be
        data.forEach((entry) => {
          if ( entry["Country"] ) {
            let country = entry["Country"][0].trim().toLowerCase();
            if ( country === "united states" ) country = "united states of america"; // convert for sgeodb, because geodb calls it the USA but airtable calls it the US
            if ( !places[country] ) { // if country doesn't already exist in store (places.json)
              fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/countries?namePrefix=${ country }&hateoasMode=false&limit=5&offset=0`).then((d) => d.json()).then((r) => {
                if ( r && r.data ) {
                  const place = r.data.find((el) => el["country"].toLowerCase() === country);
                  if ( place ) {
                    places[place["country"].toLowerCase()] = {
                      latitude: place.latitude,
                      longitude: place.longitude
                    }
                    popupPlaceName = country;
                    popupLocationData = places[place["country"].toLowerCase()];
                  }
                }
              });
            } else if ( places[country] ) { // if country already exists in store
              popupPlaceName = country;
              popupLocationData = places[country];
            } else { // if country could not be found in store or on geodb
              popupPlaceName = country;
              popupLocationData = places[country];
              console.info("No country found for " + entry["Name"]);
            }
            if ( country === "united states of america" && entry["State"] ) { // in the case where there is a state listed
              const state = entry["State"][0].trim().toLowerCase();
              if ( !places[state + "+" + country] ) { // if state doesn't already exist in store (places.json)
                // need to first get iso code of state
                fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/countries/US/regions?namePrefix=${ state }&hateoasMode=false&limit=5&offset=0`).then((d) => d.json()).then((r) => {
                  if ( r && r.data ) {
                    const place = r.data.find((el) => el.name.toLowerCase() === state);
                    if ( place ) {
                      // then use iso code to find the largest admin region of that state, and use that as the state geo coords
                      fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/countries/US/regions/${ place.isoCode }/places?types=ADM2&hateoasMode=false&limit=5&offset=0&sort=-population`).then((d) => d.json()).then((r) => {
                        if ( r.data ) {
                          const region = r.data[0];
                          places[state + "+" + country] = {
                            latitude: region.latitude,
                            longitude: region.longitude
                          }
                          popupPlaceName = `${ state }, ${ country }`;
                          popupLocationData = places[state + "+" + country];
                        }
                      });
                    }
                  }
                });
              } else if ( places[state + "+" + country] ) { // if state already exists in store
                popupPlaceName = `${ state }, ${ country }`;
                popupLocationData = places[state + "+" + country];
              } else { // if state could not be found in store or on geodb
                popupPlaceName = `${ state }, ${ country }`;
                popupLocationData = places[country];
                console.info("No state found for " + entry["Name"]);
              }
            }
            if ( entry["City"] ) { // in the case where there is a city listed
              const city = entry["City"][0].trim().toLowerCase();
              if ( !places[city + "+" + country] ) { // if city does not already exist in store
                fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/places?namePrefix=${ city }&hateoasMode=false&limit=5&offset=0`).then((d) => d.json()).then((r) => {
                  if ( r && r.data ) {
                    const place = r.data.find((el) =>
                      el.name.toLowerCase() === city &&
                      el.country.toLowerCase() === country
                    );
                    if ( place ) {
                      places[place.name.toLowerCase() + "+" + place.country.toLowerCase()] = {
                        latitude: place.latitude,
                        longitude: place.longitude
                      }
                      popupPlaceName = `${ city }, ${ country }`;
                      popupLocationData = places[place.name.toLowerCase() + "+" + place.country.toLowerCase()];
                    }
                  }
                });
              } else if ( places[city + "+" + country] ) { // if city already exists in store
                popupPlaceName = `${ city }, ${ country }`;
                popupLocationData = places[city + "+" + country];
              } else { // if city could not be found in store or on geodb
                popupPlaceName = `${ city }, ${ country }`;
                popupLocationData = places[country];
                console.info("No city found for " + entry["Name"]);
              }
            }
          } else { // if no country listed
            console.info("No country listed for " + entry["Name"] + "; couldn't place on map");
          }
          const markerColor = sortOrganizationsByFilters(entry, filters, "work"); // marker can only be styled by category after it is placed on map / rendered
          sortOrganizationsByFilters(entry, filtersLeadership, "leadership");
          sortOrganizationsByFilters(entry, filtersAreas, "areas");
          createMarker(entry, popupPlaceName.replace("united states of america", "united states"), getOffsetLocation(popupLocationData), markerColor);
        });
        filterTabTypes.forEach((type) => createFilterCheckboxes(type.name));
        clearAllFilters();
      });
    });
  }

  //
  // DISPLAY FUNCTIONS
  //
  function createFilterCheckboxes(filterType) {
    let filtersContainer = null;
    let filteredOrgs = {};
    if ( filterType === "work" ) {
      filtersContainer = document.getElementById("filters-work");
      filteredOrgs = filters;
    } else if ( filterType === "leadership" ) {
      filtersContainer = document.getElementById("filters-leadership");
      filteredOrgs = filtersLeadership;
    } else {
      filtersContainer = document.getElementById("filters-areas");
      filteredOrgs = filtersAreas;
    }
    Object.keys(filteredOrgs).sort().forEach((filter) => {
      if ( filter === "none of the above" ) return; // don't create a filter category for the 'none of the above' response in leadership
      const container = document.createElement("div");
      container.className = "checkbox-container";
      const input = document.createElement("input");
      const label = document.createElement("label");
      const filterClassName = "filter-" + filter.replace(/[^\p{L}\p{N}]/giu, ''); // convert category into a CSS-friendly class-name
      input.id = `checkbox-${ filterClassName }`;
      input.type = "checkbox";
      input.name = filter;
      label.title = filter;
      label.htmlFor = `checkbox-${ filterClassName }`;
      label.innerText = filter;
      input.addEventListener(("change"), applyFilters);
      container.appendChild(input);
      container.appendChild(label);
      filtersContainer.appendChild(container);
      label.classList.add(filteredOrgs[filter]["colorClass"]);
    });
  }

  function handleTabChange(e) {
    e.preventDefault();
    Object.keys(filterTabGroups).forEach((key) => {
      const button = filterTabGroups[key]["button"];
      const group = filterTabGroups[key]["group"];
      if ( button === e.target ) {
        button.classList.add("is-open");
        group.classList.add("is-open");
      } else {
        button.classList.remove("is-open");
        group.classList.remove("is-open");
      }
    });
  }

  function createDisclaimer() {
    const disclaimer = document.createElement("div");
    disclaimer.className = "disclaimer";
    disclaimer.innerHTML = "*note: locations on map are approximate";
    document.querySelector(".leaflet-bottom.leaflet-right")?.insertBefore(disclaimer, document.querySelector(".leaflet-bottom.leaflet-right div"));
  }

  function addClearFunctionality () {
    Array.from(document.querySelectorAll(".button-filter-clearall")).forEach((button) => button.addEventListener('click', clearAllFilters));
  }

  populateMap();
  createDisclaimer();
  addClearFunctionality()
  setTimeout(() => {
    console.info({ places }, { markerCount });
  }, 60000); // just in case, if places is updated, as it is not stored in realtime
});