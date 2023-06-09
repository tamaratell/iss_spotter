const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 * //https://api.ipify.org
 */


const fetchMyIP = (callback) => {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    const ip = data.ip;
    callback(null, ip);
  });
};

module.exports = fetchMyIP;

const fetchCoordsByIP = (ip, callback) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    const parsedBody = JSON.parse(body);
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const { latitude, longitude } = parsedBody;
    const coordinates = { latitude, longitude };
    callback(null, coordinates);
  });
};


//fetchMyIP(callback);

//fetchCoordsByIP("198.98.122.76", callback);

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = (coordinates, callback) => {
  const lat = coordinates.latitude;
  const lon = coordinates.longitude;
  request(`https://iss-flyover.herokuapp.com/json/?lat=${lat}&lon=${lon}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    const { risetime, duration } = data.response[0];
    const passTimes = { risetime, duration };
    callback(null, passTimes);

  });
};

// iss.js 

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */


// const nextISSTimesForMyLocation = ((error, passTimes) => {

// });

const printPassTimes = (passTimes) => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};


// const nextISSTimesForMyLocation = (callback) => {
//   fetchMyIP((error, ip) => {
//     if (error) {
//       return callback(error, null);
//     }

//     fetchCoordsByIP(ip, (error, coords) => {
//       if (error) {
//         return callback(error, null);
//       }

//       fetchISSFlyOverTimes(coords, (error, passes) => {
//         if (error) {
//           return callback(error, null);
//         }

//         // success, print out the deets!
//         const printPassTimes = function(passTimes) {
//           for (const pass of passTimes) {
//             const datetime = new Date(0);
//             datetime.setUTCSeconds(pass.risetime);
//             const duration = pass.duration;
//             console.log(`Next pass at ${datetime} for ${duration} seconds!`);
//           }
//         };

//         printPassTimes(passes);
//         callback(null, passes);
//       });
//     });
//   });
// };

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

const callback = (error, data) => {
  if (error) {
    console.error("error", error.message);
    return;
  }
  console.log("It worked! Returned IP:", data);
};

nextISSTimesForMyLocation(callback);




//coordinates = { latitude: 43.653226, longitude: -79.3831843 };
//fetchISSFlyOverTimes({ latitude: '43.653226', longitude: '-79.3831843' }, callback);


module.exports = { nextISSTimesForMyLocation, printPassTimes };