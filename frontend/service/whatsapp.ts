const whatsapp = (phone, template, templateLang, options) => {
    //Main Params
  const phoneNumber = phone.phoneNumbers[0].number; //TODO: Create validation for country code
  const bearer = 'EAAKP7SOJD78BAH5hZALF288dSrnwQFLZBHOdKhJW7ZCsZBZC73uzLacywuu3AC0rbzAwRkKXLTBzZCdY95hFXZAunfZBJbg18PXTJ9ixkxB1O1UZAtCnVrO7fU7wDvm92ENzqjFv2ULNpVXi6rAEbEablCEYWEc2qbJGrOnSBrvpywLeb3zTad8KbFjnU5UYjxTo8yySJEwCHPoGwwG4XAWZB6';
  const authorizationToken = 'Bearer ' + bearer;
  //Template params
  const templateName = 'mediatest'; //TODO: Create multiple template on Whatsapp
  const templateLanguage = 'en'; //TODO: receive this accordingly
  //Variables of Params
  const trxAmount =  options.amount;
  const trxAccount = options.account;
  const requestOptions = {    
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      template: {
        components: [{          
          parameters: [{
            text: trxAmount,
            type: 'text',
          },
          {
            text: trxAccount,
            type: 'text',
          }
          ],
          type: 'body',
        }],        
        language: {
          code: templateLanguage
        },
        name: templateName,
      },      
      to: phoneNumber,
      type: 'template',
    }),
    headers: {
      'Authorization': authorizationToken,
      'Content-Type': 'application/json'
    },
    method: 'POST'
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
