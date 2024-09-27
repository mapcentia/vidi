// This element contains the styling for the module
var styleObject = {
    ventil_forbundet: {
      radius: 8,
      fillColor: "#00ff00",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    },
    ventil: {
      radius: 5,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    },
    selectedLedning: {
      color: "#AA4A44",
      weight: 8,
    },
    selectedPoint: {
      html: `
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
    <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z"/>
    </svg>
    `,
      className: "",
      iconSize: [24, 24], // size of the icon
      //iconAnchor: [-10, -10], // point of the icon which will correspond to marker's location
    },
    matrikel: {
      color: "#000000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.2,
      dashArray: "5,3",
    },
    buffer: {
      color: "#ff7800",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.1,
      dashArray: "5,3",
    },
    alarmPosition: {
      html: `
    <svg fill="#000000" width="24px" height="24px" viewBox="0 0 57.6 57.6" xmlns="http://www.w3.org/2000/svg">
    <path d="M28.709 0c-10.872 0 -19.71 8.838 -19.71 19.706 0 5.418 2.408 10.436 7.362 15.347 7.193 7.139 10.548 13.73 10.548 20.747v1.8h3.6v-1.8c0 -6.984 3.308 -13.385 10.728 -20.743 4.954 -4.914 7.362 -9.932 7.362 -15.35 0 -10.868 -8.838 -19.706 -19.89 -19.706" fill-rule="evenodd"/>
    </svg>
    `,
      className: "",
      iconSize: [24, 24], // size of the icon
      iconAnchor: [12, 24], // point of the icon which will correspond to marker's location
    },
  };

  module.exports = styleObject;