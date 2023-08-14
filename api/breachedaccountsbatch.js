export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(request) {
    try {
      console.log("Request received with body:", request.body); // Logging the received body
  
      const body = await request.json();
      console.log("Parsed body as:", body); // Logging the parsed body
  
      const emails = body.emails;
      if (!Array.isArray(emails)) {
        return new Response(JSON.stringify({ message: 'Expected an array of emails in request body.' }), {
          status: 400,
          headers: {
            'content-type': 'application/json',
          },
        });
      }
  
      const results = [];
  
      for (let email of emails) {
        console.log("Processing email:", email); // Logging which email is being processed
  
        try {
          const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false`, {
              method: 'GET',
              headers: {
                  'User-Agent': 'breachdetector',
                  'hibp-api-key': 'd6c5fbdd8570474f90ac68b6f17e61f4',
              },
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            results.push({ email, breaches: data });
          } else {
            throw new Error("Received non-JSON response");
          }
          
        } catch (error) {
          console.log("Error processing email:", email, error.message); // Logging errors for each email
          results.push({ email, error: handleErrorForEmail(error) });
        }
    
        // Introduce a 3200ms delay
        await new Promise(resolve => setTimeout(resolve, 7000));
      }
  
      return new Response(JSON.stringify(results), {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
  
    } catch (error) {
      console.log("General error:", error.message); // Logging general errors
      const errorMessage = handleError(error);
      return new Response(JSON.stringify(errorMessage), {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      });
    }
  }
  

function handleErrorForEmail(error) {
  if (error.response) {
    return { message: `Error ${error.response.statusText}` };
  } else if (error.request) {
    return { message: `No response was received from the server` };
  } else {
    return { message: `Error: ${error.message}` };
  }
}

function handleError(error) {
  if (error.response) {
    return { message: `Error ${error.response.statusText}` };
  } else if (error.request) {
    return { message: `No response was received from the server` };
  } else {
    return { message: `Error: ${error.message}` };
  }
}
