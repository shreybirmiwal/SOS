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

    console.log(segments);
    var full_convo = "";

    for (var i = 0; i < segments.length; i++) {
        full_convo += segments[i].text + " ";
    }
    full_convo = full_convo.toLowerCase();

    if (full_convo.includes("sos")) {
        //in danger mode
        console.log("SOS DETECTED");
    }
    else {
        console.log("USER is SAFE");
    }

    res.json({ message: test });
});

app.get("/hello", (req, res) => {
    res.json({ message: "Hello from Express!" });
});


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});