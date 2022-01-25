import { readFile } from 'fs/promises';
import 'dotenv/config'
import fetch from 'node-fetch';

let revoceEmbed = JSON.parse(
    await readFile(
        new URL('./assets/revoceEmbed.json', import.meta.url)
    )
);

export default async function handler(body) {

    // Replace the data in the json template
    revoceEmbed.embed.fields[0].value = body.subscription.id;
    revoceEmbed.embed.fields[1].value = body.subscription.status;
    revoceEmbed.embed.fields[2].value = body.subscription.type;
    revoceEmbed.embed.fields[3].value = body.subscription.condition.broadcaster_user_id;

    // Send embed to Discord Webhook
    let response = await fetch(process.env.loghook, {
        method: 'POST', 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "content": process.env.support,
            "embeds": [revoceEmbed.embed]
        })
    }).catch(err => console.error(err));

    // Return usable data that will be sent back to the user
    return [202, {"success": true}];
}