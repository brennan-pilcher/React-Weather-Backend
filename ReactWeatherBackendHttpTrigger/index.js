const fetch = require('node-fetch');

const constructRequestURL = (location) => 'https://api.openweathermap.org/data/2.5/forecast?' + location + '&units=kelvin&APPID=' + process.env.OPENWEATHERMAP_API_KEY;

module.exports = async function (context, req) {
  try {
    context.log('Invoked', req);

    let requestURL;
    if (req.body.type == 'zip' && req.body.zip) {
      context.log('Using zip', req);
      requestURL = constructRequestURL('zip=' + req.body.zip + ',us');
    }
    else if (req.body.type == 'latlong' && req.body.latlong) {
      context.log('Using latlong', req);
      requestURL = constructRequestURL(req.body.latlong);
    } else {
      const err = 'Invalid request. Must use zip or latlong.';
      context.log(err);

      context.res = {
        status: 400,
        message: err
      };

      return;
    }

    const response = await fetch(requestURL);
    const data = await response.json();
    
    context.log("RESPONSE", data)

    if (response.status === 200) {
      context.res = {
        status: 200,
        body: { data },
        contentType: 'application/json'
      };
    } else {
      context.res = {
        status: response.status,
        body: { error: 'Something went wrong.', data: data },
        contentType: 'application/json'
      };
    }
  } catch (err) {
    context.log(err)
    context.res = {
      status: 500,
      message: err.message
    };
  }
}