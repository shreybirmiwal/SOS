# SOS
?uid=jOVUtBP2YdPgi7L1NyS8yXfwGqE2
    

    //future: add feature to send to multiple contacts, include user name in messagelokl


- authentication page: https://sos-auth.vercel.app/               (DONE)
- send JSON payloads here: https://sos-orcin.vercel.app/api           ()
- check if user auth here: https://sos-orcin.vercel.app/setup_completed_url     (DONE)




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
    "triggers_on": "transcript_processed",

    // a POST request with the memory object will be sent here as a JSON payload
    "webhook_url": "https://your-endpoint-url.com",

    // GET endpoint, that returns {'is_setup_completed': boolean} (Optional) if your app doesn't require setup, set to null.
    "setup_completed_url": "https://your-setup-completion-url.com",

    // Include a Readme with more details about your app in the PR
    "setup_instructions_file_path": "/apps/instructions/your-app/README.md"
  },
  "deleted": false
}




# Setting Up [Your App Name]

1. [First step]
   ![Step 1](assets/step_1.png)

2. [Second step]
   ![Step 2](assets/step_2.png)

## Authentication (if required)

If your app requires user-specific authentication (e.g., connecting to a user's Notion table):

1. In your authentication flow, use the `uid` query parameter we append this as query param to all your links in your
   README, so you can map user credentials.
2. [Authentication steps]
3. After successful authentication, return `{"is_setup_completed": true}` from your `setup_completed_url`.

If your app doesn't require user authentication (e.g., it's a purely LLM-based service), you can skip this section.

## Troubleshooting

[Common issues and solutions]

---

> Experimental feature. Feedback: [your email]
























SAMPLE:
https://sos-orcin.vercel.app/api?uid=jOVUtBP2YdPgi7L1NyS8yXfwGqE2
http://localhost:3001/api?uid=jOVUtBP2YdPgi7L1NyS8yXfwGqE2

{
    "id": "be2713b3-11bc-4789-b77f-d660aab0ea35",
    "created_at": "2024-11-06T23:41:04.034988+00:00",
    "started_at": "2024-11-06T23:41:04.034988+00:00",
    "finished_at": "2024-11-06T23:42:33.113905+00:00",
    "source": "friend",
    "language": "en",
    "structured": {
        "title": "Technical Troubleshooting",
        "overview": "The conversation involves Speaker 1 troubleshooting an issue they seem to be experiencing, possibly due to their own mistake. Speaker 1 expresses surprise at the situation and is preparing to attempt a solution again.",
        "emoji": "\ud83d\udee0\ufe0f",
        "category": "technology",
        "action_items": [],
        "events": []
    },
    "transcript_segments": [
        {
            "text": "Let's see",
            "speaker": "SPEAKER_01",
            "speaker_id": 1,
            "is_user": false,
            "person_id": null,
            "start": 43.38,
            "end": 45.18
        },
        {
            "text": "Hmm, maybe it was actually my mistake",
            "speaker": "SPEAKER_01",
            "speaker_id": 1,
            "is_user": false,
            "person_id": null,
            "start": 84.24000000000001,
            "end": 85.68
        },
        {
            "text": "",
            "speaker": "SPEAKER_02",
            "speaker_id": 2,
            "is_user": false,
            "person_id": null,
            "start": 90.84,
            "end": 90.84
        },
        {
            "text": "Oh, it's coming in. This is insane.",
            "speaker": "SPEAKER_01",
            "speaker_id": 1,
            "is_user": false,
            "person_id": null,
            "start": 90.84,
            "end": 92.94
        },
        {
            "text": "",
            "speaker": "SPEAKER_02",
            "speaker_id": 2,
            "is_user": false,
            "person_id": null,
            "start": 129.6,
            "end": 129.6
        },
        {
            "text": "Okay, this time I'm going to try",
            "speaker": "SPEAKER_01",
            "speaker_id": 1,
            "is_user": false,
            "person_id": null,
            "start": 129.6,
            "end": 130.85999999999999
        }
    ],
    "geolocation": null,
    "photos": [],
    "plugins_results": [
        {
            "plugin_id": "conversation-summarizer",
            "content": "The conversation involves Speaker 1 expressing uncertainty about a mistake and experiencing a surprising moment, presumably related to an ongoing task or situation. Speaker 2 does not contribute any verbal content. The main focus is on Speaker 1's realization and attempt to proceed with a task."
        },
        {
            "plugin_id": "gen-z-a-translator",
            "content": "I'm lowkey vibin' with the idea that it was a big L on my part, but sheesh, this situation is lit. I'm peeping that it's giving chaos, but I'm gonna try to flex and slay this time. Bet?"
        }
    ],
    "external_data": null,
    "discarded": false,
    "deleted": false,
    "visibility": "private",
    "processing_memory_id": null,
    "status": "completed"
}