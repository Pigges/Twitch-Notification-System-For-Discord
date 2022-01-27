// Import
import { readFile } from 'fs/promises';
import 'dotenv/config'
import fetch from 'node-fetch';
import crypto from 'crypto';

import twitchapi from './twitchapi.js';

let notificationEmbed = JSON.parse(
    await readFile(
        new URL('./assets/notificationEmbed.json', import.meta.url)
    )
);

async function updateEmbed(data) {
    let embed = notificationEmbed.embed;
    // Setting up the links
    const streamLink = `twitch.tv/${data.streamData.user_login}`;
    const imageLink = data.streamData.thumbnail_url.replace("{width}", "1280").replace("{height}", "720") + `?id=${crypto.randomBytes(20).toString('hex')}`; // Generate a random id to get around the discord cache on images
    const thumbnailLink = `https://static-cdn.jtvnw.net/ttv-boxart/${encodeURIComponent(data.streamData.game_name)}-285x380.jpg`;

    //Author
    embed.author.name = data.streamData.user_name;
    embed.author.url = `https://${streamLink}`;
    embed.author.icon_url = data.userData.profile_image_url;

    // Embed details
    embed.title = `${data.streamData.user_name} just went live\n<:P:839161432620007514> <:o:839161432813207592> <:s:839161432259952671> <:t:839161432452104214> <:J:839161432359829504> <:Z:839161432674271282> <:e:839161432091525181> <:u:839161432716214322> <:s_:839161432259952671>`; // Setting the stream title
    embed.description = `**🔴 [${data.streamData.title}](https://${streamLink})**`// Stream Description

    // Fields (Game, Viewers)
    embed.fields[0].value = data.streamData.game_name; // Sets the game
    embed.fields[1].value = data.streamData.viewer_count; // Sets the viewer count

    // Images
    embed.image.url = imageLink;
    embed.thumbnail.url = thumbnailLink;

    // Footer
    embed.footer.text = streamLink;
    embed.footer.icon_url = data.userData.profile_image_url;
    embed.timestamp = data.userData.started_at; // The time the stream started

    // Returning the final embed
    return embed
}

async function getData(body) {
    // Get data for use in embed
    const stream = await twitchapi(`streams?user_id=${body.event.broadcaster_user_id}`, 'GET');
    const streamData = await stream.data[0];
    const game = await twitchapi(`games?id=${streamData.game_id}`, 'GET');
    const user = await twitchapi(`users?id=${streamData.user_id}`, 'GET');

    // Since we searched we need to choose the specific element in the returned list    
    const gameData = await game.data[0];
    const userData = await user.data[0];

    // Returing all the data
    return {streamData, gameData, userData};
}

export default async function handler(body) {

    // Make sure the request is correct
    if (!body.event) {return [406, {"status": "No event"}]}
    else if (body.event.type == "live") {

        // Get data and embed
        const data = await getData(body);
        const embed = await updateEmbed(data);

        // Send embed to Discord Webhook
        let response = await fetch(process.env.webhook, {
            method: 'POST', 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "content": "@everyone",
                "embeds": [await embed]
            })
        }).catch(err => console.error(err));

    } else {return [406, {"status": "No event"}]}

    return [202, {"status": "ok"}]
}