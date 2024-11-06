const express = require("express");
const cors = require("cors");
const User = require("./config");

const PORT = process.env.PORT || 3001;
const app = express();
require("dotenv").config();
const OpenAI = require("openai");

app.use(express.json());
app.use(cors());


//TWILIO
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

//openai
const openai = new OpenAI(); // API Key is stored in .env file automatically pulled

// Sample Data
// POST / your - endpoint ? session_id = abc123 & uid=user123

// [
//     {
//         "text": "Segment text",
//         "speaker": "SPEAKER_00",
//         "speakerId": 0,
//         "is_user": false,
//         "start": 10.0,
//         "end": 20.0
//     }
//     // More recent segments...
// ]

app.post("/api", async (req, res) => {
    const { session_id, uid } = req.query;
    const segments = req.body;
    var test = "session id" + session_id + "uid" + uid;

    //console.log(segments);
    var full_convo = "";

    for (var i = 0; i < segments.length; i++) {
        full_convo += segments[i].text + " ";
    }
    full_convo = full_convo.toLowerCase();

    var danger = false;
    if (full_convo.includes("sos")) {
        test = "    " + test + "SOS DETECTED";
        await contactAuthorities(full_convo, uid);
    }
    else {
        test = "   " + test + "USER is SAFE";
    }

    res.json({ message: test });
});


//setup_completed_url returns true if user has setup
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

app.get("/hello", (req, res) => {
    res.json({ message: "Hello from Express!" });
});


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});



//Helper Functions
const contactAuthorities = async (full_convo, uid) => {

    var location = getLocation();
    var details = await getDetails(full_convo);
    var sendTo = await getContacts(uid);


    console.log("\n #################")
    console.log("Sending sms to authorities");
    console.log(location);
    console.log(details);
    console.log(sendTo);
    console.log("################# \n")


    //put the output somewhere readable


    // //send smd
    //future: add feature to send to multiple contacts, include user name in messagelokl
    client.messages
        .create({
            body: `User in danger. Location: ${location.latitude}, ${location.longitude}. ${details}`,
            from: '+18888647569',
            to: sendTo
        })
        .then(message => console.log(message.sid))
        .catch(error => console.error('Error sending SMS:', error));
}


const getLocation = () => {
    var location = {
        latitude: 37.7749,
        longitude: -122.4194
    };
    return location;
}

const getDetails = async (full_convo) => {


    // return "Details here .. saving gpt credits";

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: "You are to analyze this conversation and find context clues. The user is in danger. This conversation is fragmented, but we need to figure out what the exact danger is, or any information that can help save/rescue/aid the user. Please find out as much details as you can, whilst answering in the most consise way possible. Use as few words as possible for your answer, by providing only information that is useful to helping save the person." }, { role: "user", content: full_convo }],
    });
    return completion.choices[0].message.content;
}

const getContacts = async (uid) => {

    //console.log("LOOKING FOR UID", uid);

    // Get user document
    const snapshot = await User.get();
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    //console.log("List", list);
    const user = list.find((user) => user.id === uid);

    console.log(user);

    if (!user) {
        return -1;
    }

    return user.emergencyContacts[0]; //only first contact for now

}