const express = require('express');
const path = require('path');

// Collection of data and utilities to lookup postal-code based on location info
const zipdb = require('zippity-do-dah');

// Weather forecast
const ForecastIo = require('forecastio');

const app = express();

// Create ForecastIo object with API key
const weather = new ForecastIo('90345d7014bd3c70ebccd21c933c8927');

// Serve static files from the public folder
app.use(express.static(path.resolve(__dirname, 'public')));

// Serve static files out of the "views" folder
app.set('views', path.resolve(__dirname, 'views'));
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Render the "index" view if you hit the homepage
app.get('/', function (request, response) {
  response.render('index');
});

app.get(/^\/(\d{5})$/, function (request, response, next) {
  // Capture specified ZIP Code and pass it as req.params[0]
  const zipcode = request.params[0];
  // Grab location data with the ZIP code
  const location = zipdb.zipcode(zipcode);
  // Return {} when no results are found
  if (!location.zipcode) {
    next();
    return {};
  }


  const latitude = location.latitude;
  const longitude = location.longitude;

  weather.forecast(latitude, longitude, function (error, data) {
    if (error) {
      next();
      return;
    }

    // Send this JSON object with Express's JSON method
    response.json({
      zipcode: zipcode,
      temperature: data.currently.temperature
    });
  });
});

// SHow a 404 error if no other routes are matched
app.use(function(request, response) {
  response.status(404).render('404');
});

app.listen(3000);
console.log( 'Server listening on http://localhost:3000');
