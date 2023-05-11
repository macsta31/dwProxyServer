const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const email = req.query.email;
    const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false`, {
      headers: {
        'User-Agent': 'YourAppName',
        'hibp-api-key': 'd6c5fbdd8570474f90ac68b6f17e61f4',
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
