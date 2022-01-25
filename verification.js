import log from './log.js';

export default async function handler(body, req) {
    await log(req.url, JSON.stringify({"new-subscription": true,"status": "enabled", "type": "stream.online"}));
    // Return usable data that will be sent back to the user
    return [200, body.challenge];
}