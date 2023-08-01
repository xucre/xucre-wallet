// eslint-disable-next-line react-native/split-platform-components
import { ToastAndroid } from 'react-native';


const sendEmail = (to, subjectField, body, navigation, menssageEmail) => {


    //Main Params
  /*   console.log('to', to);
    console.log('subject', subjectField);
    console.log('body', body); */

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer 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");

    

    const message = JSON.stringify({
        content: 
            [
                {
                    type: 'text/plain', 
                    value: body
                }
            ],
        from:
            {
                email:'support@xucre.io',
                name:'Support'
            },
        personalizations:[
            {
            cc:[
                {
                    email: to
                }
            ],    
            subject: subjectField,
            to: [
                {
                    email: 'support@xucre.io',
                    name:'Support'
                }
            ],
            },
        ],
    });

    const requestOptions = {
        body: message,
        headers: myHeaders,
        method: 'POST',
        redirect: 'follow',
    } as unknown as RequestInit;

    const emailCall = async () => {
        //console.log('requestOptions1 ', requestOptions)
        try {
            await fetch(
                'https://api.sendgrid.com/v3/mail/send', requestOptions)
                .then(response => {
                    response.json()
                        .then(data => {
                            //console.log('value: ' + JSON.stringify(response));
                        });
                })
                navigation.navigate('ViewWallet');   

                ToastAndroid.show(menssageEmail,ToastAndroid.SHORT);
                
        }
        catch (error) {
            console.error('error', error);
        }
    }

    return emailCall();
}

export default sendEmail;