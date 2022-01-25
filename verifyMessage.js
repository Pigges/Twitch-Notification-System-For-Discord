import 'dotenv/config';
import crypto from 'crypto';

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';


export default function handler(req) {
    // Make sure that the request has these headers before continuing
    if (!(req.headers[TWITCH_MESSAGE_ID] &&
    req.headers[TWITCH_MESSAGE_TIMESTAMP] &&
    req.headers[TWITCH_MESSAGE_SIGNATURE])) return false

    let secret = process.env.secret;
    let message = getHmacMessage(req);
    let hmac = HMAC_PREFIX + getHmac(secret, message);  // Signature to compare to Twitch's

    //console.log(`${hmac}\n${req.headers[TWITCH_MESSAGE_SIGNATURE]}`);

    let verified;

    true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE]) ?  verified = true : verified = false;

    return verified;
}

// Build the message used to get the HMAC.
function getHmacMessage(request) {
    return (request.headers[TWITCH_MESSAGE_ID] + 
        request.headers[TWITCH_MESSAGE_TIMESTAMP] + 
        JSON.stringify(request.body));
}

// Get the HMAC.
function getHmac(secret, message) {
    return crypto.createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

// Verify whether your signature matches Twitch's signature.
function verifyMessage(hmac, verifySignature) {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}