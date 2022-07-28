import axios from "axios"; // has built in TS support and has axios/index.d.ts

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;
const GOOGLE_API_KEY = "some_key";

// declare var google: any; // used @types/googlemaps instead

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = encodeURI(addressInput.value);
  // console.log(enteredAddress);

  // Send to Google Geocoding API
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${enteredAddress}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      // console.log(response); // returns array of results
      // data.results[0].geometry.location --> { lat,lng } which we can use to render on a map later.

      if (response.data.status !== "OK") {
        throw new Error("Could not fetch location!"); // will go to .catch block
      }

      // Coordinates - use Google Geocoding API
      const coordinates = response.data.results[0].geometry.location;
      console.log(coordinates);

      // Render - use Maps JavaScript API (remember CDN downloaded directly from Google via .html script).
      // google - will be available globally but TS does not now that hence we ensure with TS that it will exists using 'declare' above.
      const map = new google.maps.Map(document.getElementById("map")!, {
        // center: { lat: -34.397, lng: 150.644 },
        center: coordinates,
        zoom: 16,
      });
      console.log(map);

      // Marker
      new google.maps.Marker({
        position: coordinates,
        map: map,
      });
    })
    .catch((error) => {
      alert(error.message);
      console.log(error);
    });
}

form.addEventListener("submit", searchAddressHandler);

/* 1 Send to Google Geocoding API - https://developers.google.com/maps/documentation/geocoding/overview
  - Enable API
  - Will need Maps and Places
  - Create new or existing project

  - https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
  
  2 encodeURI()
  - In our app user enters text that may contains special characters, commas, whitespace, etc. not supported in URLs.
  - This is why we need to convert this entered string into a URL compatible string.

  3 Does TS know the type/structure of data returned?  No!
  - get() method is a generic method.
  - We can define/replace the 'any' response by telling TS 
    what we expect to get in the response.


  4 Maps JavaScript API - for rendering given coordinates
  1. Below will add this Google Maps SDK to our application.
  - We do not install below through npm because it is not published to npm hence we
  use this CDN link which pulls the script directly from Google's servers.

  <script async
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">
  </script>

  2. We used declare var google: any; but how do we ensure we use TypeScript support
  and see errors and handle errors during development and not at runtime?
  - Use @types.

  3. How do we ensure that TS knows Google Maps?
  - We didn't install Google Maps through npm but we can still install Types through npm.
  - npm install --save-dev @types/googlemaps
*/
