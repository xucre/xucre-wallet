// send-email.js
// We can use react-native Linking to send email
import qs from 'qs';
import { Linking } from 'react-native';

export async function sendEmail(to, subject, body, options = {}) {
    console.log('entro sendEmail', to, subject)
    const { cc } = options;
    // eslint-disable-next-line functional/no-let
    let url = `mailto:${to}`;
    // Create email link query
    const query = qs.stringify({
        subject: subject,
        // eslint-disable-next-line sort-keys
        body: body,
        cc: cc,
    });
    if (query.length) {
        url += `?${query}`;
    }
    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
        // eslint-disable-next-line functional/no-throw-statement
        throw new Error('Provided URL can not be handled');
    }
    return Linking.openURL(url);
}