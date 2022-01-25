// Import
import { readFile } from 'fs/promises';
import 'dotenv/config'
import fetch from 'node-fetch';

let logEmbed = JSON.parse(
    await readFile(
        new URL('./assets/logEmbed.json', import.meta.url)
    )
);

export default async function(url, res) {
    // Replace the data in the json template
    logEmbed.embed.description = url;
    logEmbed.embed.fields[0].value = res;
    // Send embed to Discord Webhook
    let response = await fetch(process.env.loghook, {
        method: 'POST', 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "content": null,
            "embeds": [logEmbed.embed]
        })
    }).catch(err => console.error(err));

}