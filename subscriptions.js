// Import
import { readFile } from 'fs/promises';
import 'dotenv/config'
import fetch from 'node-fetch';

import twitchapi from './twitchapi.js';

export default async function(params, method, body) {
    const data = twitchapi(`eventsub/subscriptions?${params}`, method, body);
    return await data;

}