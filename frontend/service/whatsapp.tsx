
  const whatsapp = (phone, template, templateLang, options = {}) => {
      //Main Params
    let phoneNumber = phone.phoneNumbers[0].number; //TODO: Create validation for country code
    let bearer = 'EAAKP7SOJD78BAEONDzQR5dMDWGVlc1964sjtJXu3wtL6qJaXgIriizvRfVoCwhxcJyZAVWaYbNE62QAa6pcafAoUwZACa2cWCfillPpCs5IAmbsleTx4zxF305NyKvF8ZB8uDjB8RPG1olerx88fg1m5pBboPmZBZBNuKlPtdVFXKt33Yj04XEHUZBcFVyKOHxlRsjvJYxWJjJaPDZCswQe';
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
