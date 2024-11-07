<img src=SOS-banner.png>
SOS is the life-saving OMI AI wearable app. When SOS detects you are in a dangerous situation (Say "SOS"), it will contact the authorities with your location & context, to get you help ASAP.

## Demo

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

1. Follow authentication steps
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
    "image": "/apps/logos/your-app-logo.jpg",
    "capabilities": [
        "external_integration"
    ],
    "external_integration": {
        "triggers_on": "memory_creation",
        "webhook_url": "https://sos-orcin.vercel.app/api",
        "setup_completed_url": "https://sos-orcin.vercel.app/setup_completed_url",
        "setup_instructions_file_path": "/apps/instructions/your-app/README.md"
    },
    "deleted": false
}
```


