const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors()); // Add cors middleware




app.get('/breachedaccount/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false`, {
      headers: {
        'User-Agent': 'YourAppName',
        // Add your API key, if you have one
        'hibp-api-key': 'd6c5fbdd8570474f90ac68b6f17e61f4',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from HaveIBeenPwned API' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});