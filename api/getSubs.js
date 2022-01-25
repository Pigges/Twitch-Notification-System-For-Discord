// Import
import 'dotenv/config'

import log from '../log.js'
import subscriptions from '../subscriptions.js'

export default async function handler(req, res) {
    //console.log(req.headers.passcode);
    console.log(`req: ${req.url}`);
    if (req.method === 'GET') {
        let data;
        if (req.headers.passcode == process.env.passcode) {
            data = await subscriptions('', 'GET');
        } else {
            data = {"error": "Unauthorized"}
        }
        await log(req.url, JSON.stringify(data));
        

        res.send(data);
    }
}