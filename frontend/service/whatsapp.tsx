
  const whatsapp = (phone, template, templateLang, options = {}) => {
      //Main Params
    let phoneNumber = phone.phoneNumbers[0].number; //TODO: Create validation for country code
    let bearer = 'EAAKP7SOJD78BAJ5AQRWI8uMZCYqdZCKwErI7N2v2WRZBhOmZC86W1VZArQF3s5U6RbtHtZAjsJuXpHJ2Cz8Wg9Gpvx9k8vUZBMEUoo554S0rDO16TuUrMVZCB7wdgUr8GS6vwZAi7gZB2vXGo3h7BOZCkrmXYnEZC2el2m4hRV3R6Ik50QvHt9CEhbNDm0BBnSsK5DKZCw5InXtNcTsJDVws9f3az';
    let authorizationToken = 'Bearer ' + bearer;
    //Template params
    let templateName = 'mediatest'; //TODO: Create multiple template on Whatsapp
    let templateLanguage = 'en'; //TODO: receive this accordingly
    //Variables of Params
    let trxAmount =  options.amount;
    let trxAccount = options.account;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': authorizationToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: templateLanguage
          },
          components: [{
            type: 'body',
            parameters: [{
              type: 'text',
              text: trxAmount
            },
            {
              type: 'text',
              text: trxAccount
            }
            ]
          }]
        }
      })
    };


    const wspCall = async () => {
      try {
        await fetch(
          'https://graph.facebook.com/v15.0/100338942927842/messages', requestOptions)
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

    export default whatsapp;
