const express = require("express");
const cors = require("cors");
const User = require("./config");

const PORT = process.env.PORT || 3001;
const app = express();
require("dotenv").config();
const OpenAI = require("openai");
const nodemailer = require('nodemailer');


app.use(express.json());
app.use(cors());


//email message 
const carrierGateways = {
    'verizon': '@vtext.com',
    'att': '@txt.att.net',
    'tmobile': '@tmomail.net',
    'sprint': '@messaging.sprintpcs.com',
};
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'birmiwalshrey@gmail.com',
        pass: 'szkm vkkh axuy srah',
    },
});



//openai
const openai = new OpenAI(); // API Key is stored in .env file automatically pulled


app.post("/api", async (req, res) => {
    const { uid } = req.query;
    const segments = req.body;
    var test = "uid" + uid;

    //console.log("Segments", segments);
    console.log("User UID:", test);

    //console.log(segments);
    var full_convo = "";

    var segs = segments.transcript_segments
    for (var i = 0; i < segs.length; i++) {
        full_convo += segs[i].text + " ";
    }
    full_convo = full_convo.toLowerCase();
    console.log("Full Convo ########### \n", full_convo);
    console.log("########### \n");

    //sos should only be detected if it is alone, not in a word
    const sosRegex = /\bsos\b/;
    if (sosRegex.test(full_convo)) {

        console.log("SOS DETECTED");
        await contactAuthorities(segments, full_convo, uid, res);

    }
    else {
        test = "   " + test + "USER is SAFE";
        res.json({ message: "" });
    }

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
const contactAuthorities = async (segments, full_convo, uid, res) => {

    var location = getLocation(segments);
    var details = await getDetails(full_convo);
    var sendTo = await getContacts(uid);


    console.log("\n #################")
    console.log("Sending sms to authorities");
    console.log(location);
    console.log(details);
    console.log(sendTo);
    console.log("################# \n")

    sendMessage(sendTo, "tmobile", `SOS detected Location: ${location.latitude}, ${location.longitude}. Details: ${details}`, res);

    res.json({ message: "SOS detected - emergency contacts messages. Help OTW!" });

}


const getLocation = (segments) => {

    if (!segments.geolocation) {
        return { latitude: 0, longitude: 0 };
    }

    var location = {
        latitude: segments.geolocation.latitude,
        longitude: segments.geolocation.longitude
    };
    return location;
}

const getDetails = async (full_convo) => {


    return "Details here .. saving gpt credits";

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


const sendMessage = async (phoneNumber, carrier, message, res) => {

    const carrierGateway = carrierGateways[carrier.toLowerCase()];
    if (!carrierGateway) {
        return res.status(400).json({ error: 'Unsupported carrier.' });
    }

    const recipientEmail = `${phoneNumber}${carrierGateway}`;

    const mailOptions = {
        from: 'birmiwalshrey@gmail.com',
        to: recipientEmail,
        subject: '',
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        return
    } catch (error) {
        console.error('Error sending SMS:', error);
        return
    }
}