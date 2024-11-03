const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());


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
        contactAuthorities();
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
const contactAuthorities = (full_convo) => {
    console.log("Contacting Authorities:");

    var location = getLocation();
    var details = getDetails(full_convo);
    console.log("\n #################")
    console.log("Sending sms to authorities");
    console.log(location);
    console.log(details);
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

const getDetails = (full_convo) => {
    return "LOL";
}

