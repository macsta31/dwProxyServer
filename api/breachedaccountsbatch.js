const axios = require('axios');

module.exports = async (req, res) => {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');

        const emails = req.body.emails;
        if (!Array.isArray(emails)) {
            return res.status(400).json({ message: 'Expected an array of emails in request body.' });
        }

        const results = [];

        for (let email of emails) {
            try {
                const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false`, {
                    headers: {
                        'User-Agent': 'breachdetector',
                        'hibp-api-key': 'd6c5fbdd8570474f90ac68b6f17e61f4',
                    },
                });
                results.push({ email, breaches: response.data });
            } catch (error) {
                results.push({ email, error: handleErrorForEmail(error) });
            }
            
            // Introduce a 1600ms delay
            await new Promise(resolve => setTimeout(resolve, 3200));
        }

        res.json(results);
    } catch (error) {
        handleError(error, res);
    }
};

function handleErrorForEmail(error) {
    if (error.response) {
        return { message: `Error ${error.response.statusText}` };
    } else if (error.request) {
        return { message: `No response was received from the server` };
    } else {
        return { message: `Error: ${error.message}` };
    }
}

function handleError(error, res) {
    if (error.response) {
        res.status(error.response.status).json({ message: `Error ${error.response.statusText}` });
    } else if (error.request) {
        res.status(500).json({ message: `No response was received from the server` });
    } else {
        res.status(500).json({ message: `Error: ${error.message}` });
    }
}
