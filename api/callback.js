// Import
import 'dotenv/config';
import crypto from 'crypto';

import log from '../log.js';
import unauth from '../unauth.js';
import subscriptions from '../subscriptions.js';
import verifyMessage from '../verifyMessage.js';
import notification from '../notification.js';
import verification from '../verification.js';
import revocation from '../revocation.js';

const TWITCH_MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

export default async function handler(req, res) {
    console.log(`req: ${req.url}`);
    let data;
    if (req.method === 'POST') {
        // Verify that the message comes from Twitch
        if (!verifyMessage(req)) {
            // If the message is not from Twitch, respond with "Unauthorized"
            data = {"error": "Unauthorized"}
            console.log(data);
            await unauth(req, data);
            res.status(403).send(data);
        } else {
            let message;
            // Check what type of request it is
            if (req.headers[TWITCH_MESSAGE_TYPE] == 'notification') message = await notification(req.body);
            else if (req.headers[TWITCH_MESSAGE_TYPE] == 'webhook_callback_verification') message = await verification(req.body, req);
            else if (req.headers[TWITCH_MESSAGE_TYPE] == 'revocation') message = await revocation(req.body);
            res.status(message[0]).send(message[1]);
        }
    } else {
        data = {"error": 405}
        res.status(405).send(data);
    }

    await log(req.url, data);
}