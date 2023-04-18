// The code below is temporary and can be commented out.
// const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   console.log('It worked! Returned IP:', ip);

//   fetchCoordsByIP(ip, (error, coordinates) => {
//     if (error) {
//       console.log("It didn't work!", error);
//       return;
//     }
//     console.log('It worked! Returned coordinates:', coordinates);

//     fetchISSFlyOverTimes(coordinates, (error, data) => {
//       if (error) {
//         console.error("error", error.message);
//         return;
//       }
//       console.log("It worked! Returned flyover times:", data);
//     });
//   });

// });

// const { nextISSTimesForMyLocation, fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');


// nextISSTimesForMyLocation((error, passTimes, number) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }

//   const printPassTimes = function(passTimes) {
//     for (const pass in passTimes.response) {
//       const datetime = new Date(0);
//       datetime.setUTCSeconds(pass.risetime);
//       const duration = pass.duration;
//       console.log(`Next pass at ${datetime} for ${duration} seconds!`);
//     }
//   };

//   console.log(printPassTimes(passTimes));
// });



// nextISSTimesForMyLocation((callback) => {
//   fetchMyIP((error, ip) => {
//     if (error) {
//       return callback(error, null);
//     }

//     fetchCoordsByIP(ip, (error, loc) => {
//       if (error) {
//         return callback(error, null);
//       }

//       fetchISSFlyOverTimes(loc, (error, nextPasses) => {
//         if (error) {
//           return callback(error, null);
//         }

//         callback(null, nextPasses);
//       });
//     });
//   });
// });

// nextISSTimesForMyLocation(printPassTimes);

const { nextISSTimesForMyLocation } = require('./iss');

/** 
 * Input: 
 *   Array of data objects defining the next fly-overs of the ISS.
 *   [ { risetime: <number>, duration: <number> }, ... ]
 * Returns: 
 *   undefined
 * Sideffect: 
 *   Console log messages to make that data more human readable.
 *   Example output:
 *   Next pass at Mon Jun 10 2019 20:11:44 GMT-0700 (Pacific Daylight Time) for 468 seconds!
 */
const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});

module.exports = { printPassTimes };