# SOS


- authentication page: https://sos-auth.vercel.app/
- send JSON payloads here: https://sos-orcin.vercel.app/api
- check if user auth here: https://sos-orcin.vercel.app/setup_completed_url




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