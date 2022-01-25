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
            data = await subscriptions(`id=${req.query.id}`, 'DELETE');
        } else {
            data = {"error": "Unauthorized"}
        }
        await log(req.url, JSON.stringify(data));
        

        res.send(data);
    }
}