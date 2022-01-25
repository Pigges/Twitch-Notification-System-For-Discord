# Twitch Notifications For Discord

## API Calls
Add header: "passcode"
The passcode is defined in the .env file and should be called "passcode"

* Get subscriptions /api/getSubs
    
    #### Usage: 
    **GET** ```api/getSubs```
    #### Return example:
    ```
    {
        "total": 1,
        "data": [
            {
                "id": "785fdf75-615a-4ea8-b7a4-f2cf1ad880c7",
                "status": "enabled",
                "type": "stream.online",
                "version": "1",
                "condition": {
                    "broadcaster_user_id": "75182590"
                },
                "created_at": "2022-01-25T04:39:58.795600332Z",
                "transport": {
                    "method": "webhook",
                    "callback": "https://example.domain/api/callback"
                },
                "cost": 1
            }
        ],
        "max_total_cost": 10000,
        "total_cost": 1,
        "pagination": {},
        "status": 200
    }
    ```

* Add Subscription /api/addSub

    ### Usage:
    **GET** ```api/addSub```
    #### Return example:
    ```
    {
        "data": [
            {
                "id": "785fdf75-615a-4ea8-b7a4-f2cf1ad880c7",
                "status": "webhook_callback_verification_pending",
                "type": "stream.online",
                "version": "1",
                "condition": {
                    "broadcaster_user_id": "75182590"
                },
                "created_at": "2022-01-25T04:39:58.795600332Z",
                "transport": {
                    "method": "webhook",
                    "callback": "https://example.domain/api/callback"
                },
                "cost": 1
            }
        ],
        "total": 1,
        "max_total_cost": 10000,
        "total_cost": 1,
        "status": 202
    }
    ```

* Delete Subscription /api/delSub

    ### Usage:
    **GET** ```api/delSub```
    #### Return example:
    ```
    {
        "status": 204,
        "deleted": [
            "eventsub/subscriptions?id=ef6a90b8-4a2e-4b08-a1ee-907a63e6404e"
        ]
    }
    ```

* Callback /api/callback

    **This api call should only be used by Twitch.**
    #### Usage:
    **POST** ```/api/callback```

    | Notification type | Description |
    |--------------|-----------|
    | notification | Contains the data for the event you subscribed to. See Processing an event. |
    | webhook_callback_verification | Contains the challenge used to prove that you own the event handler. This is the first event you’ll receive after subscribing to an event. See Responding to a challenge request.  |
    | revocation | Contains the reason why Twitch revoked your subscription. See Revoking your subscription. |
    
    *Source: [Twitch Developers](https://dev.twitch.tv/docs/eventsub/handling-webhook-events)*
    

## Deploy

One click deploy button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FPigges%2FTwitch-Notifications-For-Discord&env=webhook,loghook,passcode,secret,callback,auth,clientid,support&envDescription=Environment%20Variables%20required%20to%20run%20the%20Notification%20server&envLink=https%3A%2F%2Fgithub.com%2FPigges%2FTwitch-Notifications-For-Discord)


## Environment Variables

**webhook=** The webhook link where the notifications will be sent to

**loghook=** The webhook link where the logs will be sent to

**passcode=** Passcode used to protect the API from people who shouldn't access it

**auth=**

**clientid=**

**support=<@!295886122117234688>**