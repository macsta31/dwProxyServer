const axios = require('axios');
require('dotenv').config()

module.exports = async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const email = req.query.email;
    const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false`, {
      headers: {
        'User-Agent': 'YourAppName',
        'hibp-api-key': process.env.VITE_HIBP_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    handleError(error, res);
  }
};

function handleError(error, res) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    res.status(error.response.status).json({message: `Error ${error.response.statusText}`})
  } else if (error.request) {
    // The request was made but no response was received
    res.status(500).json({message: `No response was received from the server`})
  } else {
    // Something happened in setting up the request that triggered an Error
    res.status(500).json({ message: `Error: ${error.message}`});
  }
}
