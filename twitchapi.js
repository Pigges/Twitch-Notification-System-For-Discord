// Import
import { readFile } from 'fs/promises';
import 'dotenv/config'
import fetch from 'node-fetch';

const headerParams = {"Client-ID": process.env.clientid, "Authorization": process.env.auth, "Content-Type": "application/json"}

export default async function(url, method, body) {
    let data;

    try {
        const response = await fetch(`https://api.twitch.tv/helix/${url}`, {
            method: method, 
            headers: headerParams,
            body: JSON.stringify(body)
        })

        // A fail safe for method DELETE since it does not return any content
        if (method == 'DELETE') {

            // Successfully deleted the subscription.
            if (response.status == 204) {
                data = {"status": response.status, deleted: [url]}
            } else if (response.status == 404 || response.status == 401) {
                // The subscription was not found.
                // The caller failed authentication. Verify that your access token and client ID are valid.
                data = {"status": response.status, "error": response.statusText}
            }
        } else {
            // Else if all seems OK, convert to JSON
            data = await response.json();
            data.status = response.status;
        }
    } catch (err) {
        console.log(err)
        data = err
    }

    return await data;

}