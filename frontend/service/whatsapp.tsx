import { getWhatsAppToken } from './api'
  const whatsapp = (phone, template, templateLang, options = { account: 0, amount: 0, }) => {
      //Main Params
    const phoneNumber = phone.phoneNumbers[0].number; //TODO: Create validation for country code
    //Template params
    const templateName = 'mediatest'; //TODO: Create multiple template on Whatsapp
    const templateLanguage = 'en'; //TODO: receive this accordingly
    //Variables of Params
    const trxAmount =  options?.amount;
    const trxAccount = options?.account;
    const body = JSON.stringify({
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
    });

    const wspCall = async () => {
      try {
        
        const { token, url } = await getWhatsAppToken();
        const requestOptions = {
          body : body,
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          },
          method: 'POST',
        }
        await fetch(
          url, requestOptions)
          .then(response => {
            response.json()
              .then(data => {
                console.log('value: ' + JSON.stringify(data));
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
