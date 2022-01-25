import { readFile } from 'fs/promises';
import 'dotenv/config'
import fetch from 'node-fetch';

let unauthEmbed = JSON.parse(
    await readFile(
        new URL('./assets/unauthEmbed.json', import.meta.url)
    )
);

export default async function handler(req, data) {
    // Replace the data in the json template
    unauthEmbed.embed.fields[0].value = req.url;

    // Send embed to Discord Webhook
    let response = await fetch(process.env.loghook, {
        method: 'POST', 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "content": process.env.support,
            "embeds": [unauthEmbed.embed]
        })
    }).catch(err => console.error(err));
}