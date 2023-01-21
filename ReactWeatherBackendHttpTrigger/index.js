const fetch = require('node-fetch');

const constructRequestURL = (location) => 'https://api.openweathermap.org/data/2.5/forecast?' + location + '&units=kelvin&APPID=' + process.env.OPENWEATHERMAP_API_KEY;

const sendApiRequest = async (url) => fetch(url);

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
      res.status(400).send('Invalid request. Must use zip or latlong.');
    }

    const response = await sendApiRequest(requestURL)
    context.log("RESPONSE", res)

    if (res.status === 200) {
      context.res = {
        status: 200,
        body: res.body,
        contentType: 'application/json'
      };
    } else {
      context.res = {
        status: res.status,
        body: { error: 'Something went wrong.', responseBody: res.body },
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