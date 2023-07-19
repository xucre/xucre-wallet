// eslint-disable-next-line react-native/split-platform-components
import { ToastAndroid } from 'react-native';

import { getWhatsAppToken } from './api'
  const whatsapp = (phone, template, templateLang, options = { param1 : '', param2: '' }, messageSend) => {

      //Main Params
    const phoneNumber = phone //TODO: Create validation for country code
    //Template params
    const templateName = template;
    const templateLanguage = templateLang;
    //Variables of Params
    const sendParam1 =  options?.param1;
    const sendParam2 = options?.param2;
    const body = JSON.stringify({
      messaging_product: 'whatsapp',
      template: {
        components: [{
          parameters: [{
            text: sendParam1,
            type: 'text',
          },
          {
            text: sendParam2,
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
        
        const tokenData = await getWhatsAppToken();
        const requestOptions = {
          body : body,
          headers: {
            'Authorization': tokenData.token,
            'Content-Type': 'application/json'
          },
          method: 'POST',
        }
        await fetch(
          tokenData.url, requestOptions)
          .then(response => {
            response.json()
              .then(data => {
                console.log('value: ' + JSON.stringify(data));
              });
          })
          ToastAndroid.show(messageSend,ToastAndroid.TOP);
      }
      catch (error) {
        console.error('error',error);
      }
    }
  
    return wspCall();
  }

    export default whatsapp;
