
![itch banner](https://github.com/user-attachments/assets/2e887309-c182-4101-864c-a992f1c53bc1)


SOS is the life-saving OMI AI wearable app. When SOS detects you are in a dangerous situation (Say "SOS"), it will contact the authorities with your location & context, to get you help ASAP.

## Demo

https://x.com/shreybirmiwal/status/1857880411767967761 (Click Image)
[![image](https://github.com/user-attachments/assets/ac88c7af-c86f-47fd-8a68-e76518d739be)](https://x.com/shreybirmiwal/status/1857880411767967761)


https://github.com/user-attachments/assets/2c03ca5d-2415-4d6b-a149-4263100b2c58


## Future Improvements
- Send to multiple contacts, not just 1
- More reliable send (use Twilio or similar). Currently unstable because using jank solution to get around Twilio cost + verification
- Trigger on 'SOS' in real-time (transcript processed) rather than memory created

## Pages
To all links, append UID like ?uid=xyz
- Authentication Page (Through README, when user downloads app): https://sos-auth.vercel.app/
- Webhook to send JSON payloads here of memory: https://sos-orcin.vercel.app/api
- Webhook to check if user auth: https://sos-orcin.vercel.app/setup_completed_url



## Guide for OMI users README:
Note that sos-auth URL will have user UID appended
```
# Setting Up SOS

1. Follow authentication steps below
2. When in situations of dangers, say "SOS"
3. When the memory is created, it will notice the SOS, and contact your emergency contact

## Authentication 


1. Open (https://sos-auth.vercel.app/)[https://sos-auth.vercel.app/]
2. Follow directions by inputing your emergenecy contacts


## Troubleshooting

[Common issues and solutions coming soon]

---

> Experimental feature. Feedback: shreybirmiwal@gmail.com
```

## Omi Plugin Published Details
```
  {
    "id": "SOS",
    "name": "SOS-Emergency Help",
    "author": "Shrey Birmiwal",
    "description": "Alerts authorities and emergency contacts if OMI detects you are in danger. Say 'SOS' and OMI will send your location and context to get you help ASAP.",
    "image": "/plugins/logos/SOS-logo.png",
    "capabilities": [
      "external_integration"
    ],
    "external_integration": {
      "triggers_on": "memory_creation",
      "webhook_url": "https://sos-orcin.vercel.app/api",
      "setup_completed_url": "https://sos-orcin.vercel.app/setup_completed_url",
      "setup_instructions_file_path": "/plugins/instructions/SOS/README.md"
    },
    "deleted": false
  }
```


## Contributing
We welcome any contributions. Please leave a pull request!
Make sure to create a .env in the root directory with the following:
```
EMAIL_KEY=YOUR_GMAIL_APP_SPECIFIC_PASSWORD_KEY
OPENAI_API_KEY=YOUR_OPENAI_KEY
```

**Current File Format:**
- /sos_frontend : ReactJS front end for the authentication page. Writes user emergency data into firebase
- config.js : Firebase setup for nodejs
- index.js : Routes for the api to get webhooks from OMI and return values
- vercel.json : Just for deployement to vercel for the node.js server

