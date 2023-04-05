const sendEmail = (to, subjectField, body, navigation) => {
    //Main Params
    console.log('to', to);
    console.log('subject', subjectField);
    console.log('body', body);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer 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");

    

    const message = JSON.stringify({
        personalizations:[
            {
            to:
                [
                    {
                        email: to,
                        name:'User'
                    }
                ],    
            subject: subjectField
            }
        ],
        content: 
            [
                {
                    type: 'text/plain', 
                    value: body
                }
            ],
        from:
            {
                email:'carevalo@ennube.solutions',
                name:'Cristhian Arevalo'
            },
        reply_to:
            {	
                email: 'pjacome@ennube.solutions',
                name: 'Pablo Jacome'
                }
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: message,
        redirect: 'follow'
    };

    const emailCall = async () => {
        console.log('requestOptions1 ', requestOptions)
        try {
            await fetch(
                'https://api.sendgrid.com/v3/mail/send', requestOptions)
                .then(response => {
                    response.json()
                        .then(data => {
                            console.log('value: ' + JSON.stringify(response));
                        });
                })
                navigation.navigate('ViewWallet');       
        }
        catch (error) {
            console.error('error', error);
        }
    }

    return emailCall();
}

export default sendEmail;