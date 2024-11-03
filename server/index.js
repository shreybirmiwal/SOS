const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
require("dotenv").config();
const OpenAI = require("openai");

app.use(express.json());

//const openai = new OpenAI(); // API Key is stored in .env file automatically pulled

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
        await contactAuthorities(full_convo);
    }
    else {
        test = "   " + test + "USER is SAFE";
    }

    res.json({ message: test });
});


app.get("/hello", (req, res) => {
    res.json({ message: "Hello from Express!" });
});


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});



//Helper Functions
const contactAuthorities = async (full_convo) => {
    console.log("Contacting Authorities:");

    var location = getLocation();
    var details = await getDetails(full_convo);
    var sendTo = getContacts();


    console.log("\n #################")
    console.log("Sending sms to authorities");
    console.log(location);
    console.log(details);
    console.log(sendTo);
    console.log("################# \n")


    // //send smd
    // client.messages
    //     .create({
    //         body: 'Hello from Twilio',
    //         from: '+18888647569',
    //         to: '+18777804236'
    //     })
    //     .then(message => console.log(message.sid))
    //     .done();
}


const getLocation = () => {
    var location = {
        latitude: 37.7749,
        longitude: -122.4194
    };
    return location;
}

const getDetails = async (full_convo) => {


    return "Details here .. saving gpt credits";

    // const completion = await openai.chat.completions.create({
    //     model: "gpt-4o-mini",
    //     messages: [{ role: "system", content: "You are to analyze this conversation and find context clues. The user is in danger. This conversation is fragmented, but we need to figure out what the exact danger is, or any information that can help save/rescue/aid the user. Please find out as much details as you can, whilst answering in the most consise way possible. Use as few words as possible for your answer, by providing only information that is useful to helping save the person." }, { role: "user", content: full_convo }],
    // });
    // return completion.choices[0].message;
}

const getContacts = () => {
    var contacts = ["+18777804236", "+18777804236"];
    return contacts;
}