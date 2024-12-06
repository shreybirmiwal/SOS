const express = require("express");
const cors = require("cors");
const User = require("./config");
const nodemailer = require('nodemailer');
require("dotenv").config();
const OpenAI = require("openai");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'birmiwalshrey@gmail.com',
        pass: process.env.EMAIL_KEY,
    },
});

// Verify the transporter connection asynchronously
const verifyTransporter = async () => {
    try {
        await new Promise((resolve, reject) => {
            transporter.verify((error, success) => {
                if (error) {
                    console.error('Verification failed:', error);
                    reject(error);
                } else {
                    console.log('Server is ready to send messages');
                    resolve(success);
                }
            });
        });
    } catch (error) {
        console.error('Error during transporter verification:', error);
    }
};

verifyTransporter();

const openai = new OpenAI(); // API Key is stored in .env file automatically pulled

app.post("/api", async (req, res) => {
    const { uid } = req.query;
    const segments = req.body;
    let test = "uid" + uid;

    let full_convo = "";

    segments.transcript_segments.forEach(segment => {
        full_convo += segment.text + " ";
    });

    full_convo = full_convo.toLowerCase();
    console.log("Full Convo ########### \n", full_convo);

    const sosRegex = /\bsos\b/;
    if (sosRegex.test(full_convo)) {
        console.log("SOS DETECTED");
        await contactAuthorities(segments, full_convo, uid, res);
    } else {
        test = "   " + test + "USER is SAFE";
        res.json({ message: "" });
    }
});

const contactAuthorities = async (segments, full_convo, uid, res) => {
    const location = getLocation(segments);
    const details = await getDetails(full_convo);
    const { emergencyContact: sendTo } = await getContacts(uid);

    console.log("\n #################");
    console.log("Sending email to authorities");
    console.log(location);
    console.log(details);
    console.log(sendTo);
    console.log("################# \n");

    try {
        await sendMessage(sendTo, `SOS: Location: ${location.latitude}, ${location.longitude}. Details: ${details}`, res);
        res.json({ message: "SOS detected - emergency contacts messaged. Help OTW!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message." });
    }
};

const getLocation = (segments) => {
    return segments.geolocation ? {
        latitude: segments.geolocation.latitude,
        longitude: segments.geolocation.longitude
    } : { latitude: 0, longitude: 0 };
};

const getDetails = async (full_convo) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: "You are to analyze this conversation and find context clues. The user is in danger..." }, { role: "user", content: full_convo }],
    });
    return completion.choices[0].message.content;
};

const getContacts = async (uid) => {
    const snapshot = await User.get();
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const user = list.find(user => user.id === uid);

    if (!user) return -1;
    return { emergencyContact: user.emergencyContacts[0] };
};

const sendMessage = async (sendTo, message, res) => {
    const mailOptions = {
        from: 'birmiwalshrey@gmail.com',
        to: sendTo,
        subject: 'SOS DETECTED!',
        text: message,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                reject(err);
            } else {
                console.log('Email sent successfully:', info);
                resolve(info);
            }
        });
    });
};

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


app.get("/setup_completed_url", async (req, res) => {
    const { uid } = req.query;

    if (!uid) {
        return res.status(400).json({ error: "UID is required" });
    }

    // Get user document
    const snapshot = await User.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //console.log("List", list);
    const user = list.find((user) => user.id === uid);

    console.log(user);

    if (!user) {
        return res.json({ is_setup_completed: false });
    }

    return res.json({ is_setup_completed: true });

});




//SAMPLE DATA:
// SAMPLE:
// https://sos-orcin.vercel.app/api?uid=jOVUtBP2YdPgi7L1NyS8yXfwGqE2
// http://localhost:3001/api?uid=jOVUtBP2YdPgi7L1NyS8yXfwGqE2

// {
//     "id": "be2713b3-11bc-4789-b77f-d660aab0ea35",
//         "created_at": "2024-11-06T23:41:04.034988+00:00",
//             "started_at": "2024-11-06T23:41:04.034988+00:00",
//                 "finished_at": "2024-11-06T23:42:33.113905+00:00",
//                     "source": "friend",
//                         "language": "en",
//                             "structured": {
//         "title": "Technical Troubleshooting",
//             "overview": "The conversation involves Speaker 1 troubleshooting an issue they seem to be experiencing, possibly due to their own mistake. Speaker 1 expresses surprise at the situation and is preparing to attempt a solution again.",
//                 "emoji": "\ud83d\udee0\ufe0f",
//                     "category": "technology",
//                         "action_items": [],
//                             "events": []
//     },
//     "transcript_segments": [
//         {
//             "text": "Let's see",
//             "speaker": "SPEAKER_01",
//             "speaker_id": 1,
//             "is_user": false,
//             "person_id": null,
//             "start": 43.38,
//             "end": 45.18
//         },
//         {
//             "text": "Hmm, maybe it was actually my mistake",
//             "speaker": "SPEAKER_01",
//             "speaker_id": 1,
//             "is_user": false,
//             "person_id": null,
//             "start": 84.24000000000001,
//             "end": 85.68
//         },
//         {
//             "text": "",
//             "speaker": "SPEAKER_02",
//             "speaker_id": 2,
//             "is_user": false,
//             "person_id": null,
//             "start": 90.84,
//             "end": 90.84
//         },
//         {
//             "text": "Oh, it's coming in. This is insane.",
//             "speaker": "SPEAKER_01",
//             "speaker_id": 1,
//             "is_user": false,
//             "person_id": null,
//             "start": 90.84,
//             "end": 92.94
//         },
//         {
//             "text": "",
//             "speaker": "SPEAKER_02",
//             "speaker_id": 2,
//             "is_user": false,
//             "person_id": null,
//             "start": 129.6,
//             "end": 129.6
//         },
//         {
//             "text": "Okay, this time I'm going to try",
//             "speaker": "SPEAKER_01",
//             "speaker_id": 1,
//             "is_user": false,
//             "person_id": null,
//             "start": 129.6,
//             "end": 130.85999999999999
//         }
//     ],
//         "geolocation": null,
//             "photos": [],
//                 "plugins_results": [
//                     {
//                         "plugin_id": "conversation-summarizer",
//                         "content": "The conversation involves Speaker 1 expressing uncertainty about a mistake and experiencing a surprising moment, presumably related to an ongoing task or situation. Speaker 2 does not contribute any verbal content. The main focus is on Speaker 1's realization and attempt to proceed with a task."
//                     },
//                     {
//                         "plugin_id": "gen-z-a-translator",
//                         "content": "I'm lowkey vibin' with the idea that it was a big L on my part, but sheesh, this situation is lit. I'm peeping that it's giving chaos, but I'm gonna try to flex and slay this time. Bet?"
//                     }
//                 ],
//                     "external_data": null,
//                         "discarded": false,
//                             "deleted": false,
//                                 "visibility": "private",
//                                     "processing_memory_id": null,
//                                         "status": "completed"
// }