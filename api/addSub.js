// Import packages
import 'dotenv/config'

// Import local
import log from '../log.js'
import subscriptions from '../subscriptions.js'

export default async function handler(req, res) {
    // Log the request URL
    console.log(`req: ${req.url}`);
    if (req.method === 'GET') {
        let data;
        if (req.headers.passcode == process.env.passcode) {
            data = await subscriptions('', 'POST', {
                //req.body.id
                "type": "stream.online",
                "version": "1",
                "condition": {
                    "broadcaster_user_id": req.query.id
                },
                "transport": {
                    "method": "webhook",
                    "callback": `https://${req.headers.host}/api/callback`, 
                    "secret": process.env.secret
                }
            });
        } else {
            data = {"error": "Unauthorized"}
        }
        await log(req.url, JSON.stringify(data));
        

        res.send(data);
    }
}