// eslint-disable-next-line react-native/split-platform-components
import { ToastAndroid } from 'react-native';

import { getWhatsAppToken } from './api'
  const whatsapp = (phone, template, templateLang, options = { account: String, amount: String }, menssageSend) => {

      //Main Params
    const phoneNumber = phone.phoneNumbers[0].number; //TODO: Create validation for country code
    //Template params
    const templateName = 'shareqrcode';  //TODO: Create multiple template on Whatsapp
    const templateLanguage = 'en_US'; //TODO: receive this accordingly
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
          ToastAndroid.show(menssageSend,ToastAndroid.SHORT);
      }
      catch (error) {
        console.error('error',error);
      }
    }
  
    return wspCall();
  }

    export default whatsapp;
