
  const twillioEmail = (to, subject, body) => {
      //Main Params
    let bearer = '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';
    let authorizationToken = 'Bearer ' + bearer;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': authorizationToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
      {
          "personalizations": [
              {
                  "to": [
                      {
                          "email": to,
                          "name": "User"
                      }
                  ],
                  "subject": subject
              }
          ],
          "content": [
              {
                  "type": "text/plain",
                  "value": body
              }
          ],
          "from": {
              "email": "carevalo@ennube.solutions",
              "name": "Cris Arevalo"
          },
          "reply_to": {
              "email": "carevalo@ennube.solutions",
              "name": "Cris Arevalo"
          }
      })
    };


    const wspCall = async () => {
      try {
        await fetch(
          'https://api.sendgrid.com/v3/mail/send', requestOptions)
          .then(response => {
            response.json()
              .then(data => {
                console.log('value: ' + JSON.stringify(response));
              });
          })
      }
      catch (error) {
        console.error('error',error);
      }
    }

    return wspCall();
  }

 export default twillioEmail;
